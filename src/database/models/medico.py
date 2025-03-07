from sqlalchemy import Column, Integer, String
from db_conexao import Base

class Medico(Base):
    __tablename__ = "medico"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String, nullable=False)
    crm = Column(String, unique=True, nullable=False)

    def __repr__(self):
        return f"<Medico(nome={self.nome}, crm={self.crm})>"
