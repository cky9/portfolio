# Enterprise Split-Tunneling Gateway & 30-Second Anti-Deadlock Watchdog on OpenWrt (Redacted Version)

> **Author/Architect**: CK Yan (@cky9)  
> **Version**: v3.0 (Production Tested on ARM64 MT7981B)  
> **Applicable Scenarios**: Cross-border R&D split-tunneling gateways, low-latency domestic traffic bypass, automated VPN tunnel self-healing

---

## I. Five Production Deadlocks in Router-Level Split Tunneling

Deploying SSL/TLS VPN clients (`OpenConnect`) alongside policy-based routing (`ip rule` + `ipset` + `ChinaDNS-NG`) on embedded ARM64 routers (`OpenWrt / ImmortalWrt`) frequently suffers from five silent failure modes:
1. **Hardware Crypto Offload Crash (`SIGSEGV`)**: Kernel module `kmod-cryptodev` on MediaTek MT7981B corrupts GnuTLS cipher contexts during DTLS handshakes.
2. **Orphaned Reconnect Loop Contention**: BusyBox lacks `pkill`; killing only the `openconnect` child binary leaves the parent `while true` shell alive, spawning competing processes that tear down `tun0` every 15 seconds.
3. **Missing `ipset` Routing Blackhole**: If `iptables -t mangle -A PREROUTING -m set ! --match-set chnroute dst -j MARK --set-mark 200` loads before the `chnroute` ipset is populated in RAM, 100% of LAN traffic is marked `200` and blackholed.
4. **Source-IP Mismatch on Router-Initiated DNS Queries**: Upstream DNS queries from `ChinaDNS-NG` running on the router itself default to the WAN local IP (`192.168.1.x`) when entering `table 200`, causing immediate packet drops inside the VPN tunnel.
5. **QUIC / UDP-443 Congestion over TCP-Mode Tunnels**: Encapsulating YouTube/HTTP3 UDP-443 bursts inside a TCP-fallback tunnel causes severe head-of-line blocking.

---

## II. Deterministic Remediation Architecture

1. **Kernel & Daemon Isolation**:
   - Remove `kmod-cryptodev` to force pure software ARMv8 AES-NI acceleration; manage the tunnel via `procd` (`respawn 3600 5 0`) rather than `netifd` to prevent interface teardown loops.
2. **Explicit Source-IP Binding in Policy Table 200**:
   ```sh
   ipset create chnroute hash:net family inet -exist
   ip route replace default dev tun-vpn src "$INTERNAL_IP4_ADDRESS" table 200
   sysctl -w net.ipv4.conf.all.rp_filter=2
   ```
3. **UDP-443 Graceful HTTP/2 Downgrade**:
   ```sh
   iptables -I FORWARD -o tun-vpn -p udp --dport 443 -j REJECT --reject-with icmp-port-unreachable
   ```
   Forcing browsers to fall back from QUIC (UDP) to Multiplexed TLS/TCP (`HTTP/2`) immediately boosts streaming throughput from `<2 Mbps` to `>80 Mbps`.
