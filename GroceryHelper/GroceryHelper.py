
import csv, datetime

expiryDates = {}

def main():
    # read csv file and save into expiryDates dictionary in format "item: expiryDate"
    with open('groceries.csv', mode = 'r') as file:
        csvFile = csv.reader(file)
        for lines in csvFile:
            entry = lines[0].split(";")
            expiryDates[entry[0]] = stringToDate(entry[1])
    
    # display item and expiry date
    for item in expiryDates.keys():
        print(item + ": " + expiryDates[item].strftime("%x"))
    
# convert string in format YYYY/MM/DD to a datetime object
def stringToDate(s):
    date = [int(x) for x in s.split("/")]
    return datetime.datetime(date[0], date[1], date[2])
    
if __name__ == "__main__":
    main()
   