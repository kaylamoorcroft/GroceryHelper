
import csv
from datetime import date

def main():
    groceries = {}
    
    # read csv file and save into groceries dictionary in format "item: days left"
    with open('groceries.csv', mode = 'r') as file:
        csvFile = csv.reader(file)
        for lines in csvFile:
            entry = lines[0].split(";")
            groceries[entry[0]] = date.fromisoformat(entry[1]) - date.today()
    
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
    
if __name__ == "__main__":
    main()
   