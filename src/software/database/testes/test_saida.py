import pytest
from sqlalchemy import create_engine, inspect, Integer, DateTime, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from src.database.db_conexao import Base
from backend.models.saida import Saidas
from backend.models.estoque import Estoque
from backend.models.medicamento import Medicamento
from backend.models.paciente import Paciente
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture(scope="module")
def test_engine():
    logger.info("\n\n--- Inicializando banco de testes em memória ---")
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False}
    )
    
    # Habilita foreign keys
    with engine.connect() as conn:
        conn.execute(text("PRAGMA foreign_keys = ON"))
    
    Base.metadata.create_all(engine)
    yield engine
    logger.info("\n--- Limpando banco de dados após testes ---")
    Base.metadata.drop_all(engine)

@pytest.fixture
def db_session(test_engine):
    connection = test_engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection)
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

def criar_dependencias(session):
    """Cria registros necessários para os testes"""
    medicamento = Medicamento(
        nome="Paracetamol",
        dosagem="500mg",
        peso=0.5,
        qr_code="PARA500"
    )
    paciente = Paciente(
        nome="João Silva",
        leito="202B",
        hc="HC987654"
    )
    
    session.add_all([medicamento, paciente])
    session.commit()
    
    estoque = Estoque(
        id_medicamento=medicamento.id,
        lote="LOTE789",
        quantidade=100,
        validade="2025-12-31",
        bin=3,
        fornecedor="Fornecedor X"
    )
    session.add(estoque)
    session.commit()
    
    return {
        'id_estoque': estoque.id,
        'id_paciente': paciente.id
    }

def test_criacao_saida(db_session):
    logger.info("\n=== TESTE 1: Criação básica de Saída ===")
    
    dependencias = criar_dependencias(db_session)
    
    logger.info("Criando nova saída...")
    nova_saida = Saidas(
        id_estoque=dependencias['id_estoque'],
        id_paciente=dependencias['id_paciente'],
        quantidade=5
    )
    db_session.add(nova_saida)
    db_session.commit()
    
    registro = db_session.query(Saidas).first()
    
    assert registro.id_estoque == dependencias['id_estoque'], "ID estoque incorreto"
    assert registro.id_paciente == dependencias['id_paciente'], "ID paciente incorreto"
    assert registro.quantidade == 5, "Quantidade incorreta"
    assert isinstance(registro.data_saida, datetime), "Data não gerada automaticamente"
    logger.info("✓ Saída registrada: ID %d - %s", registro.id, registro.data_saida)

def test_campos_obrigatorios(db_session):
    logger.info("\n=== TESTE 2: Validação de campos obrigatórios ===")
    
    with pytest.raises(Exception) as exc_info:
        logger.warning("Tentando criar registro incompleto...")
        saida_invalida = Saidas()
        db_session.add(saida_invalida)
        db_session.commit()
    
    logger.info("Exceção capturada: %s", str(exc_info.value))
    logger.info("✓ Campos obrigatórios validados!")

def test_relacionamentos(db_session):
    logger.info("\n=== TESTE 3: Validação de relacionamentos ===")
    
    dependencias = criar_dependencias(db_session)
    
    saida = Saidas(
        id_estoque=dependencias['id_estoque'],
        id_paciente=dependencias['id_paciente'],
        quantidade=3
    )
    db_session.add(saida)
    db_session.commit()
    
    # Testa relacionamento com Estoque
    estoque = db_session.get(Estoque, saida.id_estoque)
    assert estoque.lote == "LOTE789", "Relacionamento com Estoque incorreto"
    
    # Testa relacionamento com Paciente
    paciente = db_session.get(Paciente, saida.id_paciente)
    assert paciente.leito == "202B", "Relacionamento com Paciente incorreto"
    
    logger.info("✓ Relacionamentos validados com sucesso")

def test_cascade_delete(db_session):
    logger.info("\n=== TESTE 4: Validação de cascade delete ===")
    
    dependencias = criar_dependencias(db_session)
    
    # Cria saída
    saida = Saidas(
        id_estoque=dependencias['id_estoque'],
        id_paciente=dependencias['id_paciente'],
        quantidade=2
    )
    db_session.add(saida)
    db_session.commit()
    saida_id = saida.id
    
    # Deleta estoque
    estoque = db_session.get(Estoque, dependencias['id_estoque'])
    db_session.delete(estoque)
    db_session.commit()
    
    # Verifica se a saída foi removida
    existe_saida = db_session.query(
        db_session.query(Saidas)
        .filter_by(id=saida_id)
        .exists()
    ).scalar()
    
    assert not existe_saida, "Saída não foi removida com cascade delete"
    logger.info("✓ Cascade delete funcionando!")

def test_estrutura_tabela(test_engine):
    logger.info("\n=== TESTE 5: Validação da estrutura da tabela ===")
    
    inspector = inspect(test_engine)
    colunas = inspector.get_columns('saidas')
    
    estrutura_esperada = {
        'id': {'type': Integer, 'nullable': False, 'pk': True},
        'id_estoque': {'type': Integer, 'nullable': False, 'pk': False},
        'id_paciente': {'type': Integer, 'nullable': False, 'pk': False},
        'quantidade': {'type': Integer, 'nullable': False, 'pk': False},
        'data_saida': {'type': DateTime, 'nullable': True, 'pk': False}
    }
    
    for col in colunas:
        nome = col['name']
        logger.info("Verificando coluna: %s", nome)
        
        assert nome in estrutura_esperada, f"Coluna inesperada: {nome}"
        specs = estrutura_esperada[nome]
        
        assert isinstance(col['type'], specs['type']), f"Tipo incorreto para {nome}"
        assert col['nullable'] == specs['nullable'], f"Nullable incorreto para {nome}"
        assert col['primary_key'] == specs['pk'], f"Chave primária incorreta para {nome}"
    
    logger.info("✓ Estrutura da tabela validada!")

if __name__ == "__main__":
    pytest.main(["-v", __file__])
