import re
import pandas as pd


def get_urls(path):
    print('\nGetting all links from scraped data')
    data = {"url": []}
    with open(path, encoding="utf8") as file:
        for line in file:
            current_urls = re.findall(
                'https?:\/\/(?:[-\w.]|(?:%[\da-fA-F]{2}))+\/[^,]*', line)
            formatted_urls = []
            for url in current_urls:
                formatted_urls.append(url.replace("\n", ""))
            data["url"] += formatted_urls
    return data