import pandas as pd
import time
# from helpers.get_urls import get_urls
# from helpers.forum_scrape import forum_scrape
# from helpers.make_json import make_json
from helpers.scraper import scraper_request
from esearch import store_record
from esearch import connect_elasticsearch, create_index
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
    # host = os.environ.get('HOST')
    url = os.environ.get('NODE_SERVER')
    # es = connect_elasticsearch(host if host != None else 'localhost')
    # create_index(es, 'data', settings)

    while True:
        print("\nSetting up your Proxy to browse the dark web!")
        requests.post(url + '/api/data/_status' if url !=
                      None else 'http://localhost:8080/api/data/_status', json={'message': 'Scraping!', 'active': True})
        data = scraper_request(URL, KEYWORDS)
        # path = os.environ.get('DATA_PATH')

        # # Saves the currently scraped data to new file signed by date
        # date = current_milli_time()
        # print(f"\nCreating new csv file: scrape-{date}")
        # df = pd.DataFrame(
        #     data, columns=['headers', 'content', 'author', 'date', ...])

        # path = {path if path != None else 'data'}
        # df.to_csv(path + '/seperated/scrape-{date}.csv')

        # # Creates main file with no duplicates
        # forum_scrape(path + '/seperated/*.csv', path + '/ForumScrape.csv',
        #              ["content", "headers", "date"])

        # # Save urls in seperate file
        # urls = get_urls(f"{path}/ForumScrape.csv")
        # df = pd.DataFrame(
        #     urls, columns=['url', ...])
        # df.to_csv(path + '/Links.csv')

        # print("Making a new JSON file")
        # csvFilePath = path + '/ForumScrape.csv'
        # jsonFilePath = path + '/ForumScrape.json'
        # make_json(csvFilePath, jsonFilePath)
        requests.post(url + '/api/data/_status' if url !=
                      None else 'http://localhost:8080/api/data/_status', json={'message': 'On 2 minutes cooldown!', 'active': False})
        res = requests.post(url + '/api/data' if url !=
                            None else 'http://localhost:8080/api/data', json=data)
        print(f'Data sent to server and, {res}')

        wait = 2
        print(f"Waiting {wait} minutes before next interval")
        time.sleep(wait * 60)


if __name__ == "__main__":
    main()
