"""
Multi-Channel Agentic Session Distillation & Incremental Memory Ledger Demo
Demonstrates local regex PII sanitization, incremental ledger state diffing,
timestamp anti-hallucination locking, and deterministic track routing.
Usage: python demo_run.py
"""
import re


NON_DOMAIN_ENGINEERING_KEYWORDS = ["docker", "launchd", "openwrt", "sqlite", "memory leak", "upwork"]


def sanitize_privacy(raw_text: str) -> str:
    text = re.sub(r"\b(?:192\.168|10\.\d+|172\.(?:1[6-9]|2\d|3[01]))\.\d+\.\d+\b", "<LOCAL_IP>", raw_text)
    text = re.sub(r"\b105\d{5}\b", "<ACCOUNT_ID>", text)
    text = re.sub(r"(\$?\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:USD|RMB|k|w)", "<AMOUNT>", text, flags=re.IGNORECASE)
    return text


def enforce_guardrails(raw_card: str, real_timestamp: str) -> str:
    # 1. Replace hallucinated years (2020-2024) with true session mtime
    fixed = re.sub(r"\(202[0-4]-\d{2}-\d{2}(?:\s+\d{2}:\d{2})?\)", f"({real_timestamp})", raw_card)
    # 2. Enforce semantic track routing
    if "[Domain Discipline]" in fixed and any(k in fixed.lower() for k in NON_DOMAIN_ENGINEERING_KEYWORDS):
        fixed = fixed.replace("[Domain Discipline]", "[System Engineering]")
    return fixed


def main():
    print("=" * 74)
    print("🧠 [Agentic Memory Distiller v2.0] Privacy & Guardrail Verification Demo")
    print("=" * 74)

    raw_dialogue = (
        "User: Server 192.168.6.220 account 10521463 had a Docker memory leak costing 50k RMB.\n"
        "Agent: Fixed by replacing dynamic exec_module with static import and adding 800MB RSS watchdog."
    )
    sanitized = sanitize_privacy(raw_dialogue)
    print("\n1. Pre-Flight Sanitized Payload:")
    print(f"   {sanitized}")

    mock_llm_card = "## 📌 [Domain Discipline] Docker Memory Leak Fix (2023-11-06 02:00)\n- Root Cause: Dynamic module reload."
    guarded_card = enforce_guardrails(mock_llm_card, "2026-11-06 02:00")
    print("\n2. Post-Guardrail Normalized Card (Fixed Hallucinated Year & Misrouted Track):")
    print(f"   {guarded_card}")
    print("=" * 74)


if __name__ == "__main__":
    main()
