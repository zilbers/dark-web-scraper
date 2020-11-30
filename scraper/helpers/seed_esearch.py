from esearch import store_record
from esearch import connect_elasticsearch
import json


def seed_esearch(es):
    print("Adding JSON file data to Elasticsearch")
    with open('data/ForumScrape.json', encoding="utf8",  errors='ignore') as f:
        data = json.load(f)
        for record in data:
            store_record(es, "data", "data", record)


if __name__ == '__main__':
    es = connect_elasticsearch()
    seed_esearch(es)
