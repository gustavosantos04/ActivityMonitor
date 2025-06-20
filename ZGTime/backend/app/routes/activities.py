from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime
from app.dependencies import get_db
from app.schemas import ActivityCreate
from app.database import Activity

router = APIRouter()

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
