from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..db_conexao import Base, engine

class Estoque(Base):
    __tablename__ = "estoque"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_medicamento = Column(Integer, ForeignKey("medicamento.id"), nullable=False)
    lote = Column(String, nullable=False)
    quantidade = Column(Integer, nullable=False)
    validade = Column(String, nullable=False)
    bin = Column(Integer, nullable=False)
    fornecedor = Column(String, nullable=False)

    medicamento = relationship("Medicamento", backref="estoques")

    def __repr__(self):
        return f"<Estoque(id_medicamento={self.id_medicamento}, lote={self.lote}, quantidade={self.quantidade})>"

if __name__ == "__main__":
    Estoque.__table__.create(bind=engine, checkfirst=True)
    print("Tabela 'estoque' verificada/criada com sucesso!")
