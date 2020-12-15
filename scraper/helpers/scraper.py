import requests
from bs4 import BeautifulSoup
from helpers.set_driver import set_driver
import logging
from datetime import datetime
import os


# Scrapes the data and returns a JSON with the content, using selenium
def scraper_selenium(url, keywords=[]):
    PATH = 'C:\\Program Files\\BrowserDrivers\\geckodriver-v0.28.0-win64\\geckodriver.exe'

    data = {"headers": [], "content": [], "author": [], "date": []}
    driver = set_driver(PATH)

    for search in keywords:
        # Scrapping
        print(f"\nSearching: {search}..")
        driver.get(
            f'{url}{search if search == "all" else f"search?q={search}"}')

        headers = driver.find_elements_by_tag_name('h4')
        content = driver.find_elements_by_class_name('text')
        author = driver.find_elements_by_class_name("col-sm-6")

        if len(headers) == 0:
            print(f"\tNo data at: {search}!")
            continue

        print("\tAdding data to file..")
        for index in range(len(headers)):
            author_date = author[index * 2].text.split("at")

            data['headers'].append(headers[index].text.strip())
            data['content'].append(content[index].text.strip())
            data['author'].append(
                author_date[0].strip().replace("Posted by ", ""))
            data['date'].append(
                author_date[1].strip())
    return data


# Scrapes the data and returns a JSON with the content, using requests
def scraper_request(config):
    url = config["url"]
    keywords = config["keywords"]

    print(f"Scraping {url}")

    host = os.environ.get('PROXY')

    proxyDict = {
        "http": f"socks5h://{host if host != None else '127.0.0.1'}:9050",
        "https": f"socks5h://{host if host != None else '127.0.0.1'}:9050",
    }

    data = []

    for search in keywords:
        # Scrapping
        print(f"\nSearching: {search}..")
        r = requests.get(
            f'{url}{search if search == "all" else f"search?q={search}"}', proxies=proxyDict)
        soup = BeautifulSoup(r.content, 'html.parser')
        headers = soup.select('h4')
        content = soup.select('.text')
        author = soup.select('.col-sm-6')

        if len(headers) == 0:
            print(f"\tNo data at: {search}!")
            continue
        print("\tAdding data to object..")

        for index in range(len(content)):
            author_date = author[index * 2].text.split("at")
            date = author_date[-1].replace(
                "UTC", "").replace(",", "").strip()

            data_dict = {
                "header": headers[index].text.strip(), "content": content[index].text.strip(
                ), "author": author_date[0].strip().replace("Posted by ", ""), "date": str(datetime.strptime(date, '%d %b %Y %H:%M:%S'))}
            data.append(data_dict)
    return data
