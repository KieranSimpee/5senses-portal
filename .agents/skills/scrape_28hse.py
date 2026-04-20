#!/usr/bin/env python3
"""
Full 28Hse scraper - ALL HK Island districts, Carpark, Rent, Below HK$49,000
Uses JSON-LD structured data embedded in each district page
"""

import requests
from bs4 import BeautifulSoup
import re, json, time
from datetime import datetime

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

# All HK Island district groups on 28Hse
HK_ISLAND_DISTRICTS = [
    ('dg8',  'Central'),
    ('dg9',  'Sai Ying Pun'),
    ('dg10', 'Sai Wan Ho'),
    ('dg11', 'North Point'),
    ('dg12', 'Quarry Bay'),
    ('dg13', 'Wan Chai'),
    ('dg14', 'Causeway Bay'),
    ('dg15', 'Tin Hau'),
    ('dg16', 'Sheung Wan'),
    ('dg17', 'Mid-Levels'),
    ('dg18', 'Happy Valley'),
    ('dg19', 'Kennedy Town'),
    ('dg20', 'Aberdeen'),
    ('dg21', 'Ap Lei Chau'),
    ('dg22', 'Pok Fu Lam'),
    ('dg23', 'Admiralty'),
    ('dg24', 'Fortress Hill'),
    ('dg25', 'Braemar Hill'),
    ('dg26', 'Shau Kei Wan'),
]

DISTRICT_MAP_CN = {
    '北角': 'North Point', '鰂魚涌': 'Quarry Bay', '灣仔': 'Wan Chai',
    '銅鑼灣': 'Causeway Bay', '天后': 'Tin Hau', '上環': 'Sheung Wan',
    '半山': 'Mid-Levels', '跑馬地': 'Happy Valley', '西灣河': 'Sai Wan Ho',
    '筲箕灣': 'Shau Kei Wan', '太古': 'Tai Koo', '堅尼地城': 'Kennedy Town',
    '西營盤': 'Sai Ying Pun', '炮台山': 'Fortress Hill', '寶馬山': 'Braemar Hill',
    '香港仔': 'Aberdeen', '鴨脷洲': 'Ap Lei Chau', '薄扶林': 'Pok Fu Lam',
    '中環': 'Central', '金鐘': 'Admiralty', '西區': 'Western',
    '太古城': 'Tai Koo',
}

def detect_district_cn(text):
    for k, v in DISTRICT_MAP_CN.items():
        if k in text:
            return v
    return None

def scrape_district(dg_id, district_name, budget=49000):
    """Scrape all listings for one HK Island district"""
    url = f'https://www.28hse.com/en/rent/apartment/a1/{dg_id}/carpark/rentprice-0-{budget}'
    listings = []
    today = datetime.now().strftime('%Y-%m-%d')

    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code != 200:
            return listings

        soup = BeautifulSoup(r.text, 'html.parser')

        # Extract from JSON-LD structured data
        jsonld_scripts = soup.find_all('script', type='application/ld+json')
        for script in jsonld_scripts:
            try:
                data = json.loads(script.string)
                if data.get('@type') == 'ItemList':
                    items = data.get('itemListElement', [])
                    for item in items:
                        pid_m = re.search(r'property-(\d+)', item.get('url', ''))
                        if not pid_m:
                            continue
                        pid = pid_m.group(1)
                        listings.append({
                            'listing_id': pid,
                            'name': district_name + ' Property',
                            'price_hkd': 0,  # will fill from card
                            'district': district_name,
                            'address': f'{district_name}, Hong Kong Island',
                            'beds': 'N/A',
                            'baths': 'N/A',
                            'size_sf': 'N/A',
                            'floor': '',
                            'image_url': item.get('image', ''),
                            'source_url': f'https://www.28hse.com/en/rent/apartment/property-{pid}',
                            'source': '28Hse.com',
                            'agent': '',
                            'carpark': True,
                            'fetched_date': today,
                            'tags': ['hk-island', 'carpark', 'rental']
                        })
            except:
                pass

        # Also parse HTML cards for prices, details
        cards = soup.find_all('div', class_='property_item')
        card_map = {}
        for card in cards:
            link = card.find('a', class_='detail_page')
            if not link:
                continue
            pid_m = re.search(r'property-(\d+)', link.get('href', ''))
            if not pid_m:
                continue
            pid = pid_m.group(1)

            # Price
            price = 0
            price_label = card.find('div', class_=re.compile(r'green.*label|label.*green'))
            if price_label:
                pm = re.search(r'\$\s*([\d,]+)', price_label.get_text())
                if pm:
                    price = int(pm.group(1).replace(',', ''))

            # Name
            header = card.find('div', class_='header')
            name = header.get_text(strip=True) if header else ''

            # District from district_area
            dist_div = card.find('div', class_='district_area')
            dist_text = dist_div.get_text(' ', strip=True) if dist_div else ''
            detected = detect_district_cn(dist_text)
            dist = detected or district_name

            # Size
            area_div = card.find('div', class_='areaUnitPrice')
            size_sf = 'N/A'
            if area_div:
                sm = re.search(r'([\d,]+)\s*呎', area_div.get_text())
                if sm:
                    size_sf = sm.group(1).replace(',', '')

            # Beds/Baths
            tag_div = card.find('div', class_='tagLabels')
            beds, baths = 'N/A', 'N/A'
            if tag_div:
                tt = tag_div.get_text(' ')
                bm = re.search(r'(\d+)\s*房', tt)
                btm = re.search(r'(\d+)\s*浴室', tt)
                if bm: beds = bm.group(1)
                if btm: baths = btm.group(1)

            # Floor
            unit_desc = card.find('span', class_='unit_desc')
            floor_str = ''
            if unit_desc:
                ut = unit_desc.get_text(strip=True)
                if '高層' in ut: floor_str = 'High Floor'
                elif '中層' in ut: floor_str = 'Mid Floor'
                elif '低層' in ut: floor_str = 'Low Floor'

            # Image
            img = card.find('img', class_='detail_page_img')
            image_url = ''
            if img:
                image_url = img.get('src', '')
                if 'loading' in image_url.lower():
                    image_url = img.get('data-src', '')

            # Agent
            company = card.find('div', class_='companyName')
            agent = company.get_text(strip=True) if company else ''

            card_map[pid] = {
                'name': name[:100] if name else f'{dist} Property',
                'price_hkd': price,
                'district': dist,
                'address': dist_text[:150] or f'{dist}, Hong Kong Island',
                'beds': beds,
                'baths': baths,
                'size_sf': size_sf,
                'floor': floor_str,
                'image_url': image_url[:500],
                'agent': agent[:100],
            }

        # Merge JSON-LD listings with card details
        for l in listings:
            pid = l['listing_id']
            if pid in card_map:
                c = card_map[pid]
                l.update(c)
                # Keep image from JSON-LD if card image missing
                if not l['image_url'] and l.get('_jsonld_image'):
                    l['image_url'] = l['_jsonld_image']

        # Add any card listings not in JSON-LD
        for pid, c in card_map.items():
            if not any(l['listing_id'] == pid for l in listings):
                if c['price_hkd'] > 0:
                    listings.append({
                        'listing_id': pid,
                        'source_url': f'https://www.28hse.com/en/rent/apartment/property-{pid}',
                        'source': '28Hse.com',
                        'carpark': True,
                        'fetched_date': today,
                        'tags': ['hk-island', 'carpark', 'rental'],
                        **c
                    })

        # Filter: only include listings with valid price
        listings = [l for l in listings if l.get('price_hkd', 0) > 0]

    except Exception as e:
        print(f'  Error scraping {district_name}: {e}')

    return listings


def scrape_all(budget=49000):
    all_listings = []
    seen_ids = set()
    today = datetime.now().strftime('%Y-%m-%d')

    print(f'🔍 Scraping 28Hse — ALL HK Island districts | Carpark | Below HK${budget:,}')
    print(f'📅 {today}')
    print('-' * 60)

    for dg_id, district_name in HK_ISLAND_DISTRICTS:
        listings = scrape_district(dg_id, district_name, budget)
        new = 0
        for l in listings:
            if l['listing_id'] not in seen_ids:
                seen_ids.add(l['listing_id'])
                all_listings.append(l)
                new += 1
        print(f'  {district_name:20s} ({dg_id}): {new} listings | total so far: {len(all_listings)}')
        time.sleep(0.8)

    # Sort by price
    all_listings.sort(key=lambda x: x.get('price_hkd', 0))
    print(f'\n✅ TOTAL: {len(all_listings)} unique HK Island listings with carpark under HK${budget:,}')
    return all_listings


if __name__ == '__main__':
    listings = scrape_all(budget=49000)
    with open('/tmp/all_listings.json', 'w') as f:
        json.dump(listings, f, indent=2, ensure_ascii=False)
    print(f'\n💾 Saved to /tmp/all_listings.json')
    print('\nTop 10 listings:')
    for l in listings[:10]:
        print(f"  #{l['listing_id']} | {l['name'][:35]:35s} | HK${l['price_hkd']:,} | {l['district']:15s} | {l['size_sf']}ft² | img:{bool(l['image_url'])}")
