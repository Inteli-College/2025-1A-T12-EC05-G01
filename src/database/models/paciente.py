from sqlalchemy import Column, Integer, String
from src.database.db_conexao import Base, engine

# Definição do modelo Paciente
class Paciente(Base):
    __tablename__ = "paciente"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    leito = Column(String, nullable=False)
    hc = Column(String, nullable=False)

    def __repr__(self):
        return f"<Paciente(nome={self.nome}, leito={self.leito}, hc={self.hc})>"
if __name__ == "__main__":
    Paciente.__table__.create(bind=engine, checkfirst=True)
    print("Tabela 'paciente' verificada/criada com sucesso!")
