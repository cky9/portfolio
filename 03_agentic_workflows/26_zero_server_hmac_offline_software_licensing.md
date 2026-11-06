# Zero-Server HMAC-SHA256 Offline Software Licensing & Machine Fingerprinting (Redacted Version)

> **Author/Architect**: CK Yan (@cky9)  
> **Version**: v1.2  
> **Applicable Scenarios**: On-premise enterprise tool delivery, air-gapped industrial software licensing, zero-cloud-cost anti-piracy protection

---

## I. Architectural Motivation

When delivering standalone Python/C++ automation suites to external B2B clients or individual subscribers, maintaining an online license verification server introduces recurring cloud costs and fails in air-gapped factory networks. This module implements a **Zero-Server Offline Cryptographic License Lock** using standard library `hmac`, `hashlib`, and hardware UUID binding.

---

## II. Three-Step Verification Workflow

1. **Deterministic Hardware Fingerprint (`Machine Code`)**:
   - Extracts the OS-level hardware UUID (`IOPlatformUUID` on macOS, `csproduct UUID` on Windows, `/etc/machine-id` on Linux) and hashes it into a 16-character human-readable fingerprint (e.g., `A3F9-82C1-09E4-7B2D`).
2. **Offline License Token Issuance**:
   - The developer signs `f"{machine_code}|{expire_yyyy_mm_dd}|{tier}"` using a private master secret via `HMAC-SHA256`, producing a compact offline license string.
3. **Constant-Time Verification (`hmac.compare_digest`)**:
   - At startup, the client recomputes the local hardware fingerprint, validates the expiration date, and verifies the cryptographic signature using `hmac.compare_digest` to prevent timing attacks.
