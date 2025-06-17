from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import SessionLocal, Activity
from app.schemas import ActivityCreate
from datetime import datetime, timedelta
from app.database import ManualEntry
from app.schemas import ManualEntryCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/activities/")
def create_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    db_activity = Activity(**activity.dict())
    db.add(db_activity)
    db.commit()
    return {"message": "Atividade registrada com sucesso."}

@router.get("/activities/")
def list_activities(db: Session = Depends(get_db)):
    return db.query(Activity).all()

@router.get("/activities/summary")
def get_daily_summary(date: str = Query(...), db: Session = Depends(get_db)):
    from datetime import datetime

    date_obj = datetime.strptime(date, "%Y-%m-%d")
    start = datetime.combine(date_obj, datetime.min.time())
    end = datetime.combine(date_obj, datetime.max.time())

    records = db.query(Activity).filter(Activity.timestamp >= start, Activity.timestamp <= end).all()

    summary = {}
    for record in records:
        user = record.username
        if user not in summary:
            summary[user] = {
                "username": user,
                "first_seen": record.timestamp,
                "last_seen": record.timestamp,
                "active_seconds": 0,
                "total_seconds": 0
            }
        summary[user]["first_seen"] = min(summary[user]["first_seen"], record.timestamp)
        summary[user]["last_seen"] = max(summary[user]["last_seen"], record.timestamp)
        summary[user]["total_seconds"] += 60
        if record.status == "ativo":
            summary[user]["active_seconds"] += 60

    for user_data in summary.values():
        total = user_data["total_seconds"]
        active = user_data["active_seconds"]
        user_data["active_percent"] = round((active / total) * 100, 1) if total else 0

    return list(summary.values())

@router.post("/manual-entries/")
def create_manual_entry(entry: ManualEntryCreate, db: Session = Depends(get_db)):
    new_entry = ManualEntry(**entry.dict())
    db.add(new_entry)
    db.commit()
    return {"message": "Registro de horas manuais salvo com sucesso."}

@router.get("/manual-entries/")
def list_manual_entries(db: Session = Depends(get_db)):
    return db.query(ManualEntry).all()
