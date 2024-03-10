from fastapi import APIRouter, HTTPException, Request
from project.models import User
from project.database import db
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
from bson import ObjectId

router = APIRouter()

SECRET_KEY = "fastAPI"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 48

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

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

# Register User API
@router.post("/register/")
async def register_user(user: User):
    collection = db["users"]
    existing_user_email = await collection.find_one({"email": user.email})
    existing_user_phone = await collection.find_one({"phone": user.phone})
    if existing_user_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    if existing_user_phone:
        raise HTTPException(status_code=400, detail="Phone already registered")
    hashed_password = pwd_context.hash(user.password)
    user_data = {"email": user.email, "password": hashed_password, "name": user.name, "phone": user.phone}
    result = await collection.insert_one(user_data)
    return {"id": str(result.inserted_id), "email": user.email}

# Login User API
@router.post("/login/")
async def login_user(request:Request):
    collection = db["users"]
    data = await request.json()
    email = data.get("email")
    password = data.get("password")
    existing_user = await collection.find_one({"email": email})
    if not existing_user or not pwd_context.verify(password, existing_user['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token_expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    access_token = create_access_token(data={"sub": str(existing_user["_id"])}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

# Change Password API
@router.put("/reset-password/")
async def reset_password(request: Request):
    request_body = await request.json()    
    new_password = request_body.get("new_password") 
    old_password = request_body.get("old_password")
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
    if not pwd_context.verify(old_password, user['password']):
        raise HTTPException(status_code=400, detail="Invalid old password")    
    hashed_new_password = pwd_context.hash(new_password)
    if new_password == old_password:
        raise HTTPException(status_code=400, detail="New password is same as old password")
    id_obj = ObjectId(id)
    passw = await collection.update_one({"_id": id_obj}, {"$set": {"password": hashed_new_password}})
    if passw:
        return {"message": "Password reset successful","new":hashed_new_password}
    else:
        return {"message": "Password reset not successful"}
    

@router.post("/forgot-password/")
async def forgot_password(request:Request):
    request_body = await request.json()
    email = request_body.get("email")
    new_password = request_body.get("new_password")
    collection = db["users"]
    existing_user = await collection.find_one({"email": email})
    if not existing_user:
        raise HTTPException(status_code=400, detail="Email not registered")
    else:
        hashed_new_password = pwd_context.hash(new_password)
        id_obj = ObjectId(existing_user["_id"])
        passw = await collection.update_one({"_id": id_obj}, {"$set": {"password": hashed_new_password}})
        if passw:
            return {"message": "Password reset successful","new":hashed_new_password}
        else:
            return {"message": "Password reset not successful"}
        

# Update Email API
@router.put("/update-profile/")
async def update_profile(request: Request):
    request_body = await request.json()    
    new_email = request_body.get("new_email")
    new_phone = request_body.get("new_phone")
    new_name = request_body.get("new_name")
    print(new_email,new_phone,new_name)
    
    token = request.headers.get("Authorization", None)
    if token is None:
        raise HTTPException(status_code=401, detail="Token is missing")
    
    payload = decode_jwt(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    collection = db["users"]
    user = await collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_query = {}
    update_message = "Profile not updated"

    if new_email:
        if new_email != user.get("email"):
            existing_user_with_email = await collection.find_one({"email": new_email})
            if existing_user_with_email:
                raise HTTPException(status_code=400, detail="Email already registered")
            else:
                update_query["email"] = new_email
                update_message = "Profile updated successfully"

    if new_phone:
        if new_phone != user.get("phone"):
            existing_user_with_phone = await collection.find_one({"phone": new_phone})
            if existing_user_with_phone:
                raise HTTPException(status_code=400, detail="Phone number already registered")
            else:
                update_query["phone"] = new_phone
                update_message = "Profile updated successfully"

    if new_name:
        if new_name != user.get("name"):
            update_query["name"] = new_name
            update_message = "Profile updated successfully"

    if update_query:
        await collection.update_one({"_id": ObjectId(user_id)}, {"$set": update_query})
    
    return {"message": update_message}

    
# Profile API
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
        return {"email":user['email'],"name":user['name'],"phone":user['phone']} 
    else:
        return {"message": "User not found"}
    
# Delete Account API
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
