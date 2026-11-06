# 7×24 Python Daemon Memory Governance, Singleton Lock & Self-Healing Watchdog (Redacted Version)

> **Author/Architect**: CK Yan (@cky9)  
> **Version**: v2.0  
> **Applicable Scenarios**: Long-running macOS `launchd` / Linux `systemd` background daemons, Edge AI workers, IDE crash prevention

---

## I. Three Root Causes of Long-Running Python Daemon Failures

1. **Dynamic Module Reload Memory Leaks (`10.22 GB` RSS Blowup)**:
   - Calling `importlib.util.module_from_spec` + `exec_module` inside a 60-second polling loop creates orphaned module objects, class definitions, and global dataframes on every tick that `gc.collect()` cannot reclaim.
2. **Stdout Pipe Buffer Deadlock (IDE Exit `Code 5`)**:
   - Launching background workers with `subprocess.Popen(..., stdout=subprocess.PIPE)` without draining the pipe causes the OS 64KB pipe buffer to fill up, blocking the daemon on `write()` and crashing the parent Electron/IDE process.
3. **Orphaned Multi-Instance Race Conditions**:
   - Manual script restarts alongside `launchd` `KeepAlive` spawn duplicate daemons that overwrite shared Redis keys and double-fire webhooks.

---

## II. Production Defense Contracts

1. **Non-Blocking Exclusive File Lock (`fcntl.flock`)**:
   - Every daemon acquires `fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)` on `~/.daemon_locks/<service>.lock` at startup; duplicate instances exit cleanly with code 0.
2. **RSS Self-Healing Memory Watchdog**:
   - At the end of each worker cycle, the daemon inspects its own RSS via `resource.getrusage`. If RSS exceeds `800 MB`, it flushes state and performs a clean `os._exit(0)`, allowing `launchd` (`KeepAlive=true`) to respawn a fresh 45MB process within 1 second.
