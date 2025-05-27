# Folder endpoints
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.db import crud, models, database
from app.schemas import folder as folder_schemas

router = APIRouter()

@router.post("/", response_model=folder_schemas.Folder)
def create_folder(folder: folder_schemas.FolderCreate, db: Session = Depends(database.get_db)):
    try:
        return crud.create_folder(db, folder)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/", response_model=list[folder_schemas.Folder])
def read_folders(db: Session = Depends(database.get_db)):
    return crud.get_folders(db)

@router.put("/{folder_id}", response_model=folder_schemas.Folder)
def update_folder(folder_id: int, folder: folder_schemas.FolderCreate, db: Session = Depends(database.get_db)):
    updated = crud.update_folder(db, folder_id, folder)
    if updated:
        return updated
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Folder not found")

@router.delete("/{folder_id}")
def delete_folder(folder_id: int, db: Session = Depends(database.get_db)):
    result = crud.delete_folder(db, folder_id)
    if result.get("ok"):
        return {"detail": "Folder deleted"}
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=result.get("error", "Folder not found"))
