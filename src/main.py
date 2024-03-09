# main.py
from fastapi import FastAPI
from project.api_routes import router as api_router

app = FastAPI()
app.include_router(api_router)
