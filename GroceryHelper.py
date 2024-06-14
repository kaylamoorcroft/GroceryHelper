
import csv
from datetime import date

groceries = {}

def main():
    global groceries
    
    # read csv file and save into groceries dictionary in format "item: days left"
    with open('groceries.csv', mode = 'r') as file:
        csvFile = csv.reader(file)
        for lines in csvFile:
            entry = lines[0].split(";")
            groceries[entry[0].lower()] = date.fromisoformat(entry[1]) - date.today()

def displayGroceryList():
    global groceries
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
            print("EXPIRED {0} DAYS AGO".format(-daysLeft))
        else:
            print("{0} days left".format(daysLeft))  

# returns true if successfully added item to grocery list
# expiryDate has to be string of date in ISO format
def addItem():
    name = input("Enter name of item => ")
    while name in groceries.keys():
        print("~ Name already exists - choose a new name for the item")
        name = input("Enter name of item => ")
    
    invalidDateFormat = True
    while invalidDateFormat:
        try:
            expiryDate = input("Enter expiry date in format YYYY-MM-DD => ")
            groceries[name] = date.fromisoformat(expiryDate) - date.today()
            invalidDateFormat = False
        except: 
            print("~ Not a valid date format... ")

def removeItem():
    name = input("Enter name of item => ")
    while name not in groceries.keys():
        print("~ Item does not exist. Please select an item from the existing grocery list:")
        displayGroceryList()
        print()
        name = input("Enter name of item => ")
    groceries.pop(name)

def displayOptions():
    print()
    print("===============================")
    print("Choose an option from the menu:")
    print("1. Add an item")
    print("2. Remove an item")
    print("3. Display grocery list")
    print("4. Exit program")
    option = input("Type 1/2/3/4 => ")
    print("---------------------")
    if option == "1":
        addItem()
    elif option == "2":
        removeItem()
    elif option == "3":
        displayGroceryList()
    elif option == "4":
        exit()
    else:
        print("Not a valid option... please try again")
    
    # continue showing options until user decides to end program
    displayOptions()
    
if __name__ == "__main__":
    main()
    displayOptions()

   