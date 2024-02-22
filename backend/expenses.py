from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pydantic.fields import Field

from common import serialize_doc, db

router = APIRouter()

base_path = "/Expenses/"


class Expenses(BaseModel):
    id: str | None = Field(None, alias="_id")
    Type: str
    OneTime: bool
    Start: str
    End: str | None
    Frequency: str
    Value: float


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
async def create_expenses(expenses: Expenses):
    collection = db.Expenses
    try:
        result = await collection.insert_one(expenses.model_dump())
        return {"_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update expenses
@router.put(base_path)
async def update_expenses(expenses: Expenses):
    collection = db.Expenses
    try:
        await collection.update_one(
            {"_id": ObjectId(expenses.id)}, {"$set": expenses.model_dump(exclude={"_id"})}
        )
        return {"_id": str(expenses.id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Delete expenses
@router.delete(base_path+"{expense_id}")
async def delete_expenses(expense_id: str):
    collection = db.Expenses
    try:
        # Convert the string ID to ObjectId and attempt to delete the corresponding document
        result = await collection.delete_one({"_id": ObjectId(expense_id)})
        if result.deleted_count == 0:
            return {"message": "Expense not found or already deleted.", "expense_id": expense_id}
        return {"message": "Expense deleted successfully.", "expense_id": expense_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
