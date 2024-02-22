from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.encoders import jsonable_encoder

app = FastAPI()

# Initialize MongoDB client and select your database
client = AsyncIOMotorClient('mongodb://localhost:27017')
db = client.yourDatabaseName

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/items/")
async def read_items():
    collection = db.yourCollectionName
    items = []
    async for item in collection.find():
        items.append(item)
    return jsonable_encoder(items)
