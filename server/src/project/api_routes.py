from fastapi import APIRouter
from . import auth_view, university_view

router = APIRouter()

router.include_router(auth_view.router, tags=["User"])
router.include_router(university_view.router, tags=["University"])
