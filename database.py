# database.py
from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB Atlas connection string
MONGO_URI = "mongodb+srv://shahpurav308:Purav308@cluster0.05wrhqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = AsyncIOMotorClient(MONGO_URI)
db = client["auth"]  # Change "test_database" to your database name
print(client)
