import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Define the path to the SQLite database
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get the directory of this script
DATABASE_PATH = os.path.join(BASE_DIR, "database.db")  # Ensure it points to the correct file
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"  # SQLite connection string

# Create the SQLite database engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()

# Function to get a database session (for dependency injection in frameworks like FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
