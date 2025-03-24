import pytest
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from backend.models.farmaceuticos import Farmaceutico
from src.database.db_conexao import Base
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture(scope="module")
def test_engine():
    logger.info("\n\n--- Inicializando banco de testes em memória ---")
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    yield engine
    logger.info("\n--- Limpando banco de dados após testes ---")
    Base.metadata.drop_all(engine)

@pytest.fixture
def db_session(test_engine):
    # Conexão persistente para toda a sessão de testes
    connection = test_engine.connect()
    
    # Transação de nível de conexão
    transaction = connection.begin()
    
    # Criação da sessão
    Session = sessionmaker(bind=connection, autoflush=False)
    session = Session()
    
    logger.info("\n--- Nova sessão de banco iniciada ---")
    
    try:
        yield session
    finally:
        logger.info("--- Encerrando sessão ---")
        session.close()
        
        # Rollback apenas se a transação ainda estiver ativa
        if transaction.is_active:
            logger.info("Revertendo transação...")
            transaction.rollback()
        
        connection.close()

def test_criacao_farmaceutico(db_session):
    logger.info("\n=== TESTE 1: Criação básica de farmacêutico ===")
    
    logger.info("Criando novo farmacêutico...")
    novo_farmaceutico = Farmaceutico(nome="Dra. Ana Claudia")
    db_session.add(novo_farmaceutico)
    db_session.commit()
    
    logger.info("Verificando persistência no banco...")
    registro = db_session.query(Farmaceutico).first()
    
    assert registro.nome == "Dra. Ana Claudia", "Nome não corresponde"
    assert registro.id == 1, "ID incorreto"
    logger.info("✓ Registro válido: ID %d - %s", registro.id, registro.nome)

def test_campos_obrigatorios(db_session):
    logger.info("\n=== TESTE 2: Validação de campos obrigatórios ===")
    
    with pytest.raises(Exception) as exc_info:
        logger.warning("Tentando criar registro sem nome...")
        farmaceutico_invalido = Farmaceutico()
        db_session.add(farmaceutico_invalido)
        db_session.commit()
    
    logger.info("Exceção capturada: %s", str(exc_info.value))
    logger.info("✓ Validação de campos obrigatórios funcionando!")

def test_consulta_farmaceutico(db_session):
    logger.info("\n=== TESTE 3: Consulta de registros ===")
    
    # Setup com rollback automático
    with db_session.begin_nested():  # Transação aninhada
        db_session.add_all([
            Farmaceutico(nome="Dr. Carlos Andrade"),
            Farmaceutico(nome="Dra. Juliana Menezes")
        ])
    
    logger.info("Buscando todos os registros...")
    resultados = db_session.query(Farmaceutico).all()
    
    assert len(resultados) == 2, f"Registros encontrados: {len(resultados)}"
    logger.info("✓ Quantidade de registros correta!")

def test_estrutura_tabela(test_engine):
    logger.info("\n=== TESTE 4: Validação da estrutura da tabela ===")
    
    inspector = inspect(test_engine)
    colunas = inspector.get_columns('farmaceutico')
    
    logger.info("Colunas encontradas:")
    coluna_nomes = []
    for col in colunas:
        coluna_nomes.append(col['name'])
        logger.info("- %s (%s)", col['name'], col['type'].__class__.__name__)
    
    assert 'id' in coluna_nomes, "Coluna ID ausente"
    assert 'nome' in coluna_nomes, "Coluna nome ausente"
    logger.info("✓ Estrutura da tabela validada!")

if __name__ == "__main__":
    pytest.main(["-v", __file__])
