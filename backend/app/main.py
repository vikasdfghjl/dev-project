from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import router as api_v1_router
from app.db.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router, prefix="/api/v1")

from app.services.feed_parser import schedule_periodic_refresh

@app.on_event("startup")
def start_periodic_refresh():
    schedule_periodic_refresh(app, interval_seconds=3600)
