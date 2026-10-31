> **[ 🌐 English Version | 🇨🇳 [中文文档 (Chinese Version)](./README_ZH.md) ]**

# 💾 Local Client SQLite Reverse-Engineering Parser & Multimedia Asset Deduplication Tool

> **Business Value**: When facing terabytes of images, videos, and documents on a NAS or local storage, computing full-file MD5 hashes directly causes massive disk I/O bottlenecks. This project reverse-engineers the SQLite cache database already present on the local client, extracting existing metadata and combining it with "head-middle-tail hash sampling" to achieve zero network transfer and blazing-fast, second-level deduplication.

## 🚀 Quick Start
```bash
python demo_run.py
