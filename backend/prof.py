from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from common import serialize_doc


router = APIRouter()

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.bsec

base_path = "/Profile/"


class Profile(BaseModel):
    id: str | None = Field(None, alias='_id')
    Name: str
    Surname: str
    DateOfBirth: str
    RetirementDate: str

# Get profile info
@router.get(base_path)
async def get_profile():
    collection = db.Profile
    try:
        data = await collection.find_one()
        return serialize_doc(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update profile info
@router.put(base_path)
async def update_profile(profile: Profile):
    collection = db.Profile
    try:
        await collection.update_one({}, {"$set": profile.model_dump()})
        return profile.model_dump()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
