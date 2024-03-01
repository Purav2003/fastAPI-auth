# main.py
from fastapi import FastAPI
from api import router as api_router

# Initialize FastAPI app
app = FastAPI()

# Include API router
app.include_router(api_router)
