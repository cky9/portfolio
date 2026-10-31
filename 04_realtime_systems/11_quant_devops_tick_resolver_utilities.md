> **[ 🌐 English Version | 🇨🇳 [中文文档 (Chinese Version)](./11_quant_devops_tick_resolver_utilities_zh.md) ]**

# Y3TRADE Quantitative Automated Operations & Utility Toolkit Collection (Sanitized Edition)

> **Author/Quant Engineering Team**: QuantDev & Automated Trading Ops Team  
> **Core Tools**: PTrade UI Self-Healing Monitor · Secure SQL Query Bridge · Physical Audio-Visual Alarm Alert · Real-Time Tick Code Resolver

---

## I. Toolkit Collection Overview

In the actual intraday operation of a quantitative trading system, beyond the core strategy and risk control engines, a series of high-availability, non-invasive automated operations support tools are also required to ensure stable 7x24 operation of the system.

This project has sanitized, organized, and integrated the **four practical automation tools** of the Y3TRADE system:

```mermaid
graph TD
    subgraph 1. 交易客户端自愈与监控
        PTrade_Mon[PTrade 自动化监控与自愈脚手架] -->|掉线检测 & 界面自动重连| Client[(PTrade 交易终端)]
    end

    subgraph 2. 数据查询与 SQL 安全桥接
        SQL_Runner[安全 SQL 执行脚本 db_query_safe] -->|文件化 SQL 参数注入防护| MySQL[(MySQL 历史数据库)]
    end

    subgraph 3. 动态盯盘与物理风控警报
        Watchdog[动态盯盘哨兵 & 策略信号] -->|静默写入| Alarm[物理系统闹钟 & 三色声光警报]
    end

    subgraph 4. 全市场行情映射
        Resolver[Tick 权威代码解析器] -->|Redis tick:latest 映射| Redis[(Redis 内存库)]
    end
```

---

## II. Core Utility Code and Technical Highlights

### 1. PTrade Trading Client Self-Healing Scaffold (`ptrade_self_healing.py`)
- **Function**: Automatically detects the PTrade client process and UI control states. When disconnection, restart, or modal dialog blocking occurs, it automatically performs simulated recovery and strategy re-mounting.
- **False-Death Prevention**: Establishes a secondary strong verification logic for the "restarting" and "normal monitoring" states, preventing strategies from being missed due to state misreporting.

### 2. Secure SQL Execution and Data Validation Bridge (`db_query_safe.py`)
- **Standardized Execution**: Enforces writing to `.sql` files to avoid command-line concatenation injection vulnerabilities; uniformly sets `PYTHONIOENCODING=utf-8`.
- **Automated Result Parsing**: Automatically converts SQL result sets into Pandas DataFrames or JSON structures for consumption by upper-layer strategies.

```python
# 脱敏示意：安全 SQL 执行脚本调用
import subprocess
import json

def run_safe_sql(sql_file_path):
    """
    通过安全的脚本桥接器执行文件化 SQL
    """
    cmd = ["python3", "scripts/db_query_safe.py", "-f", sql_file_path]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return json.loads(res.stdout)
```

### 3. Physical Audio-Visual Alarm and Dynamic Watchdog Sentinel (`alarm_watchdog.py`)
- **Strong Audio-Visual Alert**: When grid trading triggers a stop-loss or over-position alert, the system automatically invokes the local system-level alarm API (such as `add_windows_alarm.py` or macOS `osascript` notification), achieving hard error prevention and geek-style physical alerts.

### 4. 49,000+ Real-Time Market Tick Code Resolver (`tick_resolver.py`)
- **Authoritative Code Conversion**: Based on the Redis `tick:latest` in-memory cache, completes bidirectional forward/reverse resolution between stock names and Standard Codes (e.g., `600519.SH`) at millisecond latency, eliminating the risk of erroneous trades caused by inferring codes from memory.

---

## III. Engineering Value

These lightweight utilities smooth out the micro-friction in trading operations, forming a full-chain zero-failure defense line spanning **trading UI mounting, secure SQL querying, physical audio-visual error prevention, and code resolution**.

*(Note: This utility collection document has been fully sanitized of business names, specific account and environment credentials)*
