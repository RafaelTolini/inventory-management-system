from __future__ import annotations

import hashlib


DEFAULT_ADMIN_USERNAME = "admin"
DEFAULT_ADMIN_PASSWORD = "admin"


def hash_password(raw_password: str) -> str:
    # Minimal hashing to avoid storing plain text; not for production use.
    return hashlib.sha256(raw_password.encode("utf-8")).hexdigest()


def verify_password(raw_password: str, hashed_password: str) -> bool:
    return hash_password(raw_password) == hashed_password
