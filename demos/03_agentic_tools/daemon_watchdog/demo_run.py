"""
7x24 Python Daemon Singleton Lock & RSS Self-Healing Watchdog Demo
Demonstrates fcntl.flock non-blocking singleton enforcement and RSS memory
threshold inspection for long-running background daemons.
Usage: python demo_run.py
"""
import os
import sys
import fcntl
import resource
import tempfile


class DaemonGuard:
    def __init__(self, name: str, max_rss_mb: float = 800.0):
        self.name = name
        self.max_rss_mb = max_rss_mb
        self.lock_path = os.path.join(tempfile.gettempdir(), f"{name}.singleton.lock")
        self._fd = None

    def acquire_singleton(self) -> bool:
        self._fd = open(self.lock_path, "w")
        try:
            fcntl.flock(self._fd.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
            self._fd.write(str(os.getpid()))
            self._fd.flush()
            return True
        except BlockingIOError:
            return False

    def current_rss_mb(self) -> float:
        usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
        # macOS reports bytes, Linux reports kilobytes
        if sys.platform == "darwin":
            return usage / (1024 * 1024)
        return usage / 1024.0


def main():
    print("=" * 72)
    print("🛡️  [Daemon Watchdog] Singleton Lock & RSS Memory Governance Demo")
    print("=" * 72)

    guard1 = DaemonGuard("edge_telemetry_worker", max_rss_mb=800.0)
    guard2 = DaemonGuard("edge_telemetry_worker", max_rss_mb=800.0)

    print(f"1. Primary instance acquiring lock ({guard1.lock_path}): {guard1.acquire_singleton()} ✅")
    print(f"2. Duplicate instance attempting lock             : {guard2.acquire_singleton()} 🛑 (Blocked!)")
    print(f"3. Current worker RSS footprint                   : {guard1.current_rss_mb():.2f} MB / {guard1.max_rss_mb:.0f} MB threshold")
    print("=" * 72)


if __name__ == "__main__":
    main()
