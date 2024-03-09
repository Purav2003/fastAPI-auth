from fastapi import APIRouter, HTTPException,Query
from auth.models import User,University
from auth.database import db
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from starlette.requests import Request
from typing import List
from bson import ObjectId


router = APIRouter()

PAGE_SIZE = 5  

SECRET_KEY = "fastAPI"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 48

class UniversityOut(University):
    id: str

class UniversityIn(University):
    pass

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

######### TO CREATE JWT TOKEN #########

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


######### TO DECODE JWT TOKEN #########

def decode_jwt(token):
    jwt_token = token
    if jwt_token:        
        try:
            decoded_token = jwt.decode(jwt_token,SECRET_KEY, algorithms=['HS256'])
            return decoded_token
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Token is invalied")
    else:
        raise HTTPException(status_code=401, detail="Token is missing")
    

def validate_token(token):
    if token is None:
        raise HTTPException(status_code=401, detail="Token is missing")
        
    payload = decode_jwt(token)
        
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    id = payload.get("sub")
    if id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    else: 
        return True
    
######### API ENDPOINTS #########

######### REGISTER USER API #########

@router.post("/register/")
async def register_user(user: User):
    collection = db["users"]
    existing_user = await collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.password)
    user_data = {"email": user.email, "password": hashed_password}
    result = await collection.insert_one(user_data)
    return {"id": str(result.inserted_id), "email": user.email}

######### LOGIN USER API #########

@router.post("/login/")
async def login_user(user: User):
    collection = db["users"]
    existing_user = await collection.find_one({"email": user.email})
    print(existing_user)
    if not existing_user or not pwd_context.verify(user.password, existing_user['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token_expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    access_token = create_access_token(data={"sub": str(existing_user["_id"])}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

######### CHANGE PASSWORD API #########

@router.put("/reset-password/")
async def reset_password(request: Request):
    request_body = await request.json()    
    new_password = request_body.get("new_password") 
    old_password = request_body.get("old_password")
    print(old_password, new_password)
    token = request.headers.get("Authorization", None)
    if token is None:
        raise HTTPException(status_code=401, detail="Token is missing")
    payload = decode_jwt(token)
    id = payload.get("sub")
    if id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    collection = db["users"]
    id_obj = ObjectId(id)
    user = await collection.find_one({"_id": id_obj})
    print(user)
    if not pwd_context.verify(old_password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid old password")    
    
    hashed_new_password = pwd_context.hash(new_password)
   
    if new_password == old_password:
        raise HTTPException(status_code=400, detail="New password is same as old password")
    
    id_obj = ObjectId(id)
    passw = await collection.update_one({"_id": id_obj}, {"$set": {"password": hashed_new_password}})
    if passw:
        return {"message": "Password reset successful","new":hashed_new_password}
    else:
        return {"message": "Password reset not successful"}

######### UPDATE EMAIL API #########

@router.put("/update-email/")
async def update_email(request: Request):
    request_body = await request.json()    
    new_email = request_body.get("new_email")
    token = request.headers.get("Authorization", None)
    if token is None:
        raise HTTPException(status_code=401, detail="Token is missing")
    payload = decode_jwt(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    id = payload.get("sub")
    if id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    collection = db["users"]
    id_obj = ObjectId(id)
    user = await collection.find_one({"_id":id_obj})
    email = user['email']
    if email == new_email:
        raise HTTPException(status_code=400, detail="New email is same as old email")
    
    id_obj = ObjectId(id)
    conf_email = await collection.update_one({"_id": id_obj}, {"$set": {"email": new_email}})
    if conf_email:
        return {"message": "Email updated successfully"}
    else:
        return {"message": "Email not updated"} 
    
######### PROFILE API #########

@router.get("/profile/")
async def profile(request: Request):
    token = request.headers.get("Authorization", None)
    if token is None:
        raise HTTPException(status_code=401, detail="Token is missing")
    payload = decode_jwt(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    id = payload.get("sub")
    if id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    collection = db["users"]
    id_obj = ObjectId(id)    
    user = await collection.find_one({"_id": id_obj})    
    if user:
        return {"email":user['email']}
    else:
        return {"message": "User not found"}
    
######### DELETE ACCOUNT API #########

@router.delete("/delete-account/")
async def delete_account(request: Request):
    token = request.headers.get("Authorization", None)
    if token is None:
        raise HTTPException(status_code=401, detail="Token is missing")
    payload = decode_jwt(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    id = payload.get("sub")
    if id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    collection = db["users"]
    id_obj = ObjectId(id)    
    user = await collection.find_one({"_id": id_obj})
    if user:
        conf_del = await collection.delete_one({"_id": id_obj})        
        if conf_del:
            return {"message": "Account deleted successfully"}
        else:
            return {"message": "Account not deleted "}
    else:
        return {"message": "User not found"}


######### UNIVERSITIES API ############

@router.post("/universities/")
async def create_university(university: UniversityIn,request:Request):
    token = request.headers.get("Authorization", None)
    validateToken = validate_token(token)    
    if validateToken:
        existing_university = await db["universities"].find_one({"name": university.name})
        if existing_university:
            raise HTTPException(status_code=400, detail="University with the same name already exists")
        result = await db["universities"].insert_one(university.dict())
        if result.inserted_id:
            return {"message": "University created successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to create university")

@router.get("/universities/{page_no}", response_model=List[UniversityOut])
async def get_universities(page_no: int,request:Request):
    token = request.headers.get("Authorization", None)
    validateToken = validate_token(token)    
    if(validateToken):
        if page_no < 1:
            raise HTTPException(status_code=400, detail="Page number must be greater than or equal to 1")

        skip_count = (page_no - 1) * PAGE_SIZE

        universities = await db["universities"].find().skip(skip_count).limit(PAGE_SIZE).to_list(length=None)
        universitiesId = [
            UniversityOut(**uni, id=str(uni["_id"])) for uni in universities
        ]
        return universitiesId

@router.get("/university/{university_id}", response_model=UniversityOut)
async def read_university(university_id: str,request:Request):
    token = request.headers.get("Authorization", None)
    validateToken = validate_token(token)    
    if(validateToken):
        university = await db["universities"].find_one({"_id": ObjectId(university_id)})
        if university:
            return UniversityOut(**university, id=str(university["_id"]))
        else:
            raise HTTPException(status_code=404, detail="University not found")

@router.put("/university/{university_id}")
async def update_university(university_id: str, university: UniversityIn,request:Request):
    token = request.headers.get("Authorization", None)
    validateToken = validate_token(token)
    if validateToken:    
        result = await db["universities"].replace_one({"_id": ObjectId(university_id)}, university.dict())
        if result.modified_count == 1:
            return {"message": "University updated successfully"}
        else:
            raise HTTPException(status_code=404, detail="University not found")

@router.delete("/university/{university_id}")
async def delete_university(university_id: str,request:Request):
    token = request.headers.get("Authorization", None)
    validateToken = validate_token(token)
    if validateToken:
        result = await db["universities"].delete_one({"_id": ObjectId(university_id)})
        if result.deleted_count == 1:
            return {"message": "University deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="University not found")

@router.get("/search/", response_model=List[UniversityOut])
async def search_universities(
   request:Request
):
    
    token = request.headers.get("Authorization", None)
    validateToken = validate_token(token)   
    if validateToken: 
        name = request.query_params.get("name")
        page_no = int(request.query_params.get("page_no", 1))
        page_size = int(request.query_params.get("page_size", 5))
        skip_count = (page_no - 1) * page_size
        search_query = {"name": {"$regex": name, "$options": "i"}}
        universities = await db["universities"].find(search_query).skip(skip_count).limit(page_size).to_list(length=None)
        universities_with_id = [
            UniversityOut(**uni, id=str(uni["_id"])) for uni in universities
        ]
        return universities_with_id

@router.get("/filter/", response_model=List[UniversityOut])
async def filter_universities(
    # name: str = Query(..., min_length=1, max_length=50),
    request: Request
):
    token = request.headers.get("Authorization", None)
    validateToken = validate_token(token)
    if(validateToken):
        name = request.query_params.get("name")
        search_query = {"name": {"$regex": name, "$options": "i"}}
        universities = await db["universities"].find(search_query).to_list(length=None)
        universities_with_id = [
            UniversityOut(**uni, id=str(uni["_id"])) for uni in universities
        ]
        return universities_with_id