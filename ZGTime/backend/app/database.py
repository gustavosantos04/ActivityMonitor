from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Date, Time
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./monitor.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

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
