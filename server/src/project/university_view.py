from fastapi import APIRouter, HTTPException, Request
from project.models import University
import jwt
from project.database import db
from bson import ObjectId
from typing import List
from pydantic import BaseModel

router = APIRouter()
from enum import Enum

PAGE_SIZE = 8 

class UniversityFilters(BaseModel):
    country: str = None
    ranking: int = None


class FilterType(str, Enum):
    country = "country"
    ranking = "ranking"


class UniversityOut(University):
    id: str

class UniversityIn(University):
    pass

SECRET_KEY = "fastAPI"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 48


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

# Create University API
@router.post("/universities/")
async def create_university(university: University,request:Request):
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

# Get Universities API
@router.get("/universities/", response_model=List[UniversityOut])
async def get_universities(
    request: Request,
    page_no: int = 1,
    page_size: int = PAGE_SIZE,
    search_term: str = None,
    filters: UniversityFilters = UniversityFilters()
):
    token = request.headers.get("Authorization", None)
    validateToken = validate_token(token)
    if validateToken:
        if page_no < 1:
            raise HTTPException(
                status_code=400, detail="Page number must be greater than or equal to 1"
            )

        query = {}
        if search_term:
            # Case-insensitive search for universities containing the search term
            query["name"] = {"$regex": search_term, "$options": "i"}

        # Apply filters
        if filters.country:
            query["country"] = filters.country
        if filters.ranking:
            query["ranking"] = filters.ranking

        total_universities = await db["universities"].count_documents(query)

        skip_count = (page_no - 1) * page_size
        universities = await db["universities"].find(query).skip(skip_count).limit(page_size).to_list(length=None)
        universitiesId = [
            UniversityOut(**uni, id=str(uni["_id"])) for uni in universities
        ]
        return universitiesId

# Read University API
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

# Update University API
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

# Delete University API
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