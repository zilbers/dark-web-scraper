import json
import os
import sys
import logging

from pprint import pprint
from time import sleep

from elasticsearch import Elasticsearch, helpers

# index settings
settings = {
    "settings": {
        "number_of_shards": 1,
        "number_of_replicas": 0
    },
    "mappings": {
        "data": {
            "dynamic": "strict",
            "properties": {

                "header": {
                    "type": "text"
                },
                "content": {
                    "type": "text"
                },
                "author": {
                    "type": "text",
                },
                "date": {
                    "type": "text",
                },
            }
        }
    }
}


def search(es_object, index_name, search):
    res = es_object.search(index=index_name, body=search)
    pprint(res)


def create_index(es_object, index_name, settings):
    created = False

    try:
        if not es_object.indices.exists(index_name):
            # Ignore 400 means to ignore "Index Already Exist" error.
            es_object.indices.create(
                index=index_name, ignore=400, body=settings)
            print('Created Index')
        created = True
    except Exception as ex:
        print(str(ex))
    finally:
        return created


def store_record(es_object, index_name, record):
    is_stored = True
    try:
        outcome = es_object.index(
            index=index_name, doc_type='data', body=record)
        print(outcome)
    except Exception as ex:
        print('Error in indexing data')
        print(str(ex))
        is_stored = False
    finally:
        return is_stored


def load_json(directory):
    # " Use a generator, no need to load all in memory"
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            with open(f'{directory}/{filename}', encoding="utf8",  errors='ignore') as open_file:
                yield json.load(open_file)


def connect_elasticsearch():
    _es = None
    _es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
    if _es.ping():
        print('Yay Connected!')
    else:
        print('Awww it could not connect!')
    return _es


if __name__ == '__main__':
    es = connect_elasticsearch()
    create_index(es, "data", settings)

    data = []

    jsonFilePath = r'data/ForumScrape.json'
    print("Adding JSON file data to Elasticsearch")
    helpers.bulk(es, load_json("data"))

    # store_record(es, "data", data)
