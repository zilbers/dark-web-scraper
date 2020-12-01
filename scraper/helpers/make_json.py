import csv
import json

# Function to convert a CSV to JSON


def make_json(csvFilePath, jsonFilePath):
    out = []
    with open(csvFilePath, encoding='utf-8') as csvf:
        fieldnames = ("item_id", "id", "header", "content",
                      "author", "date", "delete")
        reader = csv.DictReader(csvf, fieldnames)
        data = [row for row in reader]
        data.pop(0)
        for item in data:
            del item["item_id"]
            del item["delete"]
            del item["id"]
            # item["_id"] = hash(item["header"] + item["date"])

        out = json.dumps(data, ensure_ascii=False)

    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        jsonf.write(out)


# csvFilePath = r'../data/ForumScrape.csv'
# jsonFilePath = r'../data/ForumScrape.json'

# print("Making a new JSON file")
# make_json(csvFilePath, jsonFilePath)
