from fastapi import APIRouter, HTTPException
from auth.models import User
from auth.database import db
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from starlette.requests import Request
from bson import ObjectId


router = APIRouter()

SECRET_KEY = "fastAPI"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 48

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
