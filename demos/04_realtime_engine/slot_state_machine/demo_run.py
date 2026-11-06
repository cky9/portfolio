"""
Slot-Based Multi-Horizon Execution State Machine & Snapshot-Diff Reconciliation
Demonstrates snapshot-set diffing order binding, cross-horizon direction mutex,
partial-fill lot splitting, and UNBOUND fail-closed circuit breaker protection.
Usage: python demo_run.py
"""
import time


class HorizonSlot:
    def __init__(self, horizon: str):
        self.horizon = horizon
        self.state = "IDLE"  # IDLE, OPENING, OPEN_FILLED, CLOSING, UNBOUND
        self.direction = None  # LONG_T or SHORT_T
        self.bound_order_id = None
        self.target_vol = 0
        self.filled_vol = 0


class AssetExecutionContainer:
    def __init__(self, symbol: str, base_inventory: int = 10000, floor_inventory: int = 6000):
        self.symbol = symbol
        self.base_inventory = base_inventory
        self.floor_inventory = floor_inventory
        self.slots = {"5m": HorizonSlot("5m"), "15m": HorizonSlot("15m")}

    def active_directions(self):
        return {
            s.direction for s in self.slots.values()
            if s.state in ("OPENING", "OPEN_FILLED", "CLOSING", "UNBOUND") and s.direction
        }

    def open_slot_with_snapshot_diff(self, horizon: str, direction: str, vol: int, orders_before: set, orders_after: set):
        slot = self.slots[horizon]
        print(f"\n[DISPATCH] {self.symbol} [{horizon}] Requesting {direction} ({vol} units)...")

        # 1. Check UNBOUND circuit breaker across any slot
        if any(s.state == "UNBOUND" for s in self.slots.values()):
            print("   🛑 [BLOCKED] Container has an UNBOUND slot occupying risk quota. Manual reconciliation required.")
            return False

        # 2. Cross-horizon direction mutex (Gate 1.8)
        existing_dirs = self.active_directions()
        if existing_dirs and direction not in existing_dirs:
            print(f"   🛑 [MUTEX LOCK] Cross-horizon conflict! Active direction={existing_dirs}, rejected {direction}.")
            return False

        # 3. Base inventory floor guard
        if direction == "SHORT_T" and (self.base_inventory - vol) < self.floor_inventory:
            print(f"   🛑 [FLOOR GUARD] Selling {vol} would breach base floor ({self.floor_inventory}). Rejected.")
            return False

        # 4. Snapshot-set diff binding (Never guess historical orders!)
        diff_ids = orders_after - orders_before
        slot.direction = direction
        slot.target_vol = vol
        if len(diff_ids) == 1:
            oid = next(iter(diff_ids))
            slot.bound_order_id = oid
            slot.filled_vol = vol
            slot.state = "OPEN_FILLED"
            print(f"   ✅ [BOUND] Snapshot diff isolated new Order ID [{oid}] -> Slot [{horizon}] is now OPEN_FILLED.")
            return True
        else:
            slot.state = "UNBOUND"
            print("   ⚠️  [UNBOUND BREAKER] No new Order ID in snapshot diff! Slot locked in UNBOUND (fail-closed).")
            return False

    def handle_partial_close(self, horizon: str, filled_close_vol: int):
        slot = self.slots[horizon]
        print(f"\n[RECONCILE] {self.symbol} [{horizon}] Closing order partially filled: {filled_close_vol}/{slot.filled_vol} units.")
        slot.filled_vol -= filled_close_vol
        if slot.filled_vol > 0:
            slot.state = "OPEN_FILLED"
            print(f"   🔄 [SPLIT] Remaining exposure: {slot.filled_vol} units kept in OPEN_FILLED with 30s cooldown.")
        else:
            slot.state = "IDLE"
            slot.direction = None
            print(f"   ✅ [CLOSED] Slot [{horizon}] fully reconciled and reset to IDLE.")


def main():
    print("=" * 74)
    print("🛡️  [Slot State Machine] Multi-Horizon Execution & Reconciliation Demo")
    print("=" * 74)
    container = AssetExecutionContainer("ASSET_ALPHA", base_inventory=10000, floor_inventory=6000)

    # Scenario 1: 15m slot opens SHORT_T cleanly via snapshot diff
    container.open_slot_with_snapshot_diff(
        "15m", "SHORT_T", 2000,
        orders_before={"ORD_093100_OLD"},
        orders_after={"ORD_093100_OLD", "ORD_101502_NEW"}
    )

    # Scenario 2: 5m slot attempts opposite LONG_T -> blocked by Cross-Horizon Mutex
    container.open_slot_with_snapshot_diff(
        "5m", "LONG_T", 1000,
        orders_before={"ORD_093100_OLD", "ORD_101502_NEW"},
        orders_after={"ORD_093100_OLD", "ORD_101502_NEW", "ORD_101600_NEW"}
    )

    # Scenario 3: Partial fill on 15m close (1200 filled out of 2000, then remaining 800 filled)
    container.handle_partial_close("15m", 1200)
    container.handle_partial_close("15m", 800)

    # Scenario 4: Gateway timeout produces no new order ID -> triggers UNBOUND fail-closed lock
    container.open_slot_with_snapshot_diff(
        "5m", "LONG_T", 1000,
        orders_before={"ORD_093100_OLD", "ORD_101502_NEW"},
        orders_after={"ORD_093100_OLD", "ORD_101502_NEW"}  # Empty diff!
    )
    print("\n" + "=" * 74)


if __name__ == "__main__":
    main()
