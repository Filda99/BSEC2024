from fastapi import FastAPI

from incomes import router as incomes_router
from expenses import router as expenses_router
# from .investments import router as savings_router
# from .profile import router as profile_router

app = FastAPI()

app.include_router(incomes_router)
app.include_router(expenses_router)
# app.include_router(savings_router)
# app.include_router(profile_router)


@app.get("/")
async def root():
    return {"message": "Hello from the bsec database"}



