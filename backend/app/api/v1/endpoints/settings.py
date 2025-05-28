# Settings endpoints
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import crud, database
from app.schemas import settings as settings_schemas

router = APIRouter()

@router.get("/", response_model=settings_schemas.Settings)
def get_settings(db: Session = Depends(database.get_db)):
    """Get current application settings"""
    return crud.get_settings(db)

@router.put("/", response_model=settings_schemas.Settings)
def update_settings(
    settings_update: settings_schemas.SettingsUpdate,
    db: Session = Depends(database.get_db)
):
    """Update application settings"""
    try:
        return crud.update_settings(db, settings_update)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
