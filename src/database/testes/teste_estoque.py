import pytest
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import sessionmaker
from database.models.estoque import Estoque
from database.db_conexao import Base

# Mock atualizado do Medicamento com novos campos
class Medicamento(Base):
    __tablename__ = "medicamento"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(50), nullable=False)
    dosagem = Column(String(20), nullable=False)
    peso = Column(Float, nullable=False)
    qr_code = Column(String(50), unique=False)

@pytest.fixture(scope="module")
def test_engine():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)

@pytest.fixture
def db_session(test_engine):
    Session = sessionmaker(bind=test_engine)
    session = Session()
    yield session
    session.rollback()
    session.close()

def test_criacao_registro_estoque(db_session):
    # Cria medicamento com todos os campos obrigatórios
    med = Medicamento(
        nome="Paracetamol",
        dosagem="500mg",
        peso=0.5,
        qr_code="QR123"
    )
    db_session.add(med)
    db_session.commit()
    
    novo_item = Estoque(
        id_medicamento=med.id,
        lote="LOTE-001",
        quantidade=100,
        validade="2025-12-31",
        bin=15,
        fornecedor="Farmacorp"
    )
    
    db_session.add(novo_item)
    db_session.commit()
    
    registro = db_session.query(Estoque).first()
    assert registro.medicamento.nome == "Paracetamol"  # Testa o relacionamento
    assert registro.quantidade == 100

def test_validacao_campos_obrigatorios(db_session):
    with pytest.raises(Exception):
        item_incompleto = Estoque(lote="LOTE-002")
        db_session.add(item_incompleto)
        db_session.commit()

def test_relacionamento_medicamento(db_session):
    med = Medicamento(
        nome="Ibuprofeno",
        dosagem="400mg",
        peso=0.4,
        qr_code="QR456"
    )
    db_session.add(med)
    db_session.commit()
    
    item = Estoque(
        id_medicamento=med.id,
        lote="LOTE-003",
        quantidade=50,
        validade="2024-06-30",
        bin=20,
        fornecedor="MedLab"
    )
    
    db_session.add(item)
    db_session.commit()
    
    result = db_session.query(Estoque).join(Medicamento).filter(
        Medicamento.nome == "Ibuprofeno"
    ).first()
    
    assert result is not None
