# Slot-Based Multi-Horizon Execution State Machine & Snapshot-Diff Order Reconciliation (Redacted Version)

> **Author/Architect**: CK Yan (@cky9)  
> **Version**: v6.0 (Production Grade)  
> **Applicable Scenarios**: High-frequency order execution engines, distributed inventory reservation, multi-timeframe algorithmic state machines, and fail-closed financial reconciliation

---

## I. Architectural Pain Points in Coarse-Grained Execution Ledgers

In traditional event-driven execution systems, tracking an asset or SKU using a single coarse-grained net-exposure counter (`net_diff`) introduces three severe production hazards:
1. **Cross-Horizon State Deadlocks**: A short-term (`5m`) execution signal and a medium-term (`15m`) signal operating on the same asset overwrite each other's target prices and lifecycle timers.
2. **Legacy Order Misbinding ("False Closed-Loop")**: When an execution API call fails or times out without returning an explicit `order_id`, naive fallback logic that queries "the latest filled order for this symbol" can accidentally bind to an order filled hours earlier, tricking the state machine into marking an unexecuted round as `COMPLETED`.
3. **Partial-Fill Exposure Drift**: When an open order only partially fills before expiring or being canceled, rigid lot-size state machines either leave stranded inventory or over-close positions.

---

## II. Two-Layer Container & Slot State Machine Architecture

The v6.0 engine replaces flat counters with a **Two-Layer Container + Horizon Slot State Machine**:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                   Outer Asset Container (Symbol Level)                  │
│  • Global Safety Guard: Base Inventory Floor | Max In-Flight Rounds (2) │
│  • Cross-Horizon Direction Mutex: Forbids simultaneous Long & Short     │
├───────────────────────────────────┬─────────────────────────────────────┤
│     Inner Slot A: 5m Horizon      │      Inner Slot B: 15m Horizon      │
│  • Independent Lifecycle States:  │  • Independent Lifecycle States:    │
│    IDLE -> OPENING -> OPEN_FILLED │    IDLE -> OPENING -> OPEN_FILLED   │
│    -> CLOSING -> COMPLETED        │    -> CLOSING -> COMPLETED          │
│    -> UNBOUND (Fail-Closed Lock)  │    -> UNBOUND (Fail-Closed Lock)    │
└───────────────────────────────────┴─────────────────────────────────────┘
```

### Core Engineering Contracts

1. **Snapshot-Set Diffing for Deterministic Order Binding**:
   - Before dispatching any order, the engine records the exact set of existing counter order IDs `S_before`.
   - After dispatch, it polls `S_after` within a 1.5s window and binds **strictly** to `new_ids = S_after - S_before` matching the exact direction and horizon tag.
   - **Zero-Guessing Redline**: Never bind to historical orders by timestamp proximity.

2. **`UNBOUND` Fail-Closed Circuit Breaker State**:
   - If an order dispatch returns no valid ID and `S_after - S_before` is empty, the slot transitions immediately to `UNBOUND`.
   - An `UNBOUND` slot **consumes full risk quota** (blocking further openings on that symbol) and triggers a high-priority operator alert until reconciled.

3. **Partial-Fill Dynamic Lot Splitting**:
   - If an opening order of `2,000` units partially fills `900` units before cancellation, the slot dynamically shrinks `close_target_vol = 900`.
   - If a closing order partially fills `500` of `900` units, the slot retains `OPEN_FILLED` for the remaining `400` units with a 30-second anti-spam cooldown lock.
