
import csv
from datetime import date

groceries = {}

# load groceries dictionary from csv file
def readFile():
    global groceries
    
    # read csv file and save into groceries dictionary in format "item: days left"
    with open('groceries.csv', mode = 'r') as file:
        csvFile = csv.reader(file)
        for lines in csvFile:
            entry = lines[0].split(";")
            groceries[entry[0].lower()] = date.fromisoformat(entry[1]) - date.today()

# save groceries dictionary to csv file in original format
def saveFile():
    global groceries

    # write to csv file from groceries dictionary in format "item; expiry date"
    with open('groceries.csv', mode = 'w') as file:
        csvFile = csv.writer(file, delimiter=";")
        for item in groceries.keys():
            groceries[item] += date.today() # change back to date format again
            csvFile.writerow([item,groceries[item]])

    # confirmation message
    print("...saved grocery list to groceries.csv")

# get input for an item name that is in the grocery list
def getExistingItemNameInput() -> str:
    name = input("Enter name of item => ")
    while name not in groceries.keys():
        print("~ Item does not exist. Please select an item from the existing grocery list:")
        displayGroceryList()
        print()
        name = input("Enter name of item => ")

    return name

# turn string input of date in iso format into date
def getValidDateInput() -> date:
    invalidDateFormat = True
    while invalidDateFormat:
        try:
            expiryDate = input("Enter expiry date in format YYYY-MM-DD => ")
            expiryDate = date.fromisoformat(expiryDate)
            invalidDateFormat = False
        except: 
            print("~ Not a valid date format... ")
    return expiryDate

def displayGroceryList():
    global groceries
    if len(groceries) == 0:
        print("~No groceries in the list...")
        return
    # sort by soonest expiry so priorities are at top of list
    # sorted method returns list, so need to convert back to dict
    groceries = dict(sorted(groceries.items(), key=lambda item: item[1]))
    
    for item in groceries.keys(): 
        # display item and days left - special message if expiring today or already expired
        print(item + ":", end = " ")
        daysLeft = groceries[item].days
        if daysLeft == 0:
            print("EXPIRING TODAY")
        elif daysLeft < 0:
            print(f"EXPIRED {-daysLeft} DAYS AGO")
        else:
            print(f"{daysLeft} days left")  

# add item to grocery list
# expiryDate has to be string of date in ISO format
def addItem():
    name = input("Enter name of item => ")
    while name in groceries.keys():
        print("~ Name already exists - choose a new name for the item")
        name = input("Enter name of item => ")
    
    groceries[name] = getValidDateInput() - date.today()

    print(f"Successfully added {name} to grocery list")

# change expiry date of existing item in grocery list
def editItem():
    if len(groceries) == 0:
        print("~No groceries in the list...")
        return
    name = getExistingItemNameInput()
    groceries[name] = getValidDateInput() - date.today()
    print(f"Successfully updated expiry date of {name}")

# remove existing item in grocery list
def removeItem():
    if len(groceries) == 0:
        print("~No groceries in the list...")
        return
    name = getExistingItemNameInput()
    groceries.pop(name)
    print(f"Successfully removed {name} from grocery list")

# menu with options of what to do in the program
def displayOptions():
    print()
    print("===============================")
    print("Choose an option from the menu:")
    print("1. Add an item")
    print("2. Update an item")
    print("3. Remove an item")
    print("4. Display grocery list")
    print("5. Exit program")
    option = input("Type 1/2/3/4/5 => ")
    print("---------------------")
    if option == "1":
        addItem()
    elif option == "2":
        editItem()
    elif option == "3":
        removeItem()
    elif option == "4":
        displayGroceryList()
    elif option == "5":
        saveFile() # saving grocery modifications to csv file before ending program
        exit()
    else:
        print("Not a valid option... please try again")
    
    # continue showing options until user decides to end program
    displayOptions()
    
if __name__ == "__main__":
    readFile()
    displayOptions()

   