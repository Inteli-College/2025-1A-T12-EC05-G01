import pytest
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import sessionmaker
from database.models.estoque import Estoque
from database.db_conexao import Base
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Mock do Medicamento
class Medicamento(Base):
    __tablename__ = "medicamento"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(50), nullable=False)
    dosagem = Column(String(20), nullable=False)
    peso = Column(Float, nullable=False)
    qr_code = Column(String(50), unique=False)

    def __repr__(self):
        return f"<Medicamento(nome={self.nome}, dosagem={self.dosagem})>"

@pytest.fixture(scope="module")
def test_engine():
    logger.info("\n\n--- Inicializando banco de dados em memória ---")
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    yield engine
    logger.info("\n--- Limpando banco de dados após testes ---")
    Base.metadata.drop_all(engine)

@pytest.fixture
def db_session(test_engine):
    Session = sessionmaker(bind=test_engine)
    session = Session()
    logger.info("\n--- Iniciando nova sessão de banco de dados ---")
    yield session
    session.rollback()
    session.close()
    logger.info("--- Sessão de banco encerrada ---")

def test_criacao_registro_estoque(db_session):
    logger.info("\n=== TESTE 1: Criação de registro no estoque ===")
    
    logger.info("Criando medicamento Paracetamol...")
    med = Medicamento(
        nome="Paracetamol",
        dosagem="500mg",
        peso=0.5,
        qr_code="QR123"
    )
    
    db_session.add(med)
    db_session.commit()
    logger.info("Medicamento cadastrado com ID: %s", med.id)
    
    logger.info("Criando item de estoque...")
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
    logger.info("Item de estoque registrado com ID: %s", novo_item.id)
    
    logger.info("Verificando registro no banco...")
    registro = db_session.query(Estoque).first()
    
    logger.info("Validando dados do medicamento relacionado...")
    assert registro.medicamento.nome == "Paracetamol", "Nome do medicamento incorreto"
    assert registro.quantidade == 100, "Quantidade incorreta"
    logger.info("✓ Todos os dados validados com sucesso!")

def test_validacao_campos_obrigatorios(db_session):
    logger.info("\n=== TESTE 2: Validação de campos obrigatórios ===")
    logger.info("Testando criação de registro incompleto...")
    
    try:
        with pytest.raises(Exception) as exc_info:
            logger.warning("Tentando criar registro sem campos obrigatórios...")
            item_incompleto = Estoque(lote="LOTE-002")
            db_session.add(item_incompleto)
            db_session.commit()
        
        logger.info("Exceção capturada: %s", str(exc_info.value))
        logger.info("✓ Validação de campos obrigatórios funcionando corretamente!")
    
    except AssertionError:
        logger.error("Falha na validação de campos obrigatórios!")
        raise

def test_relacionamento_medicamento(db_session):
    logger.info("\n=== TESTE 3: Validação de relacionamento com Medicamento ===")
    
    logger.info("Criando novo medicamento Ibuprofeno...")
    med = Medicamento(
        nome="Ibuprofeno",
        dosagem="400mg",
        peso=0.4,
        qr_code="QR456"
    )
    
    db_session.add(med)
    db_session.commit()
    logger.info("Medicamento criado com ID: %s", med.id)
    
    logger.info("Criando item de estoque relacionado...")
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
    logger.info("Item de estoque criado com ID: %s", item.id)
    
    logger.info("Executando query com JOIN para validar relacionamento...")
    result = db_session.query(Estoque).join(Medicamento).filter(
        Medicamento.nome == "Ibuprofeno"
    ).first()
    
    assert result is not None, "Relacionamento não encontrado"
    logger.info("✓ Relacionamento validado com sucesso!")
    logger.info("Medicamento encontrado: %s", result.medicamento)

if __name__ == "__main__":
    logger.info("Executando testes diretamente...")
    pytest.main(["-v", __file__])
