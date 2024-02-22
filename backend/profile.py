from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel


router = APIRouter()

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.bsec

base_path = "/Profile/"


class Profile(BaseModel):
    name: str
    surname: str
    date_of_birth: str
    retirement_date: str

# Get profile info
@router.get(base_path)
async def get_profile():
    collection = db.Profile
    try:
        return await collection.find_one()
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
