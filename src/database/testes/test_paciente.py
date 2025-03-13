import pytest
from sqlalchemy import create_engine, inspect, exc
from sqlalchemy.orm import sessionmaker
from database.db_conexao import Base
from database.models.paciente import Paciente
from sqlalchemy import Integer, String 
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture(scope="module")
def test_engine():
    logger.info("\n\n=== CONFIGURANDO BANCO DE TESTES ===")
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)
    logger.info("\n=== BANCO DE TESTES DESMONTADO ===")

@pytest.fixture
def db_session(test_engine):
    connection = test_engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection)
    session = Session()
    
    logger.info("\n--- Nova sessão iniciada ---")
    yield session
    
    logger.info("--- Encerrando sessão ---")
    if transaction.is_active:
        transaction.rollback()
    connection.close()

@pytest.fixture(autouse=True)
def limpar_dados(db_session):
    """Garante limpeza dos dados entre testes"""
    db_session.query(Paciente).delete()
    db_session.commit()

def test_criacao_paciente(db_session):
    logger.info("\n=== TESTE 1: Criação básica de paciente ===")
    
    novo_paciente = Paciente(
        nome="Maria Oliveira",
        leito="B202",
        hc="HC67890"
    )
    
    db_session.add(novo_paciente)
    db_session.commit()
    
    registro = db_session.query(Paciente).first()
    
    assert registro.nome == "Maria Oliveira"
    assert registro.leito == "B202"
    assert registro.hc == "HC67890"
    logger.info(f"✓ Paciente criado com ID: {registro.id}")

def test_campos_obrigatorios(db_session):
    logger.info("\n=== TESTE 2: Campos obrigatórios ===")
    
    with pytest.raises(exc.IntegrityError):
        paciente_invalido = Paciente(nome=None, leito=None, hc=None)
        db_session.add(paciente_invalido)
        db_session.commit()
    
    logger.info("✓ Campos obrigatórios validados")

def test_representacao_string(db_session):
    logger.info("\n=== TESTE 3: Representação string ===")
    
    paciente = Paciente(
        nome="João Silva",
        leito="A101",
        hc="HC12345"
    )
    
    db_session.add(paciente)
    db_session.commit()
    
    registro = db_session.query(Paciente).first()
    expected_repr = "<Paciente(nome=João Silva, leito=A101, hc=HC12345)>"
    assert str(registro) == expected_repr
    logger.info("✓ Representação string válida")

def test_estrutura_tabela(test_engine):
    logger.info("\n=== TESTE 4: Estrutura da tabela ===")
    
    inspector = inspect(test_engine)
    columns = inspector.get_columns('paciente')
    
    colunas_esperadas = {
        'id': {'type': Integer, 'nullable': False, 'primary_key': True},
        'nome': {'type': String, 'nullable': False},
        'leito': {'type': String, 'nullable': False},
        'hc': {'type': String, 'nullable': False}
    }
    
    for col in columns:
        col_name = col['name']
        assert col_name in colunas_esperadas
        specs = colunas_esperadas[col_name]
        
        assert isinstance(col['type'], specs['type'])
        assert col['nullable'] == specs['nullable']
        if 'primary_key' in specs:
            assert col['primary_key'] == specs['primary_key']
    
    logger.info("✓ Estrutura da tabela validada")

if __name__ == "__main__":
    pytest.main(["-v", __file__])
