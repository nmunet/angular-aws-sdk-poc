# Backend: FastAPI with AWS S3 Integration

This project provides a FastAPI backend that integrates with AWS S3 (or a compatible S3 service like MinIO, Ceph S3). It includes endpoints for:

- Authenticating AWS credentials.
- Listing S3 buckets.
- Listing objects in specific S3 buckets.

## Setup

### Prerequisites

1. Python 3.8 or later
2. Virtualenv (optional, recommended)

### Installation Steps

1. **Clone the repository**:

2. **Set up the virtual environment:**
   > cd backend

3. **Set up the virtual environment:**
   > python3 -m venv venv

4. **Activate the virtual environment:**
   > source venv/bin/activate

5. **Install the dependencies:**
   > pip install -r requirements.txt

6. **Set up your environment variables:**
   Make sure to set your AWS S3 credentials and endpoint in the code
   ```
   s3 = boto3.client(
        "s3",
        endpoint_url="<your_s3_endpoint>",  # Replace with your S3 endpoint (e.g., Ceph, MinIO)
        aws_access_key_id="<your_access_key>",
        aws_secret_access_key="<your_secret_key>",
        region_name="<your_region>"
   )

7. **Run the FastAPI app:**
   > uvicorn main:app --reload

This will run the FastAPI server at http://localhost:8000.

# Frontend: Angular App for AWS S3 Interaction via FastAPI

This project is an Angular-based frontend application designed to interact with a FastAPI backend that connects to an AWS S3-compatible service. The app allows users to:

Enter AWS S3 accessKeyId, secretAccessKey.  
View available S3 buckets.  
View objects inside a selected bucket.

## Setup

### Prerequisites

1. Node.js (v18+ recommended)
2. Angular CLI (npm install -g @angular/cli)
3. A running instance of the FastAPI backend (see backend setup)

### Installation Steps
1. **Install Dependencies:**
   > cd frontend  
   > npm install

2. **Run the Angular Application:**
   Start the Angular development server:
   > ng serve

The Angular app will run at http://localhost:4200.

