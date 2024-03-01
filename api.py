# api.py
from fastapi import APIRouter, HTTPException
from models import User
from database import db
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta

router = APIRouter()

SECRET_KEY = "your_secret_key"  # Change this to your secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 48

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

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

@router.post("/login/")
async def login_user(user: User):
    collection = db["users"]
    
    existing_user = await collection.find_one({"email": user.email})
    if not existing_user or not pwd_context.verify(user.password, existing_user['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create JWT token
    access_token_expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/forget-password/")
async def forget_password(email: str):
    collection = db["users"]
    
    # Check if the email exists
    existing_user = await collection.find_one({"email": email})
    if not existing_user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Generate JWT token for password reset
    expires = datetime.utcnow() + timedelta(hours=1)
    reset_token = jwt.encode({"email": email, "exp": expires}, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"reset_token": reset_token}


@router.post("/change-password/")
async def change_password(user):
    collection = db["users"]
    
    # Verify old password and update new password
    existing_user = await collection.find_one({"email": user.email})
    if not existing_user or not pwd_context.verify(user.old_password, existing_user['password']):
        raise HTTPException(status_code=401, detail="Invalid old password")
    
    # Update password in the database
    hashed_password = pwd_context.hash(user.new_password)
    await collection.update_one({"email": user.email}, {"$set": {"password": hashed_password}})
    
    return {"message": "Password changed successfully"}