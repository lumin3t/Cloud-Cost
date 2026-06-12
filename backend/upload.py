from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io

router = APIRouter()

# Temporary in-memory storage
stored_files = {}

@router.post("/upload")
async def upload_files(
    billing: UploadFile = File(...),
    usage_metrics: UploadFile = File(...),
    logs: UploadFile = File(...)
):
    try:
        # Read each file into a pandas dataframe
        stored_files["billing"] = pd.read_csv(io.BytesIO(await billing.read()))
        stored_files["usage_metrics"] = pd.read_csv(io.BytesIO(await usage_metrics.read()))
        stored_files["logs"] = pd.read_csv(io.BytesIO(await logs.read()))

        return {
            "message": "Files uploaded successfully",
            "rows": {
                "billing": len(stored_files["billing"]),
                "usage_metrics": len(stored_files["usage_metrics"]),
                "logs": len(stored_files["logs"])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))