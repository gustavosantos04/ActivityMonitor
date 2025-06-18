from datetime import datetime, timedelta
from jose import JWTError, jwt

# Chave secreta segura (você pode gerar outra usando secrets.token_hex(32))
SECRET_KEY = "f3f1e037e3d84e1997d38e7d44d57a6d9ce44751e5ee14fbc3b1fcdfca456e07"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8  # 8 horas

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
