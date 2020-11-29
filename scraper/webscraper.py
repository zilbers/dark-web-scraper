from selenium import webdriver
from selenium.webdriver.firefox.firefox_profile import FirefoxProfile
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary
import glob
import pandas as pd
import time

# Geckdriver path
PATH = 'C:\\Program Files\\BrowserDrivers\\geckodriver-v0.28.0-win64\\geckodriver.exe'

# Url to scrape
URL = "http://nzxj65x32vh2fkhk.onion/"

# Keywords to search
KEYWORDS = ["money", "bitcoin", "passwords", "hacked", "password", "wallet",
            "hacked", "stolen", "username", "account", "dollar", "money", "forbidden"]


def current_milli_time(): return str(round(time.time() * 1000))


def set_profile():
    # Setting profile to use proxy
    profile = webdriver.FirefoxProfile()
    profile.set_preference('network.proxy.type', 1)
    profile.set_preference('network.proxy.socks', '127.0.0.1')
    profile.set_preference('network.proxy.socks_port', 9050)
    profile.set_preference('network.proxy.http', '127.0.0.1')
    profile.set_preference('network.proxy.http_port', 8118)
    return profile


def forum_scrape():
    all_csv = glob.glob("data\\seperated\\*.csv")
    frames = []

    for path in all_csv:
        frames.append(pd.read_csv(path))

    result = pd.concat(frames, ignore_index = True)
    result = result.drop_duplicates(subset="content")
    result.to_csv('data/ForumScrape.csv')


def main():
    print("\nSetting up your anonymous profile to browse the dark web!")
    profile = set_profile()

    # Setting the driver
    print("Setting up webdriver with Proxy..")
    driver = webdriver.Firefox(executable_path=PATH, firefox_profile=profile)

    data = {"headers": [], "content": [], "author": [], "date": []}

    for search in KEYWORDS:
        # Scrapping
        print(f"\nSearching: {search}..")
        driver.get(f'{URL}search?q={search}')

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
            data['author'].append(author_date[0].strip())
            data['date'].append(author_date[1].strip())

    print('Closing broswer')
    driver.close()
    driver.quit()

    date = current_milli_time()
    print(f"Creating new csv file: scrape-{date}")
    df = pd.DataFrame(
        data, columns=['headers', 'content', 'author', 'date', ...])
    df.to_csv(f'data/seperated/scrape-{date}.csv')

    print("Combining all CSV files to one...")
    forum_scrape()



if __name__ == "__main__":
    main()
