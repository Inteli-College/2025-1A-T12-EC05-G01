import pytest
from sqlalchemy import create_engine, inspect, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker
from database.db_conexao import Base
from database.models.perdas import Perdas
from database.models.estoque import Estoque
from database.models.medicamento import Medicamento
import logging
from datetime import datetime

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
    connection = test_engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection, autoflush=False)
    session = Session()
    
    logger.info("\n--- Nova sessão de banco iniciada ---")
    
    try:
        yield session
    finally:
        logger.info("--- Encerrando sessão ---")
        session.close()
        if transaction.is_active:
            logger.info("Revertendo transação...")
            transaction.rollback()
        connection.close()

def test_criacao_perdas(db_session):
    logger.info("\n=== TESTE 1: Criação básica de perda ===")
    
    # Criação de registros relacionados
    medicamento = Medicamento(
        nome="Paracetamol",
        dosagem="500mg",
        peso=0.5,
        qr_code="12345"
    )
    db_session.add(medicamento)
    db_session.flush()

    estoque = Estoque(
        id_medicamento=medicamento.id,
        lote="LOTE123",
        quantidade=100,
        validade="2025-12-31",
        bin=1,
        fornecedor="Fornecedor A"
    )
    db_session.add(estoque)
    db_session.flush()

    # Criação da perda
    logger.info("Criando nova perda...")
    nova_perda = Perdas(
        id_estoque=estoque.id,
        motivo="Quebra durante o transporte"
    )
    db_session.add(nova_perda)
    db_session.commit()

    # Verificação
    logger.info("Verificando persistência no banco...")
    registro = db_session.query(Perdas).first()
    
    assert registro.id_estoque == estoque.id, "ID do estoque incorreto"
    assert registro.motivo == "Quebra durante o transporte", "Motivo incorreto"
    assert isinstance(registro.data_perda, datetime), "Data não foi gerada automaticamente"
    logger.info("✓ Registro válido: ID %d - Estoque %d - %s", registro.id, registro.id_estoque, registro.motivo)

def test_campos_obrigatorios(db_session):
    logger.info("\n=== TESTE 2: Validação de campos obrigatórios ===")
    
    with pytest.raises(Exception) as exc_info:
        logger.warning("Tentando criar registro sem campos obrigatórios...")
        perda_invalida = Perdas()
        db_session.add(perda_invalida)
        db_session.commit()
    
    logger.info("Exceção capturada: %s", str(exc_info.value))
    logger.info("✓ Validação de campos obrigatórios funcionando!")

def test_consulta_perdas(db_session):
    logger.info("\n=== TESTE 3: Consulta de registros de perdas ===")
    
    with db_session.begin_nested():
        # Criação de dados de teste
        medicamento = Medicamento(nome="Ibuprofeno", dosagem="400mg", peso=0.6, qr_code="67890")
        db_session.add(medicamento)
        db_session.flush()

        estoque = Estoque(
            id_medicamento=medicamento.id,
            lote="LOTE456",
            quantidade=50,
            validade="2024-06-30",
            bin=2,
            fornecedor="Fornecedor B"
        )
        db_session.add(estoque)
        db_session.flush()

        db_session.add_all([
            Perdas(id_estoque=estoque.id, motivo="Vencimento"),
            Perdas(id_estoque=estoque.id, motivo="Roubo")
        ])

    logger.info("Buscando todos os registros de perdas...")
    resultados = db_session.query(Perdas).all()
    
    assert len(resultados) == 2, f"Quantidade incorreta: {len(resultados)}"
    logger.info("✓ Quantidade de registros correta: %d", len(resultados))

def test_estrutura_tabela(test_engine):
    logger.info("\n=== TESTE 4: Validação da estrutura da tabela ===")
    
    inspector = inspect(test_engine)
    colunas = inspector.get_columns('perdas')
    
    logger.info("Colunas encontradas na tabela 'perdas':")
    esperadas = {
        'id': {'type': Integer, 'nullable': False, 'pk': True},
        'id_estoque': {'type': Integer, 'nullable': False, 'pk': False},
        'motivo': {'type': String, 'nullable': False, 'pk': False},
        'data_perda': {'type': DateTime, 'nullable': True, 'pk': False}
    }
    
    for col in colunas:
        nome = col['name']
        logger.info("- %s (%s)", nome, col['type'].__class__.__name__)
        
        assert nome in esperadas, f"Coluna inesperada: {nome}"
        specs = esperadas[nome]
        
        assert isinstance(col['type'], specs['type']), f"Tipo incorreto para {nome}"
        assert col['nullable'] == specs['nullable'], f"Nullable incorreto para {nome}"
        assert col['primary_key'] == specs['pk'], f"Chave primária incorreta para {nome}"
    
    logger.info("✓ Estrutura da tabela validada com sucesso!")

if __name__ == "__main__":
    pytest.main(["-v", __file__])
