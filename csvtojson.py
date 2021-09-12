import json
import csv

        
# Function to convert a CSV to JSON
# Takes the file paths as arguments
def make_json(csvFilePath, jsonFilePath):
     
    # create a dictionary
    data = {}
     
    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf)
        next(csvReader)
        # Convert each row into a dictionary
        # and add it to data
        for row in csvReader:
             
            # Assuming a column named '' to
            # be the primary key
            key = row['City']
            data[key] = row
 
    # Open a json writer, and use the json.dumps()
    # function to dump data
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))
         
# Driver Code
 
# Decide the two file paths according to your
# computer system
csvFilePath = r"./Resources/data/air_api_data.csv"
jsonFilePath = r"airsamplestest.json"
 
# Call the make_json function
make_json(csvFilePath, jsonFilePath)