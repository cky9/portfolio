> **[ 🌐 English Version | 🇨🇳 [中文文档 (Chinese Version)](./README_ZH.md) ]**

# ⚡ QMT / XtQuant Broker-Grade Quantitative Trading SDK Knowledge Engineering & Hands-On Walkthrough

> **Open-Source Project Home**: 🔗 [qmt-xtquant-knowledge-base-v1.0 (Gitee Open-Source Knowledge Base)](https://gitee.com/ckyan3/qmt-xtquant-knowledge-base-v1.0)  
> **Business Value**: The official XtQuant SDK documentation from XunTou is fragmented, the underlying C++ callback mechanism is a common source of pitfalls, and AI-generated strategies frequently hallucinate. This project builds China's first comprehensive knowledge base for broker trading SDKs, purpose-built for AI Agents (RAG-Ready), covering core module breakdowns, live-trading async callback state machines, multi-factor strategy templates, and development scaffolding.

---

## 🚀 Quick Start (Zero Dependency Demo)

No need to install the bulky broker QMT Windows client—pure native Python lets you experience the broker-grade trader state machine and async callback event dispatch mechanism:

```bash
python demo_run.py
```

### Core Flows Verified:
1. **XtQuantTrader initialization and session authentication**;
2. **`xtdata` async high-frequency market data pull and Level-2 order book resolution**;
3. **`xttrader` async stock order submission (`order_stock_async`)**;
4. **Full lifecycle event callbacks (`on_order_stock_async` ➔ `on_trade_stock`)**;
5. **Pre-trade risk control interception mechanism (`on_order_error`)**.

---

## 📚 Complete Open-Source Knowledge Base Overview

For the full API reference manual, dual moving average / Bollinger Band strategy templates, and the AI vector retrieval handbook, visit the companion open-source repository:
👉 **[https://gitee.com/ckyan3/qmt-xtquant-knowledge-base-v1.0](https://gitee.com/ckyan3/qmt-xtquant-knowledge-base-v1.0)**
