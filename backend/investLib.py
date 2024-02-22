from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from common import serialize_doc


client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.bsec

# Function to get specific stock from database by name
def get_stock(name: str):
    collection = db.Stocks
    try:
        return serialize_doc(collection.find_one({"Name": name}))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    