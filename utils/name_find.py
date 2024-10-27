'''
This function navigates the cricinfo page and returns the name of player searched in a format that
can be used by us to query our database and get back the results
'''

import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse, parse_qs


def get_player_name(player_name):
    try:
        source = requests.get(f"https://www.google.com/search?q={player_name}%20cricinfo").text
        page = BeautifulSoup(source, "lxml")
        page = page.find("div",class_="kCrYT")
        link = page.find("a", href=re.compile(r"[/]([a-z]|[A-Z])\w+")).attrs["href"]    
        parsed_url = urlparse(link)    
        actual_url = parse_qs(parsed_url.query)['q'][0]
        c =  requests.get(actual_url).text
        soup = BeautifulSoup(c, 'lxml')

        name_element = soup.find('span', class_="ds-text-title-s ds-font-bold ds-text-typo")

        full_name = name_element.find('p').text.strip()
        initials = ''.join(name[0] for name in full_name.split(" ")[:-1])
        last_name = full_name.split(" ")[-1]
        parsed_name = f"{initials} {last_name}"
        return parsed_name
    except Exception as e:
        return("Name not found")
    