from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

app = FastAPI()

client = AsyncIOMotorClient('mongodb://localhost:27017')
db = client.bsec

# Helper function to handle MongoDB ObjectId
def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@app.get("/")
async def root():
    return {"message": "Hello from the bsec database"}

@app.get("/items/")
async def read_items():
    collection = db.bsec
    items = []
    try:
        async for item in collection.find():
            items.append(serialize_doc(item))
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
