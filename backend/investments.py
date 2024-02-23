from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from common import serialize_doc, db

router = APIRouter()

base_path = "/Investments/"


class Investments(BaseModel):
    id: str | None = Field(None, alias="_id")
    Type: int
    OneTime: bool
    Start: str
    End: str | None
    Frequency: int
    Value: float
    InvestmentId: str


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
        await collection.update_one({"_id": ObjectId(investments.id)}, {"$set": investments.model_dump()})
        return {"_id": str(investments.id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Delete investment
@router.delete(base_path + "{investments_id}")
async def delete_investments(investments_id: str):
    collection = db.Expenses
    try:
        # Convert the string ID to ObjectId and attempt to delete the corresponding document
        result = await collection.delete_one({"_id": ObjectId(investments_id)})
        if result.deleted_count == 0:
            return {"message": "Expense not found or already deleted.", "investments_id": investments_id}
        return {"message": "Expense deleted successfully.", "investments_id": investments_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
