from sqlalchemy import Column, Integer, String
from src.database.db_conexao import Base, engine

class Farmaceutico(Base):
    __tablename__ = 'farmaceutico'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String, nullable=False)
    
if __name__ == "__main__":
    Farmaceutico.__table__.create(bind=engine, checkfirst=True)
    print("Tabela 'farmaceutico' verificada/criada com sucesso!")
