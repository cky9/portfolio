"""
QMT / XtQuant Broker Trading SDK & AI Knowledge Base Runner
券商级量化交易 SDK 核心交互与状态机调度模拟 (纯本地零外部依赖演示版)
运行方式: python demo_run.py
开源完整知识库: https://gitee.com/ckyan3/qmt-xtquant-knowledge-base-v1.0
"""
import time
import random

class MockXtData:
    """模拟 xtdata 异步高频行情数据模块"""
    @staticmethod
    def get_full_tick(stock_code):
        base_price = 18.50 if "600000" in stock_code else 32.10
        delta = random.uniform(-0.15, 0.15)
        current_price = round(base_price + delta, 2)
        return {
            "stock_code": stock_code,
            "timetag": time.strftime("%Y%m%d %H:%M:%S"),
            "lastPrice": current_price,
            "open": round(base_price - 0.05, 2),
            "high": round(current_price + 0.20, 2),
            "low": round(current_price - 0.20, 2),
            "volume": random.randint(50000, 120000),
            "amount": random.randint(1500000, 3500000),
            "bidPrice": [round(current_price - 0.01 * i, 2) for i in range(1, 6)],
            "askPrice": [round(current_price + 0.01 * i, 2) for i in range(1, 6)],
        }

class MockXtQuantTrader:
    """模拟 xttrader 核心交易状态机与异步回调"""
    def __init__(self, session_id):
        self.session_id = session_id
        self.connected = False
        self.subscribed = False
        self.order_counter = 1000

    def connect(self):
        time.sleep(0.3)
        self.connected = True
        return 0  # 0 表示连接成功

    def subscribe_quote(self, stock_code):
        time.sleep(0.2)
        self.subscribed = True
        return 0

    def order_stock_async(self, account, stock_code, order_type, order_volume, price_type, price):
        """异步股票下单"""
        self.order_counter += 1
        seq_id = self.order_counter
        
        # 模拟订单校验 (风控拦截与状态机)
        if order_volume <= 0 or order_volume % 100 != 0:
            self.on_order_error(seq_id, "ERR_INVALID_VOLUME: 交易手数必须为 100 整数倍")
            return -1

        # 模拟柜台成功接收并异步返回
        print(f"   📡 [柜台受理] 成功派发异步委托 -> 序号: #{seq_id} | 标的: {stock_code} | 数量: {order_volume}股 | 限价: ¥{price:.2f}")
        time.sleep(0.3)
        self.on_order_stock_async(seq_id, "ORDER_SUBMITTED")
        time.sleep(0.4)
        self.on_trade_stock(seq_id, stock_code, order_volume, price)
        return seq_id

    def on_order_stock_async(self, order_seq, status):
        print(f"   🔔 [异步回调: on_order_stock_async] 委托单 #{order_seq} 状态更新 ➔ {status} (已报入交易所)")

    def on_trade_stock(self, order_seq, stock_code, volume, price):
        trade_amount = volume * price
        print(f"   🎉 [成交回报: on_trade_stock] 委托单 #{order_seq} 全部成交! 成交量: {volume}股 | 均价: ¥{price:.2f} | 发生金额: ¥{trade_amount:,.2f}")

    def on_order_error(self, order_seq, err_msg):
        print(f"   🛑 [风控拦截: on_order_error] 委托单 #{order_seq} 触发安全异常: {err_msg}")

def main():
    print("=" * 75)
    print("⚡ [QMT / XtQuant 交易中台] 启动券商 SDK 核心接口与状态机模拟调度")
    print("📖 关联开源知识库: https://gitee.com/ckyan3/qmt-xtquant-knowledge-base-v1.0")
    print("💡 模式：xtdata 异步行情拉取 + xttrader 订单全生命周期回调 (纯本地免 QMT 客户端演示)")
    print("=" * 75)
    time.sleep(0.4)

    # 1. 初始化交易器与会话
    print("🔌 正在初始化 XtQuantTrader 交易会话 (Session: 20261024)...")
    trader = MockXtQuantTrader(session_id=20261024)
    ret = trader.connect()
    if ret == 0:
        print("✅ 交易服务器建立连接成功！会话鉴权状态: CONNECTED")
    
    # 2. xtdata 行情流订阅
    stock_target = "600000.SH"
    print(f"\n📈 正在通过 xtdata 订阅行情数据流: 【{stock_target}】...")
    tick = MockXtData.get_full_tick(stock_target)
    print(f"   ⏰ 时间戳: {tick['timetag']} | 标的: {tick['stock_code']}")
    print(f"   💰 最新成交价: ¥{tick['lastPrice']:.2f} (今日最高: ¥{tick['high']:.2f}, 最低: ¥{tick['low']:.2f})")
    print(f"   📊 盘口买一: ¥{tick['bidPrice'][0]:.2f} | 卖一: ¥{tick['askPrice'][0]:.2f} | 成交金额: ¥{tick['amount']:,}")

    # 3. 模拟买入决策与异步交易状态机
    print(f"\n🚀 触发策略信号 ➔ 准备执行【买入 (STOCK_BUY = 23)】操作...")
    account_id = "MOCK_ACC_880192"
    buy_price = tick['askPrice'][0]
    buy_vol = 1000

    trader.order_stock_async(
        account=account_id,
        stock_code=stock_target,
        order_type=23,  # xtconstant.STOCK_BUY
        order_volume=buy_vol,
        price_type=11,  # xtconstant.FIX_PRICE
        price=buy_price
    )

    # 4. 模拟风控拦截场景 (非 100 整倍数)
    print(f"\n🛡️  触发风控边界校验 ➔ 尝试提交非合规委托单 (350股)...")
    trader.order_stock_async(
        account=account_id,
        stock_code=stock_target,
        order_type=23,
        order_volume=350,  # 违规非整倍数
        price_type=11,
        price=buy_price
    )

    print("\n" + "=" * 75)
    print("🎉 QMT/XtQuant 核心 SDK 交互与状态机闭环验证完成！")
    print("💡 更多 API 文档、双均线策略模板与 AI RAG 知识检索，请查阅配套开源知识库。")
    print("=" * 75)

if __name__ == "__main__":
    main()
