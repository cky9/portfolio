"""
QMT / XtQuant Broker Trading SDK & AI Knowledge Base Runner
Brokerage-grade quant trading SDK core interaction and state machine simulator (100% local, zero external dependencies).
Usage: python demo_run.py
Full Knowledge Base: https://gitee.com/ckyan3/qmt-xtquant-knowledge-base-v1.0
"""
import time
import random

class MockXtData:
    """Simulates xtdata asynchronous high-frequency market data feed"""
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
    """Simulates xttrader core execution state machine & async callbacks"""
    def __init__(self, session_id):
        self.session_id = session_id
        self.connected = False
        self.subscribed = False
        self.order_counter = 1000

    def connect(self):
        time.sleep(0.3)
        self.connected = True
        return 0  # 0 indicates successful connection

    def subscribe_quote(self, stock_code):
        time.sleep(0.2)
        self.subscribed = True
        return 0

    def order_stock_async(self, account, stock_code, order_type, order_volume, price_type, price):
        """Asynchronous stock order placement"""
        self.order_counter += 1
        seq_id = self.order_counter
        
        # Risk control validation & state machine check
        if order_volume <= 0 or order_volume % 100 != 0:
            self.on_order_error(seq_id, "ERR_INVALID_VOLUME: Lot size must be a multiple of 100 shares")
            return -1

        # Simulate brokerage counter dispatch
        print(f"   📡 [Counter Accepted] Dispatched async order -> Seq: #{seq_id} | Ticker: {stock_code} | Volume: {order_volume} shares | Limit: ${price:.2f}")
        time.sleep(0.3)
        self.on_order_stock_async(seq_id, "ORDER_SUBMITTED")
        time.sleep(0.4)
        self.on_trade_stock(seq_id, stock_code, order_volume, price)
        return seq_id

    def on_order_stock_async(self, order_seq, status):
        print(f"   🔔 [Async Callback: on_order_stock_async] Order #{order_seq} status updated ➔ {status} (Reported to Exchange)")

    def on_trade_stock(self, order_seq, stock_code, volume, price):
        trade_amount = volume * price
        print(f"   🎉 [Execution Fill: on_trade_stock] Order #{order_seq} Fully Filled! Volume: {volume} shares | Avg Price: ${price:.2f} | Turn: ${trade_amount:,.2f}")

    def on_order_error(self, order_seq, err_msg):
        print(f"   🛑 [Risk Control Rejection: on_order_error] Order #{order_seq} triggered risk exception: {err_msg}")

def main():
    print("=" * 75)
    print("⚡ [QMT / XtQuant Broker Trading Hub] Initializing SDK Interface & State Machine Simulation")
    print("📖 Associated Knowledge Base: https://gitee.com/ckyan3/qmt-xtquant-knowledge-base-v1.0")
    print("💡 Mode: xtdata async stream + xttrader lifecycle callbacks (Standalone Zero-Dependency Demo)")
    print("=" * 75)
    time.sleep(0.4)

    # 1. Initialize trader and session
    print("🔌 Initializing XtQuantTrader trading session (Session: 20261024)...")
    trader = MockXtQuantTrader(session_id=20261024)
    ret = trader.connect()
    if ret == 0:
        print("✅ Trading server connected successfully! Session status: CONNECTED")
    
    # 2. xtdata market stream subscription
    stock_target = "600000.SH"
    print(f"\n📈 Subscribing to market stream via xtdata: [{stock_target}]...")
    tick = MockXtData.get_full_tick(stock_target)
    print(f"   ⏰ Timetag: {tick['timetag']} | Ticker: {tick['stock_code']}")
    print(f"   💰 Last Price: ${tick['lastPrice']:.2f} (Day High: ${tick['high']:.2f}, Low: ${tick['low']:.2f})")
    print(f"   📊 Order Book: Bid1: ${tick['bidPrice'][0]:.2f} | Ask1: ${tick['askPrice'][0]:.2f} | Turnover: ${tick['amount']:,}")

    # 3. Simulate buy order decision
    print(f"\n🚀 Strategy Signal Triggered ➔ Executing [BUY (STOCK_BUY = 23)] action...")
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

    # 4. Simulate risk control intercept (invalid lot size: 350 shares)
    print(f"\n🛡️  Triggering Boundary Risk Check ➔ Submitting non-standard order (350 shares)...")
    trader.order_stock_async(
        account=account_id,
        stock_code=stock_target,
        order_type=23,
        order_volume=350,  # Invalid odd-lot volume
        price_type=11,
        price=buy_price
    )

    print("\n" + "=" * 75)
    print("🎉 QMT/XtQuant Core SDK interaction & state machine loop verified!")
    print("💡 For full dual-MA strategy templates and AI RAG knowledge retrieval, refer to the open-source repository.")
    print("=" * 75)

if __name__ == "__main__":
    main()
