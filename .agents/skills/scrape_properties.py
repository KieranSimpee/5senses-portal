#!/usr/bin/env python3
"""
Full HK Island property scraper — 28Hse.com
Scrapes ALL pages of results for HK Island, carpark, below HK$49,000
Saves results to PropertyListing entity via Base44 API
"""

import requests
import json
import re
import time
import os
from datetime import datetime
from bs4 import BeautifulSoup

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.28hse.com/',
}

BASE44_API = "https://api.base44.com/api/apps/69ddc914cfcf229762ac123d/entities/PropertyListing"
API_KEY = os.environ.get("BASE44_API_KEY", "")

TODAY = datetime.now().strftime("%Y-%m-%d")

DISTRICT_MAP = {
    "north point": "North Point",
    "quarry bay": "Quarry Bay",
    "wan chai": "Wan Chai",
    "causeway bay": "Causeway Bay",
    "tin hau": "Tin Hau",
    "sheung wan": "Sheung Wan",
    "mid-levels": "Mid-Levels",
    "happy valley": "Happy Valley",
    "sai wan ho": "Sai Wan Ho",
    "shau kei wan": "Shau Kei Wan",
    "tai koo": "Tai Koo",
    "kennedy town": "Kennedy Town",
    "sai ying pun": "Sai Ying Pun",
    "western": "Western",
    "central": "Central",
    "admiralty": "Admiralty",
    "wanchai": "Wan Chai",
    "fortress hill": "Fortress Hill",
    "braemar hill": "Braemar Hill",
    "pok fu lam": "Pok Fu Lam",
    "aberdeen": "Aberdeen",
    "ap lei chau": "Ap Lei Chau",
    "south horizons": "Ap Lei Chau",
}

def detect_district(text):
    text_lower = text.lower()
    for key, val in DISTRICT_MAP.items():
        if key in text_lower:
            return val
    return "HK Island"

def scrape_28hse_page(page=1):
    """Scrape one page of 28Hse HK Island carpark results"""
    url = f"https://www.28hse.com/en/rent/residential/hk-island/has-car-park/price-max-49000?page={page}"
    listings = []
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            print(f"  [WARN] Page {page} returned status {resp.status_code}")
            return listings, False
        
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # Find all listing cards
        cards = soup.find_all('div', class_=re.compile(r'listing|property|item', re.I))
        
        # Try JSON data embedded in page
        scripts = soup.find_all('script', type='application/json')
        for script in scripts:
            try:
                data = json.loads(script.string)
                if isinstance(data, dict) and 'listings' in data:
                    for item in data['listings']:
                        listings.append(parse_json_listing(item))
            except:
                pass
        
        # Try __NEXT_DATA__ or window.__data__
        for script in soup.find_all('script'):
            if script.string and ('__NEXT_DATA__' in str(script.string) or 'window.__' in str(script.string)):
                try:
                    match = re.search(r'__NEXT_DATA__\s*=\s*(\{.*?\});?\s*</script>', 
                                      str(script.string), re.DOTALL)
                    if match:
                        data = json.loads(match.group(1))
                        # Navigate the Next.js data structure
                        props = data.get('props', {}).get('pageProps', {})
                        items = props.get('listings', props.get('data', props.get('results', [])))
                        if isinstance(items, list):
                            for item in items:
                                parsed = parse_json_listing(item)
                                if parsed:
                                    listings.append(parsed)
                except Exception as e:
                    print(f"  [WARN] JSON parse error: {e}")

        # HTML card parsing as fallback
        if not listings:
            listings = parse_html_cards(soup)
        
        # Check if there's a next page
        has_next = bool(soup.find('a', string=re.compile(r'next|→|>', re.I)) or 
                       soup.find('li', class_=re.compile(r'next', re.I)))
        
        print(f"  Page {page}: found {len(listings)} listings")
        return listings, has_next
        
    except Exception as e:
        print(f"  [ERROR] Page {page}: {e}")
        return [], False

def parse_json_listing(item):
    """Parse a listing from JSON data"""
    if not item or not isinstance(item, dict):
        return None
    
    price = item.get('price', item.get('rent', item.get('asking_price', 0)))
    if isinstance(price, str):
        price = int(re.sub(r'[^\d]', '', price) or 0)
    
    name = item.get('name', item.get('building_name', item.get('title', '')))
    address = item.get('address', item.get('location', ''))
    district = item.get('district', detect_district(str(address) + str(name)))
    
    image = item.get('image', item.get('photo', item.get('thumbnail', '')))
    if isinstance(image, list):
        image = image[0] if image else ''
    if isinstance(image, dict):
        image = image.get('url', image.get('src', ''))
    
    listing_id = str(item.get('id', item.get('listing_id', item.get('property_id', ''))))
    url = item.get('url', item.get('link', f"https://www.28hse.com/en/rent/apartment/property-{listing_id}"))
    
    beds = str(item.get('bedrooms', item.get('beds', item.get('bedroom', 'N/A'))))
    baths = str(item.get('bathrooms', item.get('baths', item.get('bathroom', 'N/A'))))
    size = str(item.get('gross_area', item.get('size', item.get('area', 'N/A'))))
    floor = item.get('floor', item.get('floor_level', ''))
    agent = item.get('agent', item.get('agency', item.get('contact', '')))
    if isinstance(agent, dict):
        agent = agent.get('name', '')
    
    return {
        'listing_id': listing_id,
        'name': str(name)[:100],
        'price_hkd': int(price) if price else 0,
        'district': str(district)[:50],
        'address': str(address)[:200],
        'beds': str(beds)[:20],
        'baths': str(baths)[:20],
        'size_sf': str(size)[:20],
        'floor': str(floor)[:50],
        'image_url': str(image)[:500],
        'source_url': str(url)[:500],
        'source': '28Hse.com',
        'agent': str(agent)[:100],
        'carpark': True,
        'fetched_date': TODAY,
        'tags': ['hk-island', 'carpark', 'rental']
    }

def parse_html_cards(soup):
    """Parse listings from HTML card elements"""
    listings = []
    
    # 28Hse specific selectors
    selectors = [
        ('div', {'class': re.compile(r'listing-item|property-card|search-item', re.I)}),
        ('li', {'class': re.compile(r'listing|property', re.I)}),
        ('article', {}),
    ]
    
    cards = []
    for tag, attrs in selectors:
        found = soup.find_all(tag, attrs)
        if found:
            cards = found
            break
    
    for card in cards:
        try:
            # Price
            price_el = card.find(class_=re.compile(r'price|rent|cost', re.I))
            price_text = price_el.get_text(strip=True) if price_el else ''
            price = int(re.sub(r'[^\d]', '', price_text) or 0)
            if price < 1000 or price > 200000:
                continue
            
            # Name / building
            name_el = card.find(['h2','h3','h4'], class_=re.compile(r'name|title|building', re.I))
            if not name_el:
                name_el = card.find(class_=re.compile(r'building|name|title', re.I))
            name = name_el.get_text(strip=True) if name_el else 'HK Island Property'
            
            # Address
            addr_el = card.find(class_=re.compile(r'address|location|area', re.I))
            address = addr_el.get_text(strip=True) if addr_el else ''
            district = detect_district(address + ' ' + name)
            
            # Image
            img_el = card.find('img')
            image = ''
            if img_el:
                image = img_el.get('src', img_el.get('data-src', img_el.get('data-lazy', '')))
                if image and image.startswith('//'):
                    image = 'https:' + image
            
            # Link
            link_el = card.find('a', href=True)
            url = ''
            if link_el:
                href = link_el['href']
                url = href if href.startswith('http') else f"https://www.28hse.com{href}"
            
            listing_id = re.search(r'property-(\d+)', url)
            listing_id = listing_id.group(1) if listing_id else ''
            
            # Beds/baths/size
            text = card.get_text(' ', strip=True)
            beds_m = re.search(r'(\d+)\s*(?:bed|bedroom|BR)', text, re.I)
            baths_m = re.search(r'(\d+)\s*(?:bath|bathroom)', text, re.I)
            size_m = re.search(r'([\d,]+)\s*(?:sq\.?ft|ft²|sqft)', text, re.I)
            floor_m = re.search(r'(low|mid|high|ground)\s*floor', text, re.I)
            
            listings.append({
                'listing_id': listing_id,
                'name': name[:100],
                'price_hkd': price,
                'district': district,
                'address': address[:200],
                'beds': beds_m.group(1) if beds_m else 'N/A',
                'baths': baths_m.group(1) if baths_m else 'N/A',
                'size_sf': size_m.group(1).replace(',','') if size_m else 'N/A',
                'floor': (floor_m.group(1).title() + ' Floor') if floor_m else '',
                'image_url': image[:500],
                'source_url': url[:500],
                'source': '28Hse.com',
                'agent': '',
                'carpark': True,
                'fetched_date': TODAY,
                'tags': ['hk-island', 'carpark', 'rental']
            })
        except Exception as e:
            continue
    
    return listings

def save_to_base44(listings):
    """Save listings to Base44 PropertyListing entity"""
    if not API_KEY:
        print("  [WARN] No API key — saving to JSON file instead")
        with open('/tmp/scraped_listings.json', 'w') as f:
            json.dump(listings, f, indent=2)
        print(f"  Saved {len(listings)} listings to /tmp/scraped_listings.json")
        return
    
    saved = 0
    for listing in listings:
        try:
            resp = requests.post(BASE44_API, 
                headers={'Authorization': f'Bearer {API_KEY}', 'Content-Type': 'application/json'},
                json=listing, timeout=10)
            if resp.status_code in (200, 201):
                saved += 1
        except Exception as e:
            print(f"  [ERROR] Save failed: {e}")
    
    print(f"  Saved {saved}/{len(listings)} listings to Base44")

def run_scraper(max_pages=5):
    print(f"🔍 Scraping 28Hse — HK Island, Carpark, Below HK$49,000")
    print(f"📅 Date: {TODAY}")
    print("-" * 50)
    
    all_listings = []
    seen_ids = set()
    
    for page in range(1, max_pages + 1):
        print(f"  Fetching page {page}...")
        listings, has_next = scrape_28hse_page(page)
        
        for l in listings:
            lid = l.get('listing_id') or l.get('name', '') + str(l.get('price_hkd', ''))
            if lid not in seen_ids and l.get('price_hkd', 0) > 0:
                seen_ids.add(lid)
                all_listings.append(l)
        
        time.sleep(1.5)  # polite delay
        
        if not has_next:
            print(f"  No more pages after page {page}")
            break
    
    print(f"\n✅ Total unique listings: {len(all_listings)}")
    
    # Save output
    with open('/tmp/scraped_listings.json', 'w') as f:
        json.dump(all_listings, f, indent=2)
    print(f"💾 Saved to /tmp/scraped_listings.json")
    
    return all_listings

if __name__ == "__main__":
    listings = run_scraper(max_pages=5)
    print(json.dumps(listings[:2], indent=2))
