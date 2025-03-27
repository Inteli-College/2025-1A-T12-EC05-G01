from sqlalchemy import CheckConstraint, Column, Integer, ForeignKey, String, DateTime, func
from sqlalchemy.orm import relationship
from ...database.db_conexao import Base, engine

class PrescricaoAceita(Base):
    __tablename__ = 'prescricao_aceita'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_prescricao_on_hold = Column(Integer, ForeignKey('prescricao_on_hold.id', ondelete='CASCADE'), nullable=False)
    id_farmaceutico = Column(Integer, ForeignKey('farmaceutico.id', ondelete='CASCADE'), nullable=False)
    data_validacao = Column(DateTime, server_default=func.now())
    status_prescricao = Column(String, CheckConstraint("status_prescricao IN ('aguardando_separacao', 'selada', 'erro_separacao', 'aguardando_selagem')"), nullable=False, default="aguardando_separacao")

    prescricao_on_hold = relationship("PrescricaoOnHold", back_populates="prescricoes_aceitas")
    prescricoes_medicamentos = relationship("PrescricaoMedicamento", back_populates="prescricao_aceita")
    
if __name__ == "__main__":
    PrescricaoAceita.__table__.create(bind=engine, checkfirst=True)
    print("Tabela 'prescricao_aceita' verificada/criada com sucesso!")
