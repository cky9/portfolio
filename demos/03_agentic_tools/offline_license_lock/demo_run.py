"""
Zero-Server HMAC-SHA256 Offline Software Licensing Demo
Demonstrates hardware fingerprinting, offline cryptographic license generation,
expiration enforcement, and anti-tamper verification.
Usage: python demo_run.py
"""
import hmac
import hashlib
import base64
from datetime import datetime


MASTER_SECRET = b"DEMO_ENTERPRISE_PRIVATE_SIGNING_KEY_2026"


def get_mock_machine_code(raw_hw_uuid: str = "550E8400-E29B-41D4-A716-446655440000") -> str:
    digest = hashlib.sha256(raw_hw_uuid.encode("utf-8")).hexdigest().upper()[:16]
    return f"{digest[0:4]}-{digest[4:8]}-{digest[8:12]}-{digest[12:16]}"


def generate_license(machine_code: str, expire_date: str, tier: str = "PRO") -> str:
    payload = f"{machine_code}|{expire_date}|{tier}"
    sig = hmac.new(MASTER_SECRET, payload.encode("utf-8"), hashlib.sha256).hexdigest()[:24].upper()
    token = base64.urlsafe_b64encode(f"{payload}|{sig}".encode("utf-8")).decode("utf-8")
    return token


def verify_license(token: str, current_machine_code: str, today_str: str = None) -> tuple:
    today_str = today_str or datetime.now().strftime("%Y-%m-%d")
    try:
        decoded = base64.urlsafe_b64decode(token.encode("utf-8")).decode("utf-8")
        m_code, exp_date, tier, sig = decoded.split("|")
        expected_payload = f"{m_code}|{exp_date}|{tier}"
        expected_sig = hmac.new(MASTER_SECRET, expected_payload.encode("utf-8"), hashlib.sha256).hexdigest()[:24].upper()
        if not hmac.compare_digest(sig, expected_sig):
            return False, "Invalid cryptographic signature (Tampered license)"
        if m_code != current_machine_code:
            return False, f"Hardware mismatch (Bound to {m_code}, current is {current_machine_code})"
        if today_str > exp_date:
            return False, f"License expired on {exp_date}"
        return True, f"Valid [{tier}] license until {exp_date}"
    except Exception as e:
        return False, f"Malformed license token: {e}"


def main():
    print("=" * 74)
    print("🔐 [Offline License Lock] Zero-Server HMAC-SHA256 Verification Demo")
    print("=" * 74)
    hw_code = get_mock_machine_code()
    print(f"Local Hardware Fingerprint : {hw_code}")

    valid_tok = generate_license(hw_code, "2027-12-31", "ENTERPRISE")
    print(f"Issued License Token       : {valid_tok}")

    ok1, msg1 = verify_license(valid_tok, hw_code, today_str="2026-11-07")
    print(f"1. Normal Verification     : {ok1} -> {msg1}")

    ok2, msg2 = verify_license(valid_tok, "FFFF-0000-1111-2222", today_str="2026-11-07")
    print(f"2. Copied to Another PC    : {ok2} -> {msg2}")

    ok3, msg3 = verify_license(valid_tok, hw_code, today_str="2028-01-02")
    print(f"3. Expired Date Check      : {ok3} -> {msg3}")
    print("=" * 74)


if __name__ == "__main__":
    main()
