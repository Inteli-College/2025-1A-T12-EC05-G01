from sqlalchemy import CheckConstraint, Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from ...database.db_conexao import Base, engine

class PrescricaoMedicamento(Base):
    __tablename__ = 'prescricao_medicamento'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    id_prescricao_on_hold = Column(Integer, ForeignKey('prescricao_on_hold.id', ondelete='CASCADE'), nullable=False)
    id_prescricao_aceita = Column(Integer, ForeignKey('prescricao_aceita.id', ondelete='SET NULL'), nullable=True)
    id_medicamento = Column(Integer, ForeignKey('medicamento.id', ondelete='CASCADE'), nullable=False)
    quantidade = Column(Integer, nullable=False)
    status_medicamento = Column(String, CheckConstraint("status_medicamento IN ('dispensado', 'aprovado', 'pendente')"), nullable=False, default="pendente")

    prescricao_aceita = relationship("PrescricaoAceita", back_populates="prescricoes_medicamentos")
    prescricao_on_hold = relationship("PrescricaoOnHold", back_populates="prescricoes_medicamentos")
    medicamento = relationship("Medicamento")

if __name__ == "__main__":
    PrescricaoMedicamento.__table__.create(bind=engine, checkfirst=True)
    print("Tabela 'prescricao_medicamento' verificada/criada com sucesso!")
