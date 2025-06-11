from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./simpleblog.db")

engine = create_engine(
    DATABASE_URL, 
    # connect_args are specific to SQLite. Not needed for other databases.
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """ FastAPI dependency to get a database session. """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """
    Creates all database tables defined by models inheriting from Base.
    This function should ideally be called once at application startup,
    or managed by a migration tool like Alembic for production.
    """
    # Import all modules here that define models so that 
    # they are registered with Base.metadata
    # from . import models # This would cause circular import if models.py imports Base from here
    # It's better to ensure models are imported before calling this in main.py or a script.
    Base.metadata.create_all(bind=engine)
