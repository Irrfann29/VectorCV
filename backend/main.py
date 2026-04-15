from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models

# Create the tables in Postgres automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="VectorCV API")

# VERY IMPORTANT: Allow React to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "VectorCV Backend is Online", "system": "FastAPI + PostgreSQL"}