# Singleflight C-SDK Concurrency Gate & Sub-5μs Lock-Free Dual-Source Snapshot Bus (Redacted Version)

> **Author/Architect**: CK Yan (@cky9)  
> **Version**: v2.2 (Production Validated)  
> **Applicable Scenarios**: High-concurrency wrapper for non-thread-safe C/C++ SDKs, cache stampede prevention, sub-microsecond real-time quote buses

---

## I. The Concurrency Bottleneck of Native C-API SDKs

Many industrial and financial native SDKs wrap legacy single-threaded IPC channels without internal request multiplexing. When 20+ worker threads simultaneously request market snapshots or historical bars during a traffic spike:
- Naive global `threading.RLock()` serializes callers into a multi-second convoy;
- Unbounded concurrent calls overwhelm the underlying C-API IPC pipe, causing silent deadlocks.

---

## II. Three-Layer Zero-Blocking Architecture

1. **`Singleflight` Request Coalescing + `Semaphore(3)` Gate**:
   - Identical concurrent requests `(symbol, period, count)` are coalesced in-flight using an atomic registry of `concurrent.futures.Future` objects.
   - Only **1 physical SDK call** is executed for 200 simultaneous identical requests; the remaining 199 callers await the shared `Future` and receive the result in `0.02s`.
   - Distinct physical calls are bounded by `threading.Semaphore(3)` to prevent IPC pipe saturation.

2. **Sub-5μs Stale-While-Revalidate Snapshot Bus**:
   - The main execution loop never blocks on network/IPC I/O. When a local memory cache entry expires (`TTL > 2.0s`), the reader immediately returns the last known snapshot in `4.5μs` and dispatches a non-blocking background refresh task.

3. **Dual-Source Millisecond Timestamp PK & Clock-Skew Guard**:
   - Compares millisecond timestamps between primary local IPC feeds and secondary LAN Redis hashes (`tick:latest`), automatically selecting the fresher source while enforcing a `15,000ms` clock-skew sanity guard.
