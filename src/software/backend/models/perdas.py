from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, func
from ...database.db_conexao import Base, engine

class Perdas(Base):
    __tablename__ = 'perdas'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_estoque = Column(Integer, ForeignKey('estoque.id', ondelete='CASCADE'), nullable=False)
    motivo = Column(String, nullable=False)
    data_perda = Column(DateTime, server_default=func.now())

if __name__ == "__main__":
    Perdas.__table__.create(bind=engine, checkfirst=True)
    print("Tabela 'perdas' verificada/criada com sucesso!")
