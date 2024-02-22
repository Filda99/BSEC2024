from motor.motor_asyncio import AsyncIOMotorClient

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.bsec
