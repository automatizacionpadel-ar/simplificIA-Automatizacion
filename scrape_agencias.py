#!/usr/bin/env python3
"""
Scrape travel agencies from agenciasdeviajes.ar RNAV directory.
Uses Livewire protocol to paginate through all results.
"""

import requests
import json
import csv
import re
import time
import html as html_mod
from bs4 import BeautifulSoup

BASE_URL = "https://agenciasdeviajes.ar"
UPDATE_URL = f"{BASE_URL}/livewire/update"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html",
    "Accept-Language": "es-AR,es;q=0.9",
}


def safe_find(data, pattern, group=1, default=""):
    m = re.search(pattern, data)
    return m.group(group) if m else default


def save_debug(filename, content):
    with open(f"/tmp/{filename}", "w", encoding="utf-8") as f:
        f.write(content)


def fetch_page(session, url):
    resp = session.get(url, timeout=30)
    resp.raise_for_status()
    return resp.text


def get_snapshot(html):
    pattern = r'wire:snapshot="([^"]+)"'
    m = re.search(pattern, html)
    if not m:
        print("DEBUG: wire:snapshot not found in HTML")
        print(f"DEBUG: HTML length: {len(html)}")
        if "wire:snapshot" in html:
            idx = html.index("wire:snapshot")
            print(f"DEBUG: Found at index {idx}, context: {html[idx:idx+200]}")
        raise Exception("No wire:snapshot found")
    raw = m.group(1)
    return json.loads(html_mod.unescape(raw))


def call_livewire(session, snapshot, updates):
    payload = {
        "fingerprint": {
            "id": snapshot["memo"]["id"],
            "name": snapshot["memo"]["name"],
            "locale": snapshot["memo"]["locale"],
            "path": snapshot["memo"]["path"],
            "method": snapshot["memo"]["method"],
        },
        "serverMemo": {
            "data": snapshot["data"],
            "dataMeta": [],
            "checksum": snapshot["checksum"],
        },
        "updates": updates,
    }

    h = dict(HEADERS)
    h["Content-Type"] = "application/json"
    h["X-Livewire"] = "true"
    h["Referer"] = f"{BASE_URL}/"

    resp = session.post(UPDATE_URL, json=payload, headers=h, timeout=30)
    resp.raise_for_status()
    return resp.json()


def extract_agencies_from_html(html_str):
    soup = BeautifulSoup(html_str, "html.parser")
    agencies = []

    table = soup.find("table")
    if not table:
        # Try div-based cards
        divs = soup.find_all("div", class_=re.compile(r"border|card|flex.*gap|p-\d", re.I))
        for d in divs:
            text = d.get_text(" | ", strip=True)
            if len(text) > 30:
                agencies.append({"datos": text})
        return agencies

    rows = table.find_all("tr")
    for row in rows:
        cols = row.find_all(["td", "th"])
        if len(cols) < 2:
            continue

        texts = [c.get_text(" ", strip=True) for c in cols]
        combined = " | ".join(texts)

        if any(kw in combined.lower() for kw in ["resultados", "total", "mostrando"]):
            continue

        emails = re.findall(r"[\w.+-]+@[\w-]+\.[\w.]+", combined)
        phones = []
        for t in texts:
            p = re.findall(r"[\d\s()+\-]{8,20}", t)
            for pp in p:
                clean = re.sub(r"[^\d+]", "", pp)
                if len(clean) >= 8:
                    phones.append(pp.strip())

        links = row.find_all("a")
        webs = [a.get("href", "") for a in links if a.get("href", "").startswith("http")]

        agency = {
            "razon_social": texts[0] if len(texts) > 0 else "",
            "nombre_comercial": texts[1] if len(texts) > 1 else "",
            "cuit": texts[2] if len(texts) > 2 else "",
            "legajo": texts[3] if len(texts) > 3 else "",
            "email": emails[0] if emails else "",
            "telefono": phones[0] if phones else "",
            "ciudad": texts[5] if len(texts) > 5 else "",
            "provincia": texts[6] if len(texts) > 6 else "",
            "web": webs[0] if webs else "",
        }
        agencies.append(agency)

    return agencies


def find_pagination_info(html_str, result_json):
    soup = BeautifulSoup(html_str, "html.parser")
    has_more = False
    total_results = 0

    # Method 1: Check for wire:click="nextPage"
    for el in soup.find_all(attrs={"wire:click": True}):
        if "nextPage" in el.get("wire:click", ""):
            has_more = True
            break

    # Method 2: Check for "paginators" in serverMemo
    if isinstance(result_json, dict):
        sm = result_json.get("serverMemo", {})
        data = sm.get("data", {})
        paginators = data.get("paginators", [])
        if isinstance(paginators, list) and len(paginators) > 0:
            p = paginators[0]
            if isinstance(p, dict):
                current = p.get("currentPage", 1)
                last = p.get("lastPage", 1)
                total = p.get("total", 0)
                if last > 1 and current < last:
                    has_more = True
                total_results = total

    # Method 3: Text search
    text = soup.get_text()
    m = re.search(r"(\d+)\s+resultados?", text, re.I)
    if m:
        total_results = int(m.group(1))
    m = re.search(r"Mostrando.*?(\d+).*?de\s+(\d+)", text, re.I)
    if m:
        total_results = int(m.group(2))

    return {"has_more": has_more, "total_results": total_results}


def main():
    city = "CABA"
    print(f"[*] Scraping {BASE_URL} for city: {city}")

    session = requests.Session()
    session.headers.update(HEADERS)

    # 1. Load homepage
    print("[1] Loading homepage...")
    html = fetch_page(session, f"{BASE_URL}/")

    # 2. Extract Livewire snapshot
    snapshot = get_snapshot(html)
    comp_id = snapshot["memo"]["id"]
    print(f"[2] Component: {snapshot['memo']['name']} (ID: {comp_id})")

    # 3. Search by city
    print(f'[3] Searching for "{city}"...')
    result = call_livewire(
        session,
        snapshot,
        [
            {
                "type": "syncInput",
                "payload": {"id": comp_id, "name": "ciudad", "value": city},
            }
        ],
    )
    snapshot = result.get("serverMemo", snapshot)

    # 4. Extract data and paginate
    all_agencies = []
    page = 1

    while True:
        print(f"\n[4] Processing page {page}...")

        html_content = ""
        if isinstance(result, dict):
            effects = result.get("effects", {})
            if isinstance(effects, dict):
                html_content = effects.get("html", "")
            if not html_content:
                html_content = result.get("html", "")

        if html_content:
            save_debug(f"page_{page}.html", html_content)

        agencies = extract_agencies_from_html(html_content) if html_content else []
        print(f"    Agencies found on page: {len(agencies)}")

        if not agencies:
            # Debug: print HTML excerpt
            if html_content:
                print(f"    HTML preview ({len(html_content)} chars): {html_content[:500]}")
            break

        all_agencies.extend(agencies)

        page_info = find_pagination_info(html_content, result)
        total = page_info["total_results"]
        has_more = page_info["has_more"]
        print(f"    Total results: {total or 'unknown'}, Has more: {has_more}")

        if not has_more:
            break

        page += 1
        result = call_livewire(
            session,
            snapshot,
            [
                {
                    "type": "callMethod",
                    "payload": {"id": comp_id, "method": "nextPage", "params": []},
                }
            ],
        )
        snapshot = result.get("serverMemo", snapshot)
        time.sleep(5)

    # 5. Save CSV
    filename = f"agencias_{city.lower()}.csv"
    print(f"\n[5] Saving {len(all_agencies)} agencies to {filename}...")

    if all_agencies:
        fieldnames = [
            "razon_social",
            "nombre_comercial",
            "cuit",
            "legajo",
            "email",
            "telefono",
            "ciudad",
            "provincia",
            "web",
        ]
        with open(filename, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(all_agencies)

    print(f"\nDone! {len(all_agencies)} agencies saved.")
    return all_agencies


if __name__ == "__main__":
    main()
