import pandas as pd
import time
from helpers.get_urls import get_urls
from helpers.forum_scrape import forum_scrape
from helpers.set_driver import set_driver
# from helpers.make_json import make_json

# Geckodriver path
PATH = 'C:\\Program Files\\BrowserDrivers\\geckodriver-v0.28.0-win64\\geckodriver.exe'

# Url to scrape
URL = "http://nzxj65x32vh2fkhk.onion/"

# Keywords to search
KEYWORDS = ["all", "DDOS", "exploits", "attack", "money", "bitcoin", "passwords", "information", "market", "explosives", "weapons", "hacked", "password", "wallet", "ransomware", "hacked", "stolen", "admin", "blockchain", "cryptocurrency",
            "username", "account", "dollar", "biometric", "money", "forbidden", "leaked", "fullz", "Взломщик", "Залив", "Безнал", "Взлом", "dump data", "security", "payment"]


# Get current time in ms
def current_milli_time(): return str(round(time.time() * 1000))


def main():
    while True:
        print("\nSetting up your anonymous profile and driver to browse the dark web!")
        driver = set_driver(PATH)

        data = {"headers": [], "content": [], "author": [], "date": []}

        for search in KEYWORDS:
            # Scrapping
            print(f"\nSearching: {search}..")
            driver.get(
                f'{URL}{search if search == "all" else f"search?q={search}"}')

            headers = driver.find_elements_by_tag_name('h4')
            content = driver.find_elements_by_class_name('text')
            author = driver.find_elements_by_class_name("col-sm-6")

            if len(headers) == 0:
                print(f"\tNo data at: {search}!")
                continue

            print(f"\tAdding data to file..")
            for index in range(len(headers)):
                author_date = author[index * 2].text.split("at")

                data['headers'].append(headers[index].text.strip())
                data['content'].append(content[index].text.strip())
                data['author'].append(
                    author_date[0].strip().replace("Posted by ", ""))
                data['date'].append(
                    author_date[1].strip())

        print('\nClosing broswer')
        driver.close()
        driver.quit()

        # Saves the currently scraped data to new file signed by date
        date = current_milli_time()
        print(f"\nCreating new csv file: scrape-{date}")
        df = pd.DataFrame(
            data, columns=['headers', 'content', 'author', 'date', ...])
        df.to_csv(f'data/seperated/scrape-{date}.csv')

        # # Creates main file with no duplicates
        # forum_scrape("data/seperated/*.csv", 'data/ForumScrape.csv',
        #             ["content", "headers", "date"])

        # Save urls in seperate file
        urls = get_urls("data\ForumScrape.csv")
        df = pd.DataFrame(
            urls, columns=['url', ...])
        df.to_csv('data/Links.csv')
        time.sleep(10)


if __name__ == "__main__":
    main()
