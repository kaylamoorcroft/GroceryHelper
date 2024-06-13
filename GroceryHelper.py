
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
def addItem(name: str, expiryDate: str):
    if name in groceries.keys():
        print("~ Name already exists - choose a new name for the item")
        return False
    try:
        groceries[name] = date.fromisoformat(expiryDate)
    except: 
        print("~ Not a valid date format... please enter date in the format YYYY-MM-DD")
        return False
    return True

def displayOptions(option = "0"):
    if not option:
        print()
        print("===============================")
        print("Choose an option from the menu:")
        print("1. Add an item")
        print("2. Exit program")
        option = input("Type 1 / 2 => ")
    if option == "1":
        print("---------------------")
        name = input("Enter name of item => ")
        date = input("Enter expiry date in format YYYY-MM-DD => ")
        if not addItem(name, date):
            displayOptions(option)
    elif option == "2":
        exit()
    else:
        print("Not a valid option... please try again")
    
    # continue showing options until user decides to end program
    displayOptions()
    
if __name__ == "__main__":
    main()
    displayOptions()

   