import csv
import json

# Function to convert a CSV to JSON
def make_json(csvFilePath, jsonFilePath):
    out = []
    with open(csvFilePath, encoding='utf-8') as csvf:
        fieldnames = ("null","id","header","content","author","date","Ellipsis")
        reader = csv.DictReader(csvf, fieldnames)
        out = json.dumps([row for row in reader])

    with open(jsonFilePath, 'w') as jsonf:
        jsonf.write(out)


csvFilePath = r'data/ForumScrape.csv'
jsonFilePath = r'data/ForumScrape.json'

make_json(csvFilePath, jsonFilePath)
