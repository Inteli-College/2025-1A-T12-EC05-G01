from sqlalchemy import Column, Integer, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from ...database.db_conexao import Base, engine

class PrescricaoOnHold(Base):
    __tablename__ = 'prescricao_on_hold'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_medico = Column(Integer, ForeignKey('medico.id', ondelete='CASCADE'), nullable=False)
    id_paciente = Column(Integer, ForeignKey('paciente.id', ondelete='CASCADE'), nullable=False)
    data_prescricao = Column(DateTime, server_default=func.now())

    paciente = relationship("Paciente")
    prescricoes_aceitas = relationship("PrescricaoAceita", back_populates="prescricao_on_hold")
    prescricoes_medicamentos = relationship("PrescricaoMedicamento", back_populates="prescricao_on_hold")

if __name__ == "__main__":
    PrescricaoOnHold.__table__.create(bind=engine, checkfirst=True)
    print("Tabela 'prescricao_on_hold' verificada/criada com sucesso!")
