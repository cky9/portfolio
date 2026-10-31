> **[ 🌐 English Version | 🇨🇳 [中文文档 (Chinese Version)](./README_ZH.md) ]**

# 👗 Fashion AI Studio — Personalized Apparel Design & AI Virtual Try-On Platform

> **Design inspiration & alignment**: A faithful replication and elevation of the "Sneaker Personalization & AI Virtual Try-On Platform" architecture and interaction philosophy, rebuilt as an end-to-end couture design and virtual try-on system for apparel.

---

## 🌟 Core Feature Mapping (Five Closed-Loop Workflows)

| # | Platform Core Workflow | Corresponding Original Capability | Apparel System Implementation Details |
| :--- | :--- | :--- | :--- |
| **1** | **Style Selection** | Sneaker selection (silhouette/style) | British trench coat, Italian bespoke suit, American heavyweight hoodie, cyber-techwear bomber jacket, French vintage dress, minimalist tee, and more |
| **2** | **Personalized Design** | Component-level fine-tuning (color/material/accessories) | **Dynamic leader-line callouts** pointing to collar, body, sleeves, pockets, trim buttons, and hem; supports Pantone trend palettes, premium fabrics (wool/silk/denim/technical), and prints (plaid/stripe/houndstooth/logo) |
| **3** | **AI Virtual Try-On** | Phone mockup + AI try-on | **Mobile-style realistic try-on viewport** + Canvas high-fidelity portrait deformation and adaptive fitting engine; supports 4 professional models (male/female, multiple body types) plus user selfie upload fitting, with front, 45° side, and back view switching |
| **4** | **Multi-Option Comparison** | Side-by-side comparison of options | Horizontal side-by-side display of Option A vs. Option B vs. Option C, including material composition, style-dimension scoring, lead-time estimates, and comparison |
| **5** | **Save & Share** | Save designs, download renders | Local/cloud design library with persistent storage; one-click export of 2K ultra-HD "Garment Try-On Tech Pack & Pattern-Making Poster" |

---

## 🚀 Getting Started

### Option 1: One-Click Launch on macOS (Recommended)
Double-click directly in Finder:
- `/Users/ck/Desktop/小工具/启动服装AI试穿系统.command`
- Or enter the directory and double-click `clothing_tryon_system/启动服装AI试穿系统.command`

The system automatically starts the background service and opens Safari / Chrome to `http://127.0.0.1:8765`.

### Option 2: Launch from the Terminal
```bash
cd /Users/ck/Desktop/小工具/clothing_tryon_system
PYTHONIOENCODING=utf-8 /usr/bin/python3 server.py 8765
```
Then visit in your browser: `http://127.0.0.1:8765`

---

## 🛠️ Tech Stack & Directory Structure

- **Frontend architecture**: Native HTML5 + Modern CSS (Glassmorphism) + SVG vector multi-component layers + Canvas fitting render engine — **zero external npm dependencies, works out of the box**.
- **Backend service**: An adaptive RESTful service built on Python 3's native `http.server`, with persistent storage (`data/saved_designs.json`) and user photo upload support.

```text
clothing_tryon_system/
├── index.html                 # Main system interaction view
├── 启动服装AI试穿系统.command    # macOS one-click launch executable script
├── server.py                  # Lightweight self-contained backend service (port 8765)
├── css/
│   └── style.css              # Premium dark-tech and fashion visual styling
├── js/
│   ├── presets.js             # Style library, Pantone palettes, fabric textures, model data definitions
│   ├── tryon_engine.js        # Vector component geometry, leader-line callouts, Canvas try-on fitting algorithms
│   └── app.js                 # Core event dispatch, state management, and API communication
├── data/
│   └── saved_designs.json     # Persistent database of custom designs
└── uploads/                   # Cache directory for user selfie portrait uploads
