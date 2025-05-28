from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import router as api_v1_router
from app.db.database import Base, engine
from app.services.background_tasks import background_manager

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

@app.on_event("startup")
def start_background_tasks():
    background_manager.start(app)

@app.on_event("shutdown")
def stop_background_tasks():
    background_manager.stop()
