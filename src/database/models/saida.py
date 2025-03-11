from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from db_conexao import Base, engine

class Saidas(Base):
    __tablename__ = 'saidas'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_estoque = Column(Integer, ForeignKey('estoque.id', ondelete='CASCADE'), nullable=False)
    id_paciente = Column(Integer, ForeignKey('paciente.id', ondelete='CASCADE'), nullable=False)
    quantidade = Column(Integer, nullable=False)
    data_saida = Column(DateTime, server_default=func.now())

if __name__ == "__main__":
    Saidas.__table__.create(bind=engine, checkfirst=True)
    print("Tabela 'saidas' verificada/criada com sucesso!")