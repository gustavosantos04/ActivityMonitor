from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.schemas import ManualEntryCreate

router = APIRouter()

@router.post("/manual-entries/")
def create_manual_entry(entry: ManualEntryCreate, db: Session = Depends(get_db)):
    new_entry = ManualEntry(**entry.dict())
    db.add(new_entry)
    db.commit()
    return {"message": "Registro de horas manuais salvo com sucesso."}

@router.get("/manual-entries/")
def list_manual_entries(db: Session = Depends(get_db)):
    return db.query(ManualEntry).all()
