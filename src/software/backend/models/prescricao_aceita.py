from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from ...database.db_conexao import Base, engine

class PrescricaoAceita(Base):
    __tablename__ = 'prescricao_aceita'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_prescricao_on_hold = Column(Integer, ForeignKey('prescricao_on_hold.id', ondelete='CASCADE'), nullable=False)
    id_farmaceutico = Column(Integer, ForeignKey('farmaceutico.id', ondelete='CASCADE'), nullable=False)
    data_validacao = Column(DateTime, server_default=func.now())

if __name__ == "__main__":
    PrescricaoAceita.__table__.create(bind=engine, checkfirst=True)
    print("Tabela 'prescricao_aceita' verificada/criada com sucesso!")
