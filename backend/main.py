# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import boto3
from botocore.exceptions import ClientError, NoCredentialsError

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # can list your origin for example: http://localhost:4201
    allow_methods=["*"],
    allow_headers=["*"],
)

s3 = boto3.client(
    "s3",
    endpoint_url="<your s3 endpoint>", # for example http://192.168.101.100
    aws_access_key_id="<access_key>",
    aws_secret_access_key="<secret_key>>",
    region_name="<region>",  # example: us-east-1
)

@app.get("/buckets")
def list_buckets():
    result = s3.list_buckets()
    return {"buckets": [b["Name"] for b in result["Buckets"]]}

@app.get("/objects/{bucket_name}")
def list_objects(bucket_name: str):
    result = s3.list_objects_v2(Bucket=bucket_name)
    return {"objects": result.get("Contents", [])}

class AuthRequest(BaseModel):
    access_key: str
    secret_key: str
    endpoint: str = "<your s3 endpoint>" 

@app.post("/auth")
def authenticate_user(auth: AuthRequest):
    try:
        s3 = boto3.client(
            "s3",
            aws_access_key_id=auth.access_key,
            aws_secret_access_key=auth.secret_key,
            endpoint_url=auth.endpoint,
        )

        # Attempt a harmless operation to validate credentials
        s3.list_buckets()

        return {"authenticated": True}

    except NoCredentialsError:
        raise HTTPException(status_code=401, detail="Missing credentials")

    except ClientError as e:
        return {
            "authenticated": False,
            "error": str(e.response.get("Error", {}).get("Message", "Invalid credentials"))
        }

    except Exception as e:
        return {"authenticated": False, "error": str(e)}