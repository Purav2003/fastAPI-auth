from pydantic import BaseModel,HttpUrl
from typing import List


class User(BaseModel):
    email: str
    name:str
    phone: str
    password: str

class University(BaseModel):
    name: str
    location: str
    established_year: int
    total_students: int = None
    courses_offered: List[str] = []
    tuition_fee: float = None
    acceptance_rate: float = None
    student_faculty_ratio: float = None
    campus_size: float = None
    website: str = None
    ranking: int = None
    image_url: str = None
    google_review: float = None
    uniReview: str = None
    
