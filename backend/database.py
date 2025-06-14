from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client = AsyncIOMotorClient(settings.mongodb_url)
database = client[settings.database_name]

users_collection = database.users

async def connect_to_mongo():
    """Create database connection"""
    try:
        await database.command("ping")
        print("Connected to MongoDB successfully!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    client.close()
    print("Disconnected from MongoDB")