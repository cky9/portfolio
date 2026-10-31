"""
Non-Invasive Business RPA & Data Cleaning Pipeline
Non-invasive RPA automation & dirty data sanitization pipeline (Redacted Demo).
Usage: python demo_run.py
"""
import time
import json
import random

def run_pipeline():
    print("=" * 70)
    print("🕵️  [Business RPA Pipeline] Launching merchant console scraping & sanitization stream...")
    print("💡 Scenario: Extract unstructured SKU impressions, click conversion & inquiry funnels from closed portals")
    print("=" * 70)
    time.sleep(0.5)

    # Simulated raw unscrubbed records (from DOM parsing or non-standard exports)
    raw_scraped_records = [
        {"raw_sku": "  LED-Flood-Light-50W (US Stock) ", "impressions": "12,450", "ctr": "3.4%", "spend": "$ 145.20", "leads": "18"},
        {"raw_sku": "SOLAR_STREET_LAMP_100W", "impressions": "8,920", "ctr": "4.1%", "spend": "$ 95.00", "leads": "24"},
        {"raw_sku": "Highbay Light 150w-IP65  ", "impressions": "N/A", "ctr": "--", "spend": "$ 0.00", "leads": "0"},
        {"raw_sku": "TRI-PROOF-LIGHT-4FT-40W", "impressions": "25,800", "ctr": "5.2%", "spend": "$ 320.50", "leads": "52"}
    ]

    print(f"📥 Successfully captured {len(raw_scraped_records)} raw unstructured records, starting sanitization pipeline...\n")
    cleaned_records = []

    for i, r in enumerate(raw_scraped_records, 1):
        time.sleep(0.2)
        # 1. SKU Normalization
        clean_sku = r["raw_sku"].strip().upper().replace(" ", "_")
        
        # 2. Impressions parsing
        raw_imp = r["impressions"].replace(",", "")
        imp_count = int(raw_imp) if raw_imp.isdigit() else 0
        
        # 3. CTR parsing
        ctr_val = float(r["ctr"].replace("%", "")) / 100.0 if "%" in r["ctr"] else 0.0
        
        # 4. Spend parsing
        raw_spend = r["spend"].replace("$", "").strip()
        spend_usd = float(raw_spend) if raw_spend else 0.0
        
        leads = int(r["leads"]) if r["leads"].isdigit() else 0
        cpl = spend_usd / leads if leads > 0 else 0.0

        item = {
            "sku": clean_sku,
            "impressions": imp_count,
            "ctr": f"{ctr_val * 100:.2f}%",
            "spend_usd": round(spend_usd, 2),
            "leads": leads,
            "cost_per_lead_usd": round(cpl, 2),
            "status": "PASS" if imp_count > 0 else "FILTERED_EMPTY"
        }
        cleaned_records.append(item)
        print(f"[{i:02d}] Cleaned SKU: {clean_sku:<28} | Spend: ${spend_usd:6.2f} | Leads: {leads:02d} | CPL: ${cpl:5.2f}")

    print("\n" + "=" * 70)
    print("📊 Exported Clean Structured Payload (Ready for SQLite / MySQL):")
    print(json.dumps(cleaned_records, indent=2))
    print("=" * 70)
    print("✅ Pipeline closed! Zero external token consumption, 100% local execution.")

if __name__ == "__main__":
    run_pipeline()
