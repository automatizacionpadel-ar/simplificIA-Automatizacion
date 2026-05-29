#!/usr/bin/env python3
"""
Scrape agenciasdeviajes.ar using Playwright.
Usage: python3 scrape_province.py "Provincia Name"
"""

import csv
import sys
import time
from playwright.sync_api import sync_playwright

BASE_URL = "https://agenciasdeviajes.ar"


def extract_agencies_from_page(page):
    """Extract agency data from div-based card layout."""
    agencies = []
    cards = page.locator(".column-3")
    count = cards.count()
    if count == 0:
        return agencies

    for i in range(count):
        card = cards.nth(i)
        columns = card.locator("> div")
        if columns.count() < 2:
            continue

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
            elif lower.startswith("correo electrónico:") or lower.startswith("correo electronico:"):
                agency["email"] = line.split(":", 1)[1].strip()
            elif lower.startswith("teléfono:") or lower.startswith("telefono:"):
                agency["telefono"] = line.split(":", 1)[1].strip()
            elif lower.startswith("provincia:"):
                agency["provincia"] = line.split(":", 1)[1].strip()
            elif lower.startswith("localidad:"):
                agency["localidad"] = line.split(":", 1)[1].strip()
            elif lower.startswith("cp:") or lower.startswith("código postal:"):
                agency["cp"] = line.split(":", 1)[1].strip()
            elif lower.startswith("domicilio:"):
                agency["domicilio"] = line.split(":", 1)[1].strip()
            else:
                if not agency["nombre_comercial"] and not any(
                    kw in lower
                    for kw in [
                        "correo electrónico",
                        "correo electronico",
                        "telefono",
                        "teléfono",
                        "domicilio",
                        "provincia",
                        "localidad",
                        "cp:",
                        "razon social",
                        "cuit",
                        "legajo",
                    ]
                ):
                    agency["nombre_comercial"] = line

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
    pagination_links = page.locator("[wire\\:click*='nextPage']")
    if pagination_links.count() > 0:
        for i in range(pagination_links.count()):
            el = pagination_links.nth(i)
            if el.is_visible():
                parent = el.locator("..")
                parent_class = parent.get_attribute("class") or ""
                if "disabled" not in parent_class and "cursor-not-allowed" not in parent_class:
                    return True
    try:
        if page.locator("text=Siguiente").first.is_visible(timeout=1000):
            return True
    except Exception:
        pass
    return False


def go_to_next_page(page):
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
    try:
        if page.locator("text=Siguiente").first.is_visible(timeout=1000):
            page.locator("text=Siguiente").first.click()
            return True
    except Exception:
        pass
    return False


def wait_for_results(page):
    try:
        page.wait_for_selector("table, .column-3", timeout=10000)
        return True
    except Exception:
        body_text = page.locator("body").inner_text().lower()
        if "no se encontraron" in body_text or "sin resultados" in body_text:
            return False
    return False


def scrape_province(query, output_file):
    """Scrape agencies for a given province/city query."""
    print(f"\n{'='*60}")
    print(f"SCRAPING: {query} -> {output_file}")
    print(f"{'='*60}")

    all_agencies = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="es-AR",
        )
        page = context.new_page()

        try:
            page.goto(f"{BASE_URL}/#buscador", wait_until="networkidle", timeout=30000)

            # Close modals
            try:
                close_btn = page.locator("button.fi-modal-close-btn").first
                if close_btn.is_visible(timeout=2000):
                    close_btn.click()
                    time.sleep(0.5)
            except Exception:
                pass
            page.keyboard.press("Escape")
            time.sleep(0.5)
            try:
                banner_close = page.locator("[data-dismiss-target='#marketing-banner']").first
                if banner_close.is_visible(timeout=1000):
                    banner_close.click()
                    time.sleep(0.5)
            except Exception:
                pass

            # Fill search
            page.locator("#buscador").scroll_into_view_if_needed()
            time.sleep(0.5)
            page.wait_for_selector("input[placeholder*='Ciudad']", timeout=10000)
            ciudad_input = page.locator("input[placeholder*='Ciudad']").first
            ciudad_input.click(force=True)
            ciudad_input.fill(query)
            time.sleep(2)

            has_data = wait_for_results(page)
            if not has_data:
                print(f"    No results for: {query}")
                browser.close()
                return []

            page_num = 1
            while True:
                print(f"    Page {page_num}...", end=" ")
                time.sleep(2)

                agencies = extract_agencies_from_page(page)
                print(f"{len(agencies)} agencies")
                if not agencies:
                    if page_num == 1:
                        # Check if page has other content
                        body = page.locator("body").inner_text()
                        print(f"    Body preview: {body[:200]}")
                    break

                all_agencies.extend(agencies)

                if has_next_page(page):
                    page_num += 1
                    go_to_next_page(page)
                    time.sleep(3)
                else:
                    break

        except Exception as e:
            print(f"    ERROR: {e}")

        finally:
            browser.close()

    # Save CSV
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
        with open(output_file, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(all_agencies)
        print(f"    SAVED: {len(all_agencies)} agencies -> {output_file}")
    else:
        print(f"    NO DATA for {query}")

    return all_agencies


# List of all Argentine provinces + CABA
PROVINCE_QUERIES = [
    ("Buenos Aires", "agencias_buenos_aires.csv"),
    ("Catamarca", "agencias_catamarca.csv"),
    ("Chaco", "agencias_chaco.csv"),
    ("Chubut", "agencias_chubut.csv"),
    ("Córdoba", "agencias_cordoba.csv"),
    ("Corrientes", "agencias_corrientes.csv"),
    ("Entre Ríos", "agencias_entre_rios.csv"),
    ("Formosa", "agencias_formosa.csv"),
    ("Jujuy", "agencias_jujuy.csv"),
    ("La Pampa", "agencias_la_pampa.csv"),
    ("La Rioja", "agencias_la_rioja.csv"),
    ("Mendoza", "agencias_mendoza.csv"),
    ("Misiones", "agencias_misiones.csv"),
    ("Neuquén", "agencias_neuquen.csv"),
    ("Río Negro", "agencias_rio_negro.csv"),
    ("Salta", "agencias_salta.csv"),
    ("San Juan", "agencias_san_juan.csv"),
    ("San Luis", "agencias_san_luis.csv"),
    ("Santa Cruz", "agencias_santa_cruz.csv"),
    ("Santa Fe", "agencias_santa_fe.csv"),
    ("Santiago del Estero", "agencias_santiago_del_estero.csv"),
    ("Tierra del Fuego", "agencias_tierra_del_fuego.csv"),
    ("Tucumán", "agencias_tucuman.csv"),
]


if __name__ == "__main__":
    if len(sys.argv) > 1:
        query = sys.argv[1]
        fname = sys.argv[2] if len(sys.argv) > 2 else f"agencias_{query.lower().replace(' ', '_')}.csv"
        scrape_province(query, fname)
    else:
        print("Running ALL provinces...")
        total_all = 0
        for query, filename in PROVINCE_QUERIES:
            agencies = scrape_province(query, filename)
            total_all += len(agencies)
            print(f"    Running total: {total_all}")
        print(f"\n{'='*60}")
        print(f"TOTAL agencies across all provinces: {total_all}")
