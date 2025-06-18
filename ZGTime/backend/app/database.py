from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Date, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
from sqlalchemy import Boolean  # no topo do arquivo, se ainda não estiver importado
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DATABASE_URL = "sqlite:///./monitor.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    cpf = Column(String, unique=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    team = Column(String)
    is_active = Column(Integer, default=1)  # ou Boolean
    is_superuser = Column(Integer, default=0)  # ou Boolean

    def verify_password(self, password: str):
        return pwd_context.verify(password, self.hashed_password)

    def set_password(self, password: str):
        self.hashed_password = pwd_context.hash(password)

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    status = Column(String)
    app_name = Column(String)
    window_title = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

def create_tables():
    Base.metadata.create_all(bind=engine)

class ManualEntry(Base):
    __tablename__ = "manual_entries"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    date = Column(Date)
    start_time = Column(Time)
    end_time = Column(Time)
    description = Column(Text)

