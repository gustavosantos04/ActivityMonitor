from pydantic import BaseModel
from datetime import datetime, date, time

class ActivityCreate(BaseModel):
    username: str
    status: str
    app_name: str
    window_title: str
    timestamp: datetime

# Novo schema para cadastro manual de horas
class ManualEntryCreate(BaseModel):
    username: str
    date: date
    start_time: time
    end_time: time
    description: str

class ManualEntryResponse(ManualEntryCreate):
    id: int

    model_config = {
        "from_attributes": True
    }
