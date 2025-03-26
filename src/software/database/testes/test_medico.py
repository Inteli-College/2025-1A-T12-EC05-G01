import pytest
from sqlalchemy import create_engine, inspect, exc
from sqlalchemy import Integer, String 
from sqlalchemy.orm import sessionmaker
from src.database.db_conexao import Base
from backend.models.medico import Medico
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
    # Verifica se a transação ainda está ativa antes do rollback
    if transaction.is_active:
        logger.info("Executando rollback...")
        transaction.rollback()
    connection.close()

@pytest.fixture(autouse=True)
def limpar_dados(db_session):
    """Garante limpeza dos dados entre testes"""
    db_session.query(Medico).delete()
    db_session.commit()

def test_criacao_medico(db_session):
    logger.info("\n=== TESTE 1: Criação básica de médico ===")
    
    novo_medico = Medico(
        nome="Dr. Carlos Silva",
        crm="CRM/SP 123456"
    )
    
    db_session.add(novo_medico)
    db_session.commit()
    
    registro = db_session.query(Medico).first()
    
    assert registro.nome == "Dr. Carlos Silva"
    assert registro.crm == "CRM/SP 123456"
    logger.info(f"✓ Médico criado com ID: {registro.id}")

def test_uniqueness_crm(db_session):
    logger.info("\n=== TESTE 2: Unicidade do CRM ===")
    
    medico1 = Medico(nome="Dra. Ana Costa", crm="CRM/RJ 654321")
    medico2 = Medico(nome="Dr. Pedro Alves", crm="CRM/RJ 654321")
    
    db_session.add(medico1)
    db_session.commit()
    
    with pytest.raises(exc.IntegrityError) as e:
        db_session.add(medico2)
        db_session.commit()
    
    logger.info(f"Exceção capturada: {str(e.value)}")
    assert "UNIQUE constraint failed" in str(e.value)
    logger.info("✓ Unicidade do CRM validada")

def test_campos_obrigatorios(db_session):
    logger.info("\n=== TESTE 3: Campos obrigatórios ===")
    
    with pytest.raises(exc.IntegrityError):
        medico_invalido = Medico(nome=None, crm=None)
        db_session.add(medico_invalido)
        db_session.commit()
    
    logger.info("✓ Campos obrigatórios validados")

def test_representacao_string(db_session):
    logger.info("\n=== TESTE 4: Representação string ===")
    
    medico = Medico(
        nome="Dra. Juliana Menezes",
        crm="CRM/MG 987654"
    )
    
    db_session.add(medico)
    db_session.commit()
    
    registro = db_session.query(Medico).first()
    expected_repr = "<Medico(nome=Dra. Juliana Menezes, crm=CRM/MG 987654)>"
    assert str(registro) == expected_repr
    logger.info("✓ Representação string válida")

def test_estrutura_tabela(test_engine):
    logger.info("\n=== TESTE 5: Estrutura da tabela ===")
    
    inspector = inspect(test_engine)
    columns = inspector.get_columns('medico')
    
    colunas_esperadas = {
        'id': {'type': Integer, 'nullable': False, 'primary_key': True},
        'nome': {'type': String, 'nullable': False},
        'crm': {'type': String, 'nullable': False}
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
