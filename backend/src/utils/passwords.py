from pwdlib import PasswordHash

passowrd_hash = PasswordHash.recommended()

def hash_password(password:str):
    return passowrd_hash.hash(password)

def verify_password(password:str, hashed_password:str):
    return passowrd_hash.verify(password, hashed_password)