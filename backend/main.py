from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from incomes import router as incomes_router
from expenses import router as expenses_router
from investments import router as investments_router
from prof import router as profile_router
from pydantic import BaseModel
from datetime import date as Date

from investLib import calculatePrediction

app = FastAPI()

# allow cors all
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Graph(BaseModel):
  duration: int

app.include_router(incomes_router)
app.include_router(expenses_router)
app.include_router(investments_router)
app.include_router(profile_router)


@app.get("/")
async def root():
    values_array = await calculatePrediction("2021-01-01", "2021-12-31")
    return JSONResponse(content=values_array)