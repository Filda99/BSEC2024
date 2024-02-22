from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

from common import serialize_doc

router = APIRouter()

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.bsec

base_path = "/Expenses/"


class Expenses(BaseModel):
    id: str
    type: str
    one_time: bool
    start: str
    end: str | None
    frequency: str
    value: float


# Get all expenses
@router.get(base_path)
async def get_expenses():
    collection = db.Expenses
    items = []
    try:
        async for item in collection.find():
            items.append(serialize_doc(item))
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Create new expenses
@router.post(base_path)
async def create_expecnes(expenses: Expenses):
    collection = db.expenses
    try:
        result = await collection.insert_one(expenses)
        return {"_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Update expenses
@router.put(base_path)
async def update_expenses(expenses: Expenses):
    collection = db.expenses
    try:
        result = await collection.update_one(expenses)
        return {"_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Delete expenses
@router.delete(base_path)
async def delete_expenses(expenses: Expenses):
    collection = db.expenses
    try:
        result = await collection.delete_one(expenses)
        return {"_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
