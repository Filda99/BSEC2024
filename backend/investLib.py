from fastapi import HTTPException
from common import serialize_doc, db
from bson import ObjectId
from datetime import datetime, timedelta

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
    scenarios = [
        "Negativní scénář (růstová míra %)",
        "Neutrální scénář (růstová míra %)",
        "Pozitivní scénář (růstová míra %)",
    ]
    scenarioArrays = [[], [], []]
    for index, scenario in enumerate(scenarios):
        for i in range(duration):
            # Get base info from bsec database
            stockValue = 0
            for stock in stocks:
                value = stock["Value"]
                baseInfo = await get_BaseInfo(ObjectId(stock["InvestmentId"]))
                if baseInfo is None:
                    raise HTTPException(status_code=404, detail="Base info not found")
                value += 1 / 365 * i * (baseInfo[scenario]) / 100 * stock["Value"]
                stockValue += value
            scenarioArrays[index].append(stockValue)

    # Sum the scenarioArrays and return the result
    # summed_array = [sum(elements) for elements in zip(*scenarioArrays)]

    return scenarioArrays

def makedate(date):
    try:
        return datetime.strptime(date, "%Y-%m-%dT%H:%M:%S.%fZ")
    except:
        return datetime.fromisoformat(str(date))


# Get incomes, mark the dates when something changes and return the array of (dates, sum of incomes)
async def getEventDatesValues(startDate, endDate, collection):
    # Calculate days between the start and end date from string to datetime
    start_date = makedate(startDate)
    end_date = makedate(endDate)

    total_event_dates = []
    for event in collection:
        event_start = makedate(event["Start"])
        event_end = makedate(event["End"]) if event["End"] else end_date
        frequency = event["Frequency"]
        value = event["Value"]

        # Check for one-time event
        if event["OneTime"] and start_date <= event_start <= end_date:
            total_event_dates.append([event_start, value])
        # Handle recurring collection
        elif not event["OneTime"] and start_date <= event_start <= end_date:
            current_date = event_start
            while current_date <= event_end and current_date <= end_date:
                if current_date >= start_date:
                    total_event_dates.append([current_date, value])
                # Advance to the next event date based on the frequency
                if frequency == "Yearly":
                    current_date = current_date.replace(year=current_date.year + 1)
                elif frequency == "Monthly":
                    if current_date.month == 12:
                        current_date = current_date.replace(year=current_date.year + 1, month=1)
                    else:
                        current_date = current_date.replace(month=current_date.month + 1)
                elif frequency == "Weekly":
                    current_date += timedelta(days=7)
                elif frequency == "Daily":
                    current_date += timedelta(days=1)
                # Add other frequency types as needed
                else:
                    break  # Unsupported frequency type, exit the loop
    # Sort the total_event_dates array by date and merge the same dates
    total_event_dates.sort(key=lambda x: x[0])
    for i, (date, value) in enumerate(total_event_dates):
        if i > 0 and date == total_event_dates[i - 1][0]:
            total_event_dates[i] = [date, value + total_event_dates[i - 1][1]]
            total_event_dates[i - 1] = None
    total_event_dates = [x for x in total_event_dates if x is not None]
    return total_event_dates


async def getIncomeDates(startDate, endDate):
    incomes = await get_incomes()
    return await getEventDatesValues(startDate, endDate, incomes)


async def getExpenseDates(startDate, endDate):
    expenses = await get_expenses()
    expenses = await getEventDatesValues(startDate, endDate, expenses)
    # Negate the values of expenses
    expenses = map(lambda x: [x[0], -x[1]], expenses)
    return list(expenses)


async def getInvestmentDates(startDate, endDate):
    investments = await get_investments()
    return await getEventDatesValues(startDate, endDate, investments)


async def datelyChanges(startDate, endDate):
    incomes = await getIncomeDates(startDate, endDate)
    expenses = await getExpenseDates(startDate, endDate)
    investments = await getInvestmentDates(startDate, endDate)
    # Merge the arrays and sort them by date
    total_event_dates = incomes + expenses + investments
    total_event_dates.sort(key=lambda x: x[0])
    for i, (date, value) in enumerate(total_event_dates):
        if i > 0 and date == total_event_dates[i - 1][0]:
            total_event_dates[i] = [date, value + total_event_dates[i - 1][1]]
            total_event_dates[i - 1] = None
    total_event_dates = [x for x in total_event_dates if x is not None]
    return total_event_dates


async def aggregateWealth(startDate, endDate):
    event_dates = await datelyChanges(startDate, endDate)
    # Calculate the wealth based on the event dates
    wealth = []
    current_wealth = 0
    for date, value in event_dates:
        current_wealth += value
        wealth.append([date, current_wealth])
    return wealth
