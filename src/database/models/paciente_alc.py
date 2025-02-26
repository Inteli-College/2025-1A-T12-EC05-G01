from sqlalchemy import Column, Integer, String
from database.db_conexao import Base

# Definição do modelo Paciente
class Paciente(Base):
    __tablename__ = "paciente"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    leito = Column(String, nullable=False)
    hc = Column(String, nullable=False)

    def __repr__(self):
        return f"<Paciente(nome={self.nome}, leito={self.leito}, hc={self.hc})>"
