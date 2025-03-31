from sqlalchemy import Column, Integer, String
from ...database.db_conexao import Base, engine

class Farmaceutico(Base):
    __tablename__ = 'farmaceutico'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)

    def __repr__(self):
        return f"<Farmaceutico(nome={self.nome}, email={self.email})>"

    
if __name__ == "__main__":
    Farmaceutico.__table__.create(bind=engine, checkfirst=True)
    print("Tabela 'farmaceutico' verificada/criada com sucesso!")
