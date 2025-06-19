from pydantic import BaseModel
from datetime import datetime, date, time
from pydantic import BaseModel, EmailStr
from typing import Optional

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

class UserCreate(BaseModel):
    full_name: str
    cpf: str
    email: EmailStr
    password: str
    team: str
    is_superuser: bool  # ← novo campo

class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    team: str
    is_superuser: bool

    class Config:
        from_attributes = True  # substitui orm_mode
        
        
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    team: Optional[str] = None
    is_superuser: Optional[bool] = None