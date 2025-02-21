from dotenv import load_dotenv
import os
from pathlib import Path

# Build the path to the .env file: one directory up from the current file
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


from fastapi import FastAPI
from app.routes import router as transcription_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Clinical Decision Support Backend")

# Restrict CORS to allow only the frontend at localhost:3000.
origins = ["https://fdocpa.onrender.com"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API is running"}

# Include our routes
app.include_router(transcription_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)

