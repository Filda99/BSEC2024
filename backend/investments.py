from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from common import serialize_doc, db
from investLib import get_BaseInfo

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
    collection = db.Investments
    try:
        # Convert the string ID to ObjectId and attempt to delete the corresponding document
        result = await collection.delete_one({"_id": ObjectId(investments_id)})
        if result.deleted_count == 0:
            return {"message": "Expense not found or already deleted.", "investments_id": investments_id}
        return {"message": "Expense deleted successfully.", "investments_id": investments_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(base_path + "Prediction" + "/{investmentId}_{amount}")
async def prediction(investmentId: str, amount: float):
    try:
        stock = await get_BaseInfo(investmentId)
        pos = stock["Pozitivní scénář (růstová míra %)"]
        neut = stock["Neutrální scénář (růstová míra %)"]
        neg = stock["Negativní scénář (růstová míra %)"]
        init_value = amount
        pos_list, neut_list, neg_list = [init_value], [init_value], [init_value]
        for m in range(1, 13):
            pos_list.append((m / 12 * pos / 100 * init_value) + init_value)
            neut_list.append((m / 12 * neut / 100 * init_value) + init_value)
            neg_list.append((m / 12 * neg / 100 * init_value) + init_value)
        return {"pos": pos_list, "neut": neut_list, "neg": neg_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
