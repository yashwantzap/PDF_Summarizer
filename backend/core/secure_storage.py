import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# Load key from env or config file
AES_KEY = os.environ.get("AES_KEY", None)
if AES_KEY is None:
    # For prototype/dev only! In prod, load securely:
    AES_KEY = os.urandom(32)
else:
    AES_KEY = AES_KEY.encode() if isinstance(AES_KEY, str) else AES_KEY

def encrypt_bytes(data: bytes) -> bytes:
    aesgcm = AESGCM(AES_KEY)
    nonce = os.urandom(12)
    enc = aesgcm.encrypt(nonce, data, None)
    return nonce + enc

def decrypt_bytes(enc_data: bytes) -> bytes:
    aesgcm = AESGCM(AES_KEY)
    nonce = enc_data[:12]
    ct = enc_data[12:]
    return aesgcm.decrypt(nonce, ct, None)
