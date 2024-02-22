from bson import ObjectId
from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

from common import serialize_doc

router = APIRouter()

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.bsec

base_path = "/Incomes/"


class Income(BaseModel):
    id: str
    type: str
    one_time: bool
    start: str
    end: str | None
    frequency: str
    value: float


# Get all incomes
@router.get(base_path)
async def get_incomes():
    collection = db.Incomes
    items = []
    try:
        async for item in collection.find():
            items.append(serialize_doc(item))
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Create new income
@router.post(base_path)
async def create_income(income: Income):
    collection = db.Incomes
    try:
        result = await collection.insert_one(income)
        return {"_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Update income
@router.put(base_path)
async def update_income(income: Income):
    collection = db.Incomes
    try:
        await collection.update_one({"_id": ObjectId(income.id)}, {"$set": income.model_dump()})
        return {"_id": income.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Delete income
@router.delete(base_path)
async def delete_income(income: Income):
    collection = db.Incomes
    try:
        await collection.delete_one({"_id": ObjectId(income.id)})
        return {"_id": income.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
