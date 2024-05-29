
import csv
from datetime import date

daysLeft = {}

def main():
    # read csv file and save into daysLeft dictionary in format "item: expiryDate"
    with open('groceries.csv', mode = 'r') as file:
        csvFile = csv.reader(file)
        for lines in csvFile:
            entry = lines[0].split(";")
            daysLeft[entry[0]] = date.fromisoformat(entry[1]) - date.today()
    
    # display item and expiry date
    for item in daysLeft.keys():
        print(item + ": " + str(daysLeft[item].days) + " days left")
    
if __name__ == "__main__":
    main()
   