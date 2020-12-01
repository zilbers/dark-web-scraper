import pandas as pd
import time
from helpers.get_urls import get_urls
from helpers.forum_scrape import forum_scrape
from helpers.scraper import scraper_request
from helpers.make_json import make_json

# Url to scrape
URL = "http://nzxj65x32vh2fkhk.onion/"

# Keywords to search
KEYWORDS = ["all", "DDOS", "exploits", "attack", "money", "bitcoin", "passwords", "information", "market", "explosives", "weapons", "hacked", "password", "wallet", "ransomware", "hacked", "stolen", "admin", "blockchain", "cryptocurrency",
            "username", "account", "dollar", "biometric", "money", "forbidden", "leaked", "fullz", "Взломщик", "Залив", "Безнал", "Взлом", "dump data", "security", "payment"]


# Get current time in ms
def current_milli_time(): return str(round(time.time() * 1000))


def main():
    while True:
        print("\nSetting up your Proxy to browse the dark web!")
        data = scraper_request(URL, KEYWORDS)
        
        # Saves the currently scraped data to new file signed by date
        date = current_milli_time()
        print(f"\nCreating new csv file: scrape-{date}")
        df = pd.DataFrame(
            data, columns=['headers', 'content', 'author', 'date', ...])
        df.to_csv(f'data/seperated/scrape-{date}.csv')

        # Creates main file with no duplicates
        forum_scrape("data/seperated/*.csv", 'data/ForumScrape.csv',
                     ["content", "headers", "date"])

        # Save urls in seperate file
        urls = get_urls("data\ForumScrape.csv")
        df = pd.DataFrame(
            urls, columns=['url', ...])
        df.to_csv('data/Links.csv')

        print("Making a new JSON file")
        csvFilePath = r'data/ForumScrape.csv'
        jsonFilePath = r'data/ForumScrape.json'
        make_json(csvFilePath, jsonFilePath)

        wait = 10
        print(f"Waiting {wait} minutes before next interval")
        time.sleep(wait * 60)


if __name__ == "__main__":
    main()
