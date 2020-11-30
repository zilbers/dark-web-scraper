from selenium import webdriver
from selenium.webdriver.firefox.firefox_profile import FirefoxProfile
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary


# Sets a profile with Proxy
def set_driver():
    # Setting profile to use proxy
    profile = webdriver.FirefoxProfile()
    profile.set_preference('network.proxy.type', 1)
    profile.set_preference('network.proxy.socks', 'tor')
    profile.set_preference('network.proxy.socks_port', 9050)
    profile.set_preference('network.proxy.http', 'tor')
    profile.set_preference('network.proxy.http_port', 8118)

    driver = webdriver.Firefox(firefox_profile=profile)
    return driver
