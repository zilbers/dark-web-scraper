import pandas as pd
import time
# from helpers.get_urls import get_urls
# from helpers.forum_scrape import forum_scrape
# from helpers.make_json import make_json
from helpers.scraper import scraper_request
from esearch import store_record
from esearch import connect_elasticsearch, create_index
import logging
import requests
import os

# Url to scrape
URL = "http://nzxj65x32vh2fkhk.onion/"

# Keywords to search
KEYWORDS = ["all", "DDOS", "exploits", "credit cards", "attack", "bitcoin", "passwords", "information", "market", "explosives", "weapons", "hacked", "password", "wallet", "ransomware", "stolen", "admin", "blockchain", "cryptocurrency",
            "username", "account", "dollar", "biometric", "money", "forbidden", "leaked", "fullz", "Взломщик", "Залив", "Безнал", "Взлом", "dump data", "security", "payment"]

# KEYWORDS = ["all"]

# Settings for elasticsearch index
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

# Get current time in ms


def current_milli_time(): return str(round(time.time() * 1000))


def main():
    url = os.environ.get('NODE_SERVER')

    message = ""
    while True:
        config = requests.get(url + '/api/user/_config?id=5fc8d9d5f6779c0312d44dca' if url !=
                              None else 'http://localhost:8080/api/user/_config?id=5fc8d9d5f6779c0312d44dca').json()
        try:
            print("\nSetting up your Proxy to browse the dark web!")
            requests.post(url + '/api/data/_status' if url !=
                          None else 'http://localhost:8080/api/data/_status', json={'message': 'Scraping!', 'active': True})

            data = scraper_request(config)

            message = f'On {config["cooldown"]} minutes cooldown!'
            res = requests.post(url + '/api/data' if url !=
                                None else 'http://localhost:8080/api/data', json=data)
            print(f'Data sent to server and, {res}')
        except:
            message = 'An error occurd!'

        requests.post(url + '/api/data/_status' if url !=
                      None else 'http://localhost:8080/api/data/_status', json={'message': message, 'active': False})
        print(f"Waiting minutes before next interval")
        time.sleep(int(config["cooldown"]) * 60)


if __name__ == "__main__":
    main()
