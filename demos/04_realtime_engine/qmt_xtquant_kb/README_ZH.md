# ⚡ QMT / XtQuant 券商级量化交易 SDK 知识工程与实操演练

> **开源项目主页**：🔗 [qmt-xtquant-knowledge-base-v1.0 (Gitee 开源知识库)](https://gitee.com/ckyan3/qmt-xtquant-knowledge-base-v1.0)  
> **商业价值**：迅投官方 XtQuant SDK 文档碎片化、底层 C++ 回调机制易踩坑、AI 生成策略频现幻觉。本项目构建了国内首个专为 AI Agent（RAG-Ready）优化的券商交易 SDK 全景知识库，包含核心模块拆解、实盘异步回调状态机、多因子策略模板与开发脚手架。

---

## 🚀 极速开箱试跑 (Zero Dependency Demo)

无需安装庞大的券商 QMT Windows 客户端，纯原生 Python 即可体验券商级交易器状态机与异步回调事件分发机制：

```bash
python demo_run.py
```

### 验证的核心流程：
1. **XtQuantTrader 初始化与会话鉴权**；
2. **`xtdata` 异步高频行情拉取与 Level-2 盘口解算**；
3. **`xttrader` 异步股票委托报入 (`order_stock_async`)**；
4. **全生命周期事件回调 (`on_order_stock_async` ➔ `on_trade_stock`)**；
5. **前置风控拦截机制 (`on_order_error`)**。

---

## 📚 完整开源知识库全景

如需获取完整的 API 详细手册、双均线/布林带策略模板与 AI 向量检索手册，请直接访问配套开源仓库：
👉 **[https://gitee.com/ckyan3/qmt-xtquant-knowledge-base-v1.0](https://gitee.com/ckyan3/qmt-xtquant-knowledge-base-v1.0)**
