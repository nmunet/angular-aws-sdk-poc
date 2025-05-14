from fastapi import FastAPI, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import Optional, Dict
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
import boto3
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Demo in-memory session store: maps user ARN -> AWS credentials
session_store: Dict[str, dict] = {}

# Secret for JWT
SECRET_KEY = "very-secret-key"
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 30

# -------------------------------
# Models
# -------------------------------

class AWSCredentials(BaseModel):
    access_key: str
    secret_key: str
    session_token: Optional[str] = None
    endpoint_url: Optional[str] = None  # Add custom endpoint support

# -------------------------------
# Auth functions
# -------------------------------

def create_jwt_token(arn: str):
    expire = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    return jwt.encode({"sub": arn, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Header(..., alias="Authorization")) -> str:
    try:
        token = token.replace("Bearer ", "")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid or expired token")

def get_session_for_user(arn: str):
    creds = session_store.get(arn)
    if not creds:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    return boto3.Session(
        aws_access_key_id=creds["access_key"],
        aws_secret_access_key=creds["secret_key"],
        aws_session_token=creds.get("session_token")
    ), creds.get("endpoint_url")

# -------------------------------
# Routes
# -------------------------------

@app.post("/login")
def login(creds: AWSCredentials):
    try:
        arn = f"arn:ceph:s3::{creds.access_key}"

        session_store[arn] = {
            "access_key": creds.access_key,
            "secret_key": creds.secret_key,
            "session_token": creds.session_token,
            "endpoint_url": creds.endpoint_url
        }

        token = create_jwt_token(arn)
        return {"token": token, "arn": arn}

    except Exception as e:
        raise HTTPException(status_code=403, detail=f"Invalid AWS credentials: {str(e)}")

@app.post("/logout")
def logout(user_arn: str = Depends(get_current_user)):
    if user_arn in session_store:
        del session_store[user_arn]
        return {"message": "Logged out successfully"}
    else:
        raise HTTPException(status_code=404, detail="Session not found")

@app.get("/buckets")
def list_buckets(user_arn: str = Depends(get_current_user)):
    session, endpoint = get_session_for_user(user_arn)
    try:
        s3 = session.client("s3", endpoint_url=endpoint) if endpoint else session.client("s3")
        response = s3.list_buckets()
        return [b["Name"] for b in response.get("Buckets", [])]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
