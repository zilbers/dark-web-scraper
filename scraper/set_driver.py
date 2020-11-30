from selenium import webdriver
from selenium.webdriver.firefox.firefox_profile import FirefoxProfile
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary


# Sets a profile with Proxy
def set_driver(path):
    # Setting profile to use proxy
    profile = webdriver.FirefoxProfile()
    profile.set_preference('network.proxy.type', 1)
    profile.set_preference('network.proxy.socks', '127.0.0.1')
    profile.set_preference('network.proxy.socks_port', 9050)
    profile.set_preference('network.proxy.http', '127.0.0.1')
    profile.set_preference('network.proxy.http_port', 8118)

    driver = webdriver.Firefox(executable_path=path, firefox_profile=profile)
    return driver
