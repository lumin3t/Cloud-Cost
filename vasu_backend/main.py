from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from upload import router as upload_router, stored_files
from detection import run_detection
from agent import run_agent

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)

@app.get("/")
def root():
    return {"message": "CloudLens AI backend is running"}

@app.post("/detect")
def detect():
    if not stored_files:
        return {"error": "No files uploaded yet"}
    findings = run_detection(stored_files)
    return {"findings": findings}

@app.post("/ask")
def ask(payload: dict):
    if not stored_files:
        return {"error": "No files uploaded yet"}
    question = payload.get("question", "Analyze my cloud data and explain all cost leaks and errors")
    answer = run_agent(stored_files, question)
    return {"answer": answer}