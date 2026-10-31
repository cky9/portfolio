> **[ 🌐 English Version | 🇨🇳 [中文文档 (Chinese Version)](./README_ZH.md) ]**

# 🧩 BOM QC Non-Standard Material Normalization & Similarity Validation Engine

> **Business value**: Material codes in a 10-year-old legacy ERP are a mess—the same part has tons of typos, stray spaces, and aliases from different employees entering data. This project skips expensive cloud LLM APIs and instead uses a pure-CPU **Levenshtein edit distance algorithm** plus a self-learning **Alias Tree** to achieve high-accuracy non-standard material alignment and automatic mapping in milliseconds.

## 🚀 Quick Start (Zero Dependency Demo)
No third-party packages required (uses only Python's built-in standard library):
```bash
python demo_run.py
```

## 🛠️ Performance & Metrics
- **Single-core throughput**: > 15,000 materials / sec;
- **Memory footprint**: < 15MB resident memory;
- **Deployment form**: Can run as a non-intrusive sidecar service or as the backend for Excel/WPS batch-processing macros.
