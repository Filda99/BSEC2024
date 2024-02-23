from gc import collect
import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from incomes import router as incomes_router
from expenses import router as expenses_router
from investments import router as investments_router
from prof import router as profile_router
from pydantic import BaseModel, Field
from datetime import date as Date

from common import serialize_doc, db

from investLib import calculatePrediction, aggregateWealth, datelyChanges

app = FastAPI()

# allow cors all
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Stock(BaseModel):
  id: str | None = Field(None, alias="_id")
  name: str


class Graph(BaseModel):
  duration: int

app.include_router(incomes_router)
app.include_router(expenses_router)
app.include_router(investments_router)
app.include_router(profile_router)


@app.get("/")
async def root():
    values_array = await calculatePrediction("2022-01-01", "2022-12-31")
    return JSONResponse(content=values_array)

@app.get("/Wealth")
async def wealth():
    wealth = await aggregateWealth("2024-01-01", "2025-12-31")
    for key in wealth:
        for w in wealth[key]:
            w[0] = str(w[0])
    return JSONResponse(content=wealth)

@app.get("/Stocks")
async def stocks():
    collection = db.bsec
    items = []
    try:
        async for item in collection.find():
            items.append(serialize_doc(item))
        items = [Stock(**item).model_dump() for item in items]
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
