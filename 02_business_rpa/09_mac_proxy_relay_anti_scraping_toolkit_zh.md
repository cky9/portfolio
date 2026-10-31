# MAC 代理中继与自动化反爬虫工具箱（脱敏版）

> **作者/网络架构师**：DevOps & Security Engineering Team  
> **核心技术**：MAC 动态代理中继 · 请求头伪装 · \fanyi721 多语言文本洗数据 · 旧数据增量落盘

---

## 一、 项目背景与设计目标

在金融数据抓取与自动化情报收集场景中，频发网络限制与目标源的防封禁拦截。本项目构建了一套 **“MAC 代理网络中继 + \fanyi721 自动化文本处理 + 旧数据增量落盘”** 的轻量高可用工具链。

```mermaid
graph TD
    subgraph 1. 网络代理与抓取层 (MAC Proxy Layer)
        Client[数据抓取客户端 / OpenClaw] --> Proxy[MAC 代理 & 动态 IP 轮换中继]
        Proxy -->|请求头伪装 & 限流避让| Target[外部金融情报源 / 问财选股]
    end

    subgraph 2. 文本清洗与翻译层 (\fanyi721 Pipeline)
        Target --> RawData[原始情报 / 多语言数据]
        RawData --> Fanyi[\fanyi721 自动化清洗与多语种翻译引擎]
        Fanyi --> Cleaned[标准化中文文本 / Markdown]
    end

    subgraph 3. 持久化落盘层 (Archiving Layer)
        Cleaned --> Saver[旧数据切片与增量落盘引擎]
        Saver --> Disk[(MySQL / 本地文件历史归档)]
    end
```

---

## 二、 核心技术亮点

### 1. MAC 代理中继与请求头伪装 (Proxy Relay & Anti-Scraping)
- **动态代理切换**：配置 MAC 代理及 SOCKS5/HTTP 中继，支持一键在终端与后台服务间切换代理链路。
- **频次管控与随机防封**：模拟真实浏览器行为，动态注入 User-Agent、Cookie 与 Referer 标头，规避高频爬取被封禁风险。

### 2. \fanyi721 多语言文本洗数据管道 (\fanyi721 Processing Pipeline)
- **多语种实时转换**：集成了 `\fanyi721` 自动清洗与翻译中继，将全球宏观新闻与多语种资讯实时清洗并转译为格式统一的中文摘要。
- **正则噪声过滤**：自动剔除 HTML 杂质、广告推介与冗余字符，输出高可读性结构化数据。

### 3. 旧数据增量落盘与历史存档 (Old Data Archiving)
- **增量切片落盘**：设计按时间戳与 Hash 指纹排重的增量落盘算法，确保旧数据与历史行情全量保存，杜绝大批量数据丢失风险。

---

## 三、 脚本与部署示意

```bash
#!/usr/bin/env bash
# 脱敏示例：MAC 代理与 \fanyi721 快速初始化与状态检查

echo "🌐 正在配置 MAC 代理中继网络..."
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"

echo "✅ 代理链路激活成功，启动 \fanyi721 数据清洗管道..."
python3 -m fanyi721_runner --input ./raw_data --output ./clean_data --archive-db
```

---

*(注：本工具箱文档已执行全局 IP、代理端口与密钥凭据脱敏处理)*
