#!/usr/bin/env python3
"""Scrape agenciasdeviajes.ar using Playwright (headless browser)."""

import csv
import re
import time
from playwright.sync_api import sync_playwright

BASE_URL = "https://agenciasdeviajes.ar"
CITY = "CABA"
OUTPUT = f"agencias_{CITY.lower()}.csv"


def extract_agencies_from_page(page):
    """Extract agency data from div-based card layout."""
    agencies = []

    # Each agency is a 3-column flex container
    cards = page.locator(".column-3")
    count = cards.count()

    if count == 0:
        print("    No .column-3 containers found")
        return agencies

    for i in range(count):
        card = cards.nth(i)
        # Each card has 3 child divs
        columns = card.locator("> div")
        col_count = columns.count()

        if col_count < 2:
            continue

        # Extract ALL text from the card
        full_text = card.inner_text()
        lines = full_text.split("\n")

        agency = {
            "nombre_comercial": "",
            "razon_social": "",
            "cuit": "",
            "legajo": "",
            "email": "",
            "telefono": "",
            "web": "",
            "domicilio": "",
            "provincia": "",
            "localidad": "",
            "cp": "",
        }

        # Parse the card text line by line
        for line in lines:
            line = line.strip()
            if not line:
                continue

            lower = line.lower()

            if lower.startswith("razon social:"):
                agency["razon_social"] = line.split(":", 1)[1].strip()
            elif lower.startswith("cuit:"):
                agency["cuit"] = line.split(":", 1)[1].strip()
            elif lower.startswith("legajo:"):
                agency["legajo"] = line.split(":", 1)[1].strip()
            elif lower.startswith("correo electrónico:"):
                agency["email"] = line.split(":", 1)[1].strip()
            elif lower.startswith("provincia:"):
                agency["provincia"] = line.split(":", 1)[1].strip()
            elif lower.startswith("localidad:"):
                agency["localidad"] = line.split(":", 1)[1].strip()
            elif lower.startswith("cp:") or lower.startswith("código postal:"):
                agency["cp"] = line.split(":", 1)[1].strip()
            elif lower.startswith("teléfono:") or lower.startswith("telefono:"):
                agency["telefono"] = line.split(":", 1)[1].strip()
            elif lower.startswith("domicilio:"):
                agency["domicilio"] = line.split(":", 1)[1].strip()
            else:
                # The first line that doesn't match any label is the name
                if not agency["nombre_comercial"] and not any(
                    kw in lower for kw in ["correo electrónico", "telefono", "domicilio", "provincia"]
                ):
                    agency["nombre_comercial"] = line

        # Extract links (web and email)
        links = card.locator("a")
        for j in range(links.count()):
            link = links.nth(j)
            href = link.get_attribute("href") or ""
            if href.startswith("http") and "agenciasdeviajes" not in href:
                agency["web"] = href
            elif href.startswith("mailto:"):
                agency["email"] = href.replace("mailto:", "")

        if agency["nombre_comercial"]:
            agencies.append(agency)

    return agencies


def has_next_page(page):
    """Check if there is a next page button."""
    # Check for Livewire pagination with nextPage
    pagination_links = page.locator("[wire\\:click*='nextPage']")
    if pagination_links.count() > 0:
        for i in range(pagination_links.count()):
            el = pagination_links.nth(i)
            if el.is_visible():
                # Check if the parent has disabled styling
                parent = el.locator("..")
                parent_class = parent.get_attribute("class") or ""
                if "disabled" not in parent_class and "cursor-not-allowed" not in parent_class:
                    return True

    # Fallback: look for visible "Siguiente" text
    next_text = page.locator("text=Siguiente").first
    try:
        if next_text.is_visible(timeout=1000):
            return True
    except Exception:
        pass

    return False


def go_to_next_page(page):
    """Navigate to next page."""
    # Try Livewire pagination link
    pagination_links = page.locator("[wire\\:click*='nextPage']")
    if pagination_links.count() > 0:
        for i in range(pagination_links.count()):
            el = pagination_links.nth(i)
            if el.is_visible():
                parent = el.locator("..")
                parent_class = parent.get_attribute("class") or ""
                if "disabled" not in parent_class and "cursor-not-allowed" not in parent_class:
                    el.click()
                    return True

    # Fallback: click "Siguiente" text
    try:
        next_text = page.locator("text=Siguiente").first
        if next_text.is_visible(timeout=1000):
            next_text.click()
            return True
    except Exception:
        pass

    return False


def wait_for_results(page):
    """Wait for search results to load."""
    try:
        # Wait for table or content to appear
        page.wait_for_selector("table", timeout=10000)
    except Exception:
        # Check if there are no results
        body_text = page.locator("body").inner_text()
        if "no se encontraron" in body_text.lower() or "sin resultados" in body_text.lower():
            print("    No results found for this search.")
            return False
    return True


def main():
    print(f"[*] Scraping {BASE_URL} for city: {CITY} (using Playwright)")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="es-AR",
        )

        page = context.new_page()

        try:
            print("[1] Loading homepage...")
            page.goto(f"{BASE_URL}/#buscador", wait_until="networkidle", timeout=30000)

            # Close any popup/banner modals that might be blocking
            print("[1.5] Closing popup banners...")
            # Try clicking the close button on modals
            try:
                close_btn = page.locator("button.fi-modal-close-btn").first
                if close_btn.is_visible(timeout=2000):
                    close_btn.click()
                    time.sleep(0.5)
            except Exception:
                pass
            # Also try clicking away from modals or pressing Escape
            page.keyboard.press("Escape")
            time.sleep(0.5)
            # Also try clicking the banner close button
            try:
                banner_close = page.locator("[data-dismiss-target='#marketing-banner']").first
                if banner_close.is_visible(timeout=1000):
                    banner_close.click()
                    time.sleep(0.5)
            except Exception:
                pass

            # Scroll to the buscador form
            print("[2] Filling ciudad='CABA'...")
            # First scroll the element into view to ensure it's not covered
            page.locator("#buscador").scroll_into_view_if_needed()
            time.sleep(0.5)

            page.wait_for_selector("input[placeholder*='Ciudad']", timeout=10000)

            # Use force click and fill to avoid modal interference
            ciudad_input = page.locator("input[placeholder*='Ciudad']").first
            ciudad_input.click(force=True)
            ciudad_input.fill(CITY)

            # Wait for Livewire to react (debounce 350ms + processing time)
            time.sleep(2)

            # Wait for results
            print("[3] Waiting for results...")
            has_results = wait_for_results(page)
            if not has_results:
                print("    No results or couldn't find table. Taking screenshot...")
                page.screenshot(path="/tmp/debug.png", full_page=True)
                print("    Screenshot saved to /tmp/debug.png")

            # Extract data from all pages
            all_agencies = []
            page_num = 1

            while True:
                print(f"\n[4] Extracting page {page_num}...")

                # Wait a bit for content to render
                time.sleep(2)

                # Debug: save page HTML
                content = page.content()
                with open(f"/tmp/page_{page_num}.html", "w", encoding="utf-8") as f:
                    f.write(content)

                agencies = extract_agencies_from_page(page)
                print(f"    Found {len(agencies)} agencies on this page")

                if not agencies:
                    print("    No agencies extracted. Checking HTML...")
                    # Print page body text to see what's visible
                    body = page.locator("body").inner_text()
                    print(f"    Body text (first 500): {body[:500]}")

                    if page_num > 1:
                        print("    Breaking after first page check.")
                    break

                all_agencies.extend(agencies)

                # Check for next page
                if has_next_page(page):
                    page_num += 1
                    print(f"    Going to page {page_num}...")
                    go_to_next_page(page)
                    time.sleep(3)
                else:
                    print("    No more pages.")
                    break

            # Save to CSV
            print(f"\n[5] Saving {len(all_agencies)} agencies to {OUTPUT}")
            if all_agencies:
                fieldnames = [
                    "nombre_comercial",
                    "razon_social",
                    "cuit",
                    "legajo",
                    "email",
                    "telefono",
                    "web",
                    "domicilio",
                    "provincia",
                    "localidad",
                    "cp",
                ]
                with open(OUTPUT, "w", newline="", encoding="utf-8-sig") as f:
                    writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
                    writer.writeheader()
                    writer.writerows(all_agencies)
                print(f"    Done! {len(all_agencies)} agencies saved to {OUTPUT}")
            else:
                print("    No agencies found!")

        except Exception as e:
            print(f"\nERROR: {e}")
            import traceback
            traceback.print_exc()
            page.screenshot(path="/tmp/error.png", full_page=True)
            print("Error screenshot saved to /tmp/error.png")

        finally:
            browser.close()


if __name__ == "__main__":
    main()
