from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from common import serialize_doc, db

router = APIRouter()

base_path = "/Incomes/"


class Income(BaseModel):
    id: str | None = Field(None, alias="_id")
    Type: int
    OneTime: bool
    Start: str
    End: str | None
    Frequency: int
    Value: float


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
        result = await collection.insert_one(income.model_dump())
        return {"_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Update income
@router.put(base_path)
async def update_income(income: Income):
    collection = db.Incomes
    try:
        await collection.update_one(
            {"_id": ObjectId(income.id)}, {"$set": income.model_dump(exclude={"_id"})}
        )
        return {"_id": str(income.id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Delete income
@router.delete(base_path + "{income_id}")
async def delete_income(income_id: str):
    collection = db.Incomes
    try:
        # Convert the string ID to ObjectId and attempt to delete the corresponding document
        result = await collection.delete_one({"_id": ObjectId(income_id)})
        if result.deleted_count == 0:
            return {"message": "Expense not found or already deleted.", "income_id": income_id}
        return {"message": "Expense deleted successfully.", "income_id": income_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
