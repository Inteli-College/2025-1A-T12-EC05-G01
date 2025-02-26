from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# PostgreSQL Connection URL
DB_USER = "your_username"
DB_PASSWORD = "your_password"
DB_HOST = "localhost"  # Change this if using a remote server
DB_PORT = "5432"
DB_NAME = "your_database"

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create engine for PostgreSQL
engine = create_engine(DATABASE_URL)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()
