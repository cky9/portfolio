"""
Non-Invasive Business RPA & Data Cleaning Pipeline
无侵入式业务 RPA 自动化与脏数据清洗管道 (脱敏演示版)
运行方式: python demo_run.py
"""
import time
import json
import random

def run_pipeline():
    print("=" * 70)
    print("🕵️  [业务 RPA 管道] 启动电商工作台数据穿透与本地清洗流...")
    print("💡 模拟场景：从封闭商家后台拉取非结构化单品曝光、点击转化与咨询漏斗")
    print("=" * 70)
    time.sleep(0.5)

    # 模拟原始脏数据（来自网页 DOM 或非标报表）
    raw_scraped_records = [
        {"raw_sku": "  LED-Flood-Light-50W (US Stock) ", "impressions": "12,450", "ctr": "3.4%", "spend": "$ 145.20", "leads": "18"},
        {"raw_sku": "SOLAR_STREET_LAMP_100W", "impressions": "8,920", "ctr": "4.1%", "spend": "￥ 680.00", "leads": "24"},
        {"raw_sku": "Highbay Light 150w-IP65  ", "impressions": "N/A", "ctr": "--", "spend": "$ 0.00", "leads": "0"},
        {"raw_sku": "TRI-PROOF-LIGHT-4FT-40W", "impressions": "25,800", "ctr": "5.2%", "spend": "$ 320.50", "leads": "52"}
    ]

    print(f"📥 成功捕获 {len(raw_scraped_records)} 条非侵入原始记录，开始数据管道清洗...\n")
    cleaned_records = []

    for i, r in enumerate(raw_scraped_records, 1):
        time.sleep(0.2)
        # 1. SKU 规范化
        clean_sku = r["raw_sku"].strip().upper().replace(" ", "_")
        
        # 2. 曝光量去千分符
        raw_imp = r["impressions"].replace(",", "")
        imp_count = int(raw_imp) if raw_imp.isdigit() else 0
        
        # 3. 点击率解析
        ctr_val = float(r["ctr"].replace("%", "")) / 100.0 if "%" in r["ctr"] else 0.0
        
        # 4. 汇率与花费统一折算为 USD
        raw_spend = r["spend"].replace("$", "").replace("￥", "").strip()
        spend_usd = float(raw_spend) if "$" in r["spend"] else (float(raw_spend) / 7.25 if "￥" in r["spend"] else 0.0)
        
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
        print(f"[{i:02d}] 清洗 SKU: {clean_sku:<28} | 花费: ${spend_usd:6.2f} | 线索: {leads:02d} | 单线索成本: ${cpl:5.2f}")

    print("\n" + "=" * 70)
    print("📊 导出清洗完毕的结构化本地报文 (Ready for SQLite / MySQL):")
    print(json.dumps(cleaned_records, indent=2, ensure_ascii=False))
    print("=" * 70)
    print("✅ 管道闭环完成！0 外部 Token 消耗，全本地运行。")

if __name__ == "__main__":
    run_pipeline()
