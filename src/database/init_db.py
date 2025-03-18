from db_conexao import engine, Base
from paciente import Paciente  # Import all models here

# Create tables in the SQLite database
def initialize_database():
    Base.metadata.create_all(bind=engine)
    print("SQLite database initialized successfully!")

if __name__ == "__main__":
    initialize_database()
