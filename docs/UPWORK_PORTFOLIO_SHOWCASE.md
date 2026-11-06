# 🎯 Upwork Portfolio Ready-to-Publish Case Studies (Copy-Paste Kit)

> Use these 6 high-converting Portfolio Project entries in your Upwork Profile (**Profile ➔ Portfolio ➔ + Add Project**). Each card is engineered around **Client Pain ➔ Deterministic Architecture ➔ Measurable ROI** with direct links to your GitHub runnable code.

---

## Card 1: Slot-Based Multi-Horizon Execution State Machine & Order Reconciliation Engine
- **Project Title**: `High-Frequency Trading State Machine & Order Reconciliation Engine`
- **Role**: `Lead Quantitative Systems Architect`
- **Skills Tags**: `Python`, `Algorithmic Trading`, `State Machine`, `Redis`, `API Integration`, `Concurrency`
- **Project URL**: `https://github.com/cky9/portfolio/tree/main/demos/04_realtime_engine/slot_state_machine`
- **Project Description (Copy-Paste)**:
  > **The Challenge**: Traditional algorithmic execution engines that rely on coarse-grained net-exposure counters suffer from cross-timeframe signal collisions, partial-fill inventory drift, and "false closed-loop" bugs when legacy order IDs are misbound during gateway timeouts.
  >
  > **The Solution**: Engineered a production-grade Two-Layer Container + Horizon Slot (`5m`/`15m`) State Machine in Python 3.12:
  > 1. **Snapshot-Set Diffing Order Binding**: Captures pre-dispatch vs. post-dispatch order sets (`S_after - S_before`) to guarantee zero historical order misbinding.
  > 2. **Cross-Horizon Direction Mutex**: Prevents simultaneous opposing orders across fast and slow timeframes while enforcing a strict base-inventory protection floor.
  > 3. **Partial-Fill Dynamic Lot Splitting & `UNBOUND` Fail-Closed Breaker**: Automatically splits residual exposure on partial fills with a 30s anti-spam cooldown, and locks risk quota in an `UNBOUND` state if an API call times out.
  >
  > **Results & Impact**: Eliminated 100% of cross-horizon order deadlocks and phantom fill bindings in live multi-account trading, achieving sub-millisecond state transitions with zero dirty reads.

---

## Card 2: Singleflight C-SDK Concurrency Gate & Sub-5μs Lock-Free Snapshot Bus
- **Project Title**: `Singleflight Concurrency Gate & Sub-5μs Real-Time Market Data Bus`
- **Role**: `Distributed Systems & Backend Engineer`
- **Skills Tags**: `Python`, `Concurrency`, `Redis`, `ETL Pipeline`, `High-Performance Computing`
- **Project URL**: `https://github.com/cky9/portfolio/tree/main/demos/04_realtime_engine/singleflight_gate`
- **Project Description (Copy-Paste)**:
  > **The Challenge**: Wrapping non-thread-safe native C/C++ financial and industrial SDKs in multi-threaded Python servers causes either multi-second RLock convoys or IPC pipe deadlocks during 200-thread traffic spikes.
  >
  > **The Solution**: Built a zero-dependency `Singleflight + Semaphore(3) + Future` request coalescing gateway paired with a Stale-While-Revalidate (SWR) dual-source memory bus:
  > 1. **In-Flight Request Coalescing**: Collapses 200 concurrent identical requests into a single physical SDK call, broadcasting the result to all waiting futures.
  > 2. **4.5μs Non-Blocking SWR Reads**: Main worker threads read in-memory snapshots in 4.5 microseconds without blocking on I/O, while expired keys trigger asynchronous background refreshes.
  > 3. **Dual-Source Timestamp PK**: Automatically arbitrates between local IPC feeds and LAN Redis hashes (`tick:latest`) with a 15s clock-skew guard.
  >
  > **Results & Impact**: Reduced physical C-SDK I/O calls by 99.5% during market open bursts, cutting 200-thread completion time from ~4,000ms down to 98ms with zero IPC crashes.

---

## Card 3: Multi-Channel AI Agent Memory Distillation & Privacy-First Knowledge Ledger
- **Project Title**: `Autonomous Multi-Agent Memory Distillation & Local RAG Knowledge Hub`
- **Role**: `AI Systems Engineer & Automation Architect`
- **Skills Tags**: `Python`, `Large Language Model`, `Artificial Intelligence`, `Automation`, `SQLite`, `API Integration`
- **Project URL**: `https://github.com/cky9/portfolio/tree/main/demos/03_agentic_tools/memory_distiller`
- **Project Description (Copy-Paste)**:
  > **The Challenge**: Engineering teams lose critical debugging insights across fragmented AI coding assistants (IDE JSONL transcripts, CLI SQLite databases, and mobile chat bots), while raw chat synchronization floods knowledge bases with low-signal noise and risks leaking sensitive IPs or credentials.
  >
  > **The Solution**: Designed an autonomous nightly distillation pipeline (`v2.0`) combined with a 24/7 Feishu/Lark × SiYuan local vector hub:
  > 1. **Incremental State Ledger**: Tracks `mtime` and vector chunk counts across IDE, CLI, and IM databases so every conversation is distilled exactly once.
  > 2. **Pre-Flight Regex PII Sanitizer**: Scrubs internal RFC1918 IPs, account identifiers, and financial figures locally before any LLM inference call.
  > 3. **Deterministic Anti-Hallucination Guardrails**: Forces physical file timestamps onto generated runbook cards and applies keyword-based semantic routing across engineering, operations, and domain tracks.
  >
  > **Results & Impact**: Distilled 830+ historical engineering sessions and notes into 110+ structured, searchable runbook cards with zero cloud vector leakage and zero RAM overhead during working hours.

---

## Card 4: Apparel IE — GSD Standard Minute Value (SMV) Line Balancing & Quoting Engine
- **Project Title**: `Apparel IE GSD Line Balancing, SMV Costing & AI Virtual Try-On Suite`
- **Role**: `Industrial Engineering (IE) Automation Lead (Ex-Adidas ME)`
- **Skills Tags**: `Industrial Engineering`, `Python`, `Business Process Automation`, `FastAPI`, `Artificial Intelligence`
- **Project URL**: `https://github.com/cky9/portfolio/tree/main/demos/01_industrial_engineering/gsd_garment_engine`
- **Project Description (Copy-Paste)**:
  > **The Challenge**: Apparel factories and DTC brands struggle with slow manual Tech Pack costing, inaccurate labor quota (SMV) estimation, bottlenecked sewing lines, and high eCommerce return rates on small-batch orders.
  >
  > **The Solution**: Drawing on 15+ years of Manufacturing Excellence (Ex-Adidas ME), engineered an interactive GSD (General Sewing Data) workstation and local AI Virtual Try-On server:
  > 1. **Automated GSD Deconstruction**: Breaks down garment Tech Packs into 37 standard motion codes, computing deterministic TMU/SMV labor times and U-shaped workstation layouts.
  > 2. **Small-Batch Setup Amortization**: Dynamically prices custom orders across Export Spec vs. Fast-Fashion Lean presets.
  > 3. ** Zero-Sensor Ergonomics & Virtual Try-On**: Pairs MediaPipe CPU hand-tracking (`±2%` SMV accuracy via smartphone camera) with a local web virtual fitting room.
  >
  > **Results & Impact**: Slashed garment quoting and line-balancing turnaround from 2 days to under 3 minutes, eliminating shop-floor bottleneck guesswork.

---

## Card 5: Zero-Token 15,000 items/sec ERP BOM Denoising & PB-Scale SQLite Deduplicator
- **Project Title**: `High-Speed ERP BOM Data Cleansing & PB-Scale SQLite Asset Deduplicator`
- **Role**: `Data Pipeline & ETL Architect`
- **Skills Tags**: `Python`, `Data Cleaning`, `Data Extraction`, `ETL Pipeline`, `SQLite`, `Automation`
- **Project URL**: `https://github.com/cky9/portfolio/tree/main/demos/01_industrial_engineering/bom_qc`
- **Project Description (Copy-Paste)**:
  > **The Challenge**: Legacy manufacturing ERPs and multi-terabyte cloud storage drives suffer from chaotic, punctuation-corrupted SKU nomenclature and massive duplicate media files (30%+ redundant exports) that choke disk I/O and rack up huge LLM API bills if cleaned via prompts.
  >
  > **The Solution**: Built two ultra-fast, zero-token local Python data engines:
  > 1. **CPU Levenshtein + Alias Prefix-Tree Normalizer**: Cleanses and maps dirty BOM inventory titles at `>15,000 items/sec` on a single CPU core with zero LLM token cost.
  > 2. **Client SQLite Index Penetration**: Reverse-engineered local cloud-drive SQLite metadata indexes (`385,000+` files / `6.82 TB`) combined with 3-tier hash & EXIF timestamp matching to isolate true incremental delta files without full-disk reads.
  >
  > **Results & Impact**: Compressed a 6.82 TB cloud migration down to 28 GB of true incremental data (>80,000 records/sec throughput) and achieved 99.4% SKU normalization accuracy at $0 API cost.

---

## Card 6: 7×24 Python Daemon Watchdog & Zero-Server HMAC-SHA256 Offline Licensing
- **Project Title**: `Production Python Daemon Watchdog & Zero-Server Offline License Lock`
- **Role**: `Systems & DevOps Engineer`
- **Skills Tags**: `Python`, `Docker`, `Automation`, `API Integration`, `Business Process Automation`
- **Project URL**: `https://github.com/cky9/portfolio/tree/main/demos/03_agentic_tools/offline_license_lock`
- **Project Description (Copy-Paste)**:
  > **The Challenge**: On-premise Python daemons deployed to client machines frequently suffer from multi-gigabyte memory leaks, duplicate process race conditions, and unauthorized redistribution across unlicensed hardware.
  >
  > **The Solution**: Engineered a lightweight production daemon wrapper and zero-server cryptographic licensing toolkit:
  > 1. **Singleton & RSS Self-Healing Watchdog**: Enforces non-blocking `fcntl.flock` singletons, eliminates dynamic module reload leaks (`10.22 GB -> 45 MB`), and triggers graceful restarts if RSS exceeds 800 MB.
  > 2. **Hardware-Bound Offline Licensing**: Extracts OS motherboard UUID fingerprints and validates expiration-bound `HMAC-SHA256` signatures using constant-time digest comparison (`hmac.compare_digest`) with zero cloud server dependencies.
  >
  > **Results & Impact**: Delivered 100% air-gapped license enforcement and 99.99% multi-month daemon uptime across macOS and Linux edge nodes.
