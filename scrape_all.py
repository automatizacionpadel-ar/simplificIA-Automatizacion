#!/usr/bin/env python3
"""
Scrape ALL agencies from agenciasdeviajes.ar (no filter) and split by province.
Much faster than scraping each province individually.
"""

import csv
import time
import os
from collections import defaultdict
from playwright.sync_api import sync_playwright

BASE_URL = "https://agenciasdeviajes.ar"


def extract_agencies(page):
    agencies = []
    cards = page.locator(".column-3")
    for i in range(cards.count()):
        card = cards.nth(i)
        if card.locator("> div").count() < 2:
            continue
        lines = card.inner_text().split("\n")

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
            elif "correo electrónico" in lower or "correo electronico" in lower:
                agency["email"] = line.split(":", 1)[1].strip()
            elif lower.startswith("teléfono:") or lower.startswith("telefono:"):
                agency["telefono"] = line.split(":", 1)[1].strip()
            elif lower.startswith("provincia:"):
                agency["provincia"] = line.split(":", 1)[1].strip()
            elif lower.startswith("localidad:"):
                agency["localidad"] = line.split(":", 1)[1].strip()
            elif lower.startswith("cp:"):
                agency["cp"] = line.split(":", 1)[1].strip()
            elif lower.startswith("domicilio:"):
                agency["domicilio"] = line.split(":", 1)[1].strip()
            elif not agency["nombre_comercial"] and not any(
                kw in lower
                for kw in ["correo", "telefono", "teléfono", "domicilio", "provincia", "localidad", "cp:", "razon social", "cuit", "legajo"]
            ):
                agency["nombre_comercial"] = line

        # Links
        for j in range(card.locator("a").count()):
            link = card.locator("a").nth(j)
            href = link.get_attribute("href") or ""
            if href.startswith("http") and "agenciasdeviajes" not in href:
                agency["web"] = href
            elif href.startswith("mailto:"):
                agency["email"] = href.replace("mailto:", "")

        if agency["nombre_comercial"]:
            agencies.append(agency)
    return agencies


def has_next(page):
    links = page.locator("[wire\\:click*='nextPage']")
    for i in range(links.count()):
        el = links.nth(i)
        if el.is_visible():
            pc = el.locator("..").get_attribute("class") or ""
            if "disabled" not in pc and "cursor-not-allowed" not in pc:
                return True
    try:
        return page.locator("text=Siguiente").first.is_visible(timeout=1000)
    except Exception:
        return False


def go_next(page):
    links = page.locator("[wire\\:click*='nextPage']")
    for i in range(links.count()):
        el = links.nth(i)
        if el.is_visible():
            pc = el.locator("..").get_attribute("class") or ""
            if "disabled" not in pc and "cursor-not-allowed" not in pc:
                el.click()
                return True
    try:
        if page.locator("text=Siguiente").first.is_visible(timeout=1000):
            page.locator("text=Siguiente").first.click()
            return True
    except Exception:
        pass
    return False


def split_by_province(all_agencies, output_dir="agencias_por_provincia"):
    """Split agencies list into per-province CSV files."""
    os.makedirs(output_dir, exist_ok=True)
    by_province = defaultdict(list)

    for a in all_agencies:
        prov = a.get("provincia", "").strip()
        if not prov:
            prov = "Sin Provincia"
        # Normalize province names
        prov_norm = prov.lower()
        by_province[prov_norm].append(a)

    summary = {}
    fieldnames = [
        "nombre_comercial", "razon_social", "cuit", "legajo",
        "email", "telefono", "web", "domicilio",
        "provincia", "localidad", "cp",
    ]

    for prov_name, agencies in sorted(by_province.items()):
        safe_name = prov_name.replace(" ", "_").replace("/", "_").replace("'", "")
        filename = os.path.join(output_dir, f"agencias_{safe_name}.csv")
        with open(filename, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(agencies)
        summary[prov_name] = len(agencies)

    return summary


def main():
    print("=" * 60)
    print("SCRAPING ALL AGENCIES (no filter) from agenciasdeviajes.ar")
    print("=" * 60)

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
            print("[1] Loading homepage...")
            page.goto(f"{BASE_URL}/#buscador", wait_until="networkidle", timeout=30000)

            # Close popups
            for _ in range(3):
                try:
                    close_btn = page.locator("button.fi-modal-close-btn").first
                    if close_btn.is_visible(timeout=1500):
                        close_btn.click()
                        time.sleep(0.3)
                except Exception:
                    pass
                page.keyboard.press("Escape")
                time.sleep(0.3)
            try:
                banner = page.locator("[data-dismiss-target='#marketing-banner']").first
                if banner.is_visible(timeout=1000):
                    banner.click()
            except Exception:
                pass

            # Scroll to form and wait for initial render
            page.locator("#buscador").scroll_into_view_if_needed()
            time.sleep(1)

            # Wait for data to load (initial page loads all results)
            print("[2] Waiting for data...")
            try:
                page.wait_for_selector(".column-3", timeout=10000)
            except Exception:
                pass
            time.sleep(2)

            page_num = 1
            while True:
                print(f"    Page {page_num}...", end=" ", flush=True)
                time.sleep(1.5)

                agencies = extract_agencies(page)
                count = len(agencies)
                print(f"{count} agencies  (total: {len(all_agencies) + count})")

                if count == 0 and page_num > 1:
                    break

                all_agencies.extend(agencies)

                if has_next(page):
                    page_num += 1
                    go_next(page)
                    time.sleep(2.5)
                else:
                    print("    No more pages.")
                    break

        except Exception as e:
            print(f"\n    ERROR: {e}")
            import traceback
            traceback.print_exc()

        finally:
            browser.close()

    # Save full CSV
    print(f"\n[3] Saving {len(all_agencies)} total agencies to agencias_todas.csv...")
    fieldnames = [
        "nombre_comercial", "razon_social", "cuit", "legajo",
        "email", "telefono", "web", "domicilio",
        "provincia", "localidad", "cp",
    ]
    with open("agencias_todas.csv", "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(all_agencies)

    # Split by province
    print("\n[4] Splitting by province...")
    summary = split_by_province(all_agencies)
    for prov, count in summary.items():
        print(f"    {prov}: {count}")

    print(f"\n{'='*60}")
    print(f"DONE! {len(all_agencies)} total agencies across {len(summary)} provinces.")
    print(f"Files saved in: agencias_por_provincia/")


if __name__ == "__main__":
    main()
