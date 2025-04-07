from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ...database.db_conexao import Base, engine

class QuantidadeBin(Base):
    __tablename__ = "quantidade_bin"

    id = Column(Integer, primary_key=True, index=True)
    id_medicamento = Column(Integer, ForeignKey("medicamento.id"), nullable=False)
    bin = Column(String, nullable=False)
    quantidade = Column(Integer, nullable=False)

    medicamento = relationship("Medicamento", back_populates="quantidades_bin")


if __name__ == "__main__":
    QuantidadeBin.__table__.create(bind=engine, checkfirst=True)
    print("Tabela 'QuantidadeBin' verificada/criada com sucesso!")