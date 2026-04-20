import os
from sqlalchemy import create_engine, Column, String, Float, Integer, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import JSON

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./vrp.db")
USE_DATABASE = os.getenv("USE_DATABASE", "false").lower() == "true"

# Create engine
if DATABASE_URL.startswith("postgresql"):
    engine = create_engine(DATABASE_URL)
else:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Database Models
class PatientDB(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    visit_time = Column(String, nullable=False)
    time_window_minutes = Column(Integer, default=30)
    gender_preference = Column(String, default="any")


class PhlebotomistDB(Base):
    __tablename__ = "phlebotomists"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    gender = Column(String, nullable=False)
    max_visits = Column(Integer, default=5)
    available = Column(Boolean, default=True)


# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
