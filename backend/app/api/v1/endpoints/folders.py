# Folder endpoints
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.db import crud, models, database
from app.schemas import folder as folder_schemas
import uuid

router = APIRouter()

@router.post("/", response_model=folder_schemas.Folder, status_code=status.HTTP_201_CREATED)
def create_folder(folder: folder_schemas.FolderCreate, db: Session = Depends(database.get_db)):
    # Validate folder name is not empty
    if not folder.name or not folder.name.strip():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Folder name cannot be empty")
    if len(folder.name) > 100:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Folder name too long (max 100 characters)")
    try:
        return crud.create_folder(db, folder)
    except Exception as e:
        if "UNIQUE constraint failed" in str(e):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Folder name already exists")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/", response_model=list[folder_schemas.Folder])
def read_folders(db: Session = Depends(database.get_db)):
    return crud.get_folders(db)

@router.put("/{folder_id}", response_model=folder_schemas.Folder)
def update_folder(folder_id: str, folder: folder_schemas.FolderUpdate, db: Session = Depends(database.get_db)):
    try:
        try:
            folder_key = int(folder_id)
        except ValueError:
            folder_key = uuid.UUID(folder_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid UUID format")
    if not folder.name or not folder.name.strip():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Folder name cannot be empty")
    if len(folder.name) > 100:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Folder name too long (max 100 characters)")
    try:
        updated = crud.update_folder(db, folder_key, folder.name)
    except Exception as e:
        if "UNIQUE constraint failed" in str(e):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Folder name already exists")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    if updated:
        return updated
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")

@router.delete("/{folder_id}")
def delete_folder(folder_id: str, db: Session = Depends(database.get_db)):
    try:
        try:
            folder_key = int(folder_id)
        except ValueError:
            folder_key = uuid.UUID(folder_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid UUID format")
    result = crud.delete_folder(db, folder_key)
    if result.get("ok"):
        return {"message": "Folder deleted successfully"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=result.get("error", "Folder not found"))
