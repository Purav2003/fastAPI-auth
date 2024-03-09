# database.py
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGODB_URI")
client = AsyncIOMotorClient("mongodb+srv://shahpurav308:Purav308@cluster0.05wrhqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["auth"]  
print("DBBBBBBBBBBB",db)
print(client)
