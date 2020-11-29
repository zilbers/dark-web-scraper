from selenium import webdriver
from selenium.webdriver.firefox.firefox_profile import FirefoxProfile
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary
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


def main():
    profile = set_profile()

    # Setting the driver
    driver = webdriver.Firefox(executable_path=PATH, firefox_profile=profile)

    data = {"headers": [], "content": [], "author": []}

    for search in KEYWORDS:
        # Scrapping
        driver.get(f'{URL}search?q={search}')

        headers = driver.find_elements_by_tag_name('h4')
        content = driver.find_elements_by_class_name('text')
        author = driver.find_elements_by_class_name("col-sm-6")

        for index in range(len(headers)):
            data['headers'].append(headers[index].text)
            data['content'].append(content[index].text)
            data['author'].append(author[index].text)

    df = pd.DataFrame(data, columns=['headers', 'content', 'author', ...])
    df.to_csv(f'data/scrape-{current_milli_time()}.csv')

    driver.close()
    driver.quit()


if __name__ == "__main__":
    main()
