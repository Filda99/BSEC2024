from bson import ObjectId
from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

from common import serialize_doc

router = APIRouter()

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.bsec

base_path = "/Investments/"


class Investments(BaseModel):
    Id: str
    Type: str
    OneTime: bool
    Start: str
    End: str | None
    Frequency: str
    Value: float


# Get all investments
@router.get(base_path)
async def get_investments():
    collection = db.Investments
    items = []
    try:
        async for item in collection.find():
            items.append(serialize_doc(item))
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Create new investments
@router.post(base_path)
async def create_investments(investments: Investments):
    collection = db.Investments
    try:
        result = await collection.insert_one(investments.model_dump())
        return {"_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Update investments
@router.put(base_path)
async def update_investments(investments: Investments):
    collection = db.Investments
    try:
        await collection.update_one({"_id": ObjectId(investments.Id)}, {"$set": investments.model_dump()})
        return {"_id": str(investments.Id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Delete investments
@router.delete(base_path)
async def delete_investments(investments: Investments):
    collection = db.Investments
    try:
        await collection.delete_one({"_id": ObjectId(investments.Id)})
        return {"_id": str(investments.Id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
