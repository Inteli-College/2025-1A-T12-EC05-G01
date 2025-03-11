from sqlalchemy import Column, Integer, String, Float
from db_conexao import Base, engine
class Medicamento(Base):
    __tablename__ = "medicamento"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String, nullable=False)
    dosagem = Column(String, nullable=False)
    peso = Column(Float, nullable=False)

    def __repr__(self):
        return f"<Medicamento(nome={self.nome}, dosagem={self.dosagem}, peso={self.peso})>"

if __name__ == "__main__":
    Medicamento.__table__.create(bind=engine, checkfirst=True)
    print("Tabela 'medicamento' verificada/criada com sucesso!")
