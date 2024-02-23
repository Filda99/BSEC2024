from fastapi import HTTPException
from common import serialize_doc, db
from bson import ObjectId
from datetime import datetime

# Assuming you have a 'db' instance of MongoClient already defined

# Function will get all stocks from the database Invesments collection
async def get_investments():
    collection = db.Investments
    items = []
    try:
        async for item in collection.find():
            items.append(serialize_doc(item))
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

async def get_BaseInfo(stockId):
    collection = db.bsec
    try:
        return await collection.find_one({"_id": stockId})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Function will get all expenses from the database Expenses collection
async def get_expenses():
    collection = db.Expenses
    items = []
    try:
        async for item in collection.find():
            items.append(serialize_doc(item))
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# Function will get all incomes from the database Incomes collection
async def get_incomes():
    collection = db.Incomes
    items = []
    try:
        async for item in collection.find():
            items.append(serialize_doc(item))
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Function will calculate the prediction of the stock for the possible scenarios
async def calculatePrediction(startDate, endDate):
    # Calculate days between the start and end date from string to datetime
    
    start_date_obj = datetime.fromisoformat(startDate)
    end_date_obj = datetime.fromisoformat(endDate)

    duration = (end_date_obj - start_date_obj).days
    
    stocks = await get_investments()
    scenarios = ['Negativní scénář (růstová míra %)', 'Neutrální scénář (růstová míra %)', 'Pozitivní scénář (růstová míra %)']
    scenarioArrays = [[], [], []]
    for index, scenario in enumerate(scenarios):
        for i in range(duration):
            # Get base info from bsec database
            stockValue = 0
            for stock in stocks:
                value = stock['Value']
                baseInfo = await get_BaseInfo(ObjectId(stock['InvestmentId']))
                value += 1/365 * i * (baseInfo[scenario]) / 100 * stock['Value']
                stockValue += value
            scenarioArrays[index].append(stockValue)
    
    # Sum the scenarioArrays and return the result
    # summed_array = [sum(elements) for elements in zip(*scenarioArrays)]
    
    return scenarioArrays