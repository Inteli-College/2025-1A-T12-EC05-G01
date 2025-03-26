import pytest
from sqlalchemy import create_engine, inspect, Integer, DateTime, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from src.database.db_conexao import Base
from backend.models.prescricao_on_hold import PrescricaoOnHold
from backend.models.medico import Medico
from backend.models.paciente import Paciente
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture(scope="module")
def test_engine():
    logger.info("\n\n--- Inicializando banco de testes em memória ---")
    # Configuração correta para SQLite
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False}
    )
    
    # Habilita explicitamente foreign keys
    with engine.begin() as conn:
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
    medico = Medico(nome="Dr. Roberto Alves", crm="CRM/SP 123456")
    paciente = Paciente(nome="Joana D'Arc", leito="101A", hc="HC12345")
    
    session.add_all([medico, paciente])
    session.commit()
    
    return {
        'id_medico': medico.id,
        'id_paciente': paciente.id
    }

def test_criacao_prescricao_on_hold(db_session):
    logger.info("\n=== TESTE 1: Criação básica de PrescricaoOnHold ===")
    
    dependencias = criar_dependencias(db_session)
    
    logger.info("Criando nova prescrição on hold...")
    nova_prescricao = PrescricaoOnHold(
        id_medico=dependencias['id_medico'],
        id_paciente=dependencias['id_paciente']
    )
    db_session.add(nova_prescricao)
    db_session.commit()
    
    logger.info("Verificando persistência no banco...")
    registro = db_session.get(PrescricaoOnHold, 1)
    
    assert registro.id_medico == dependencias['id_medico'], "ID médico incorreto"
    assert registro.id_paciente == dependencias['id_paciente'], "ID paciente incorreto"
    assert isinstance(registro.data_prescricao, datetime), "Data não gerada automaticamente"
    logger.info("✓ Registro válido: ID %d - Data: %s", registro.id, registro.data_prescricao)

def test_campos_obrigatorios(db_session):
    logger.info("\n=== TESTE 2: Validação de campos obrigatórios ===")
    
    with pytest.raises(Exception) as exc_info:
        logger.warning("Tentando criar registro sem campos obrigatórios...")
        prescricao_invalida = PrescricaoOnHold()
        db_session.add(prescricao_invalida)
        db_session.commit()
    
    logger.info("Exceção capturada: %s", str(exc_info.value))
    logger.info("✓ Validação de campos obrigatórios funcionando!")

def test_relacionamentos(db_session):
    logger.info("\n=== TESTE 3: Validação de relacionamentos ===")
    
    dependencias = criar_dependencias(db_session)
    
    prescricao = PrescricaoOnHold(
        id_medico=dependencias['id_medico'],
        id_paciente=dependencias['id_paciente']
    )
    db_session.add(prescricao)
    db_session.commit()
    
    medico = db_session.get(Medico, prescricao.id_medico)
    assert medico is not None, "Médico não encontrado"
    assert medico.nome == "Dr. Roberto Alves", "Nome do médico incorreto"
    
    paciente = db_session.get(Paciente, prescricao.id_paciente)
    assert paciente is not None, "Paciente não encontrado"
    assert paciente.leito == "101A", "Leito do paciente incorreto"
    
    logger.info("✓ Relacionamentos validados com sucesso")

def test_cascade_delete(db_session):
    logger.info("\n=== TESTE 4: Validação de cascade delete ===")
    
    dependencias = criar_dependencias(db_session)
    
    # Cria prescrição
    prescricao = PrescricaoOnHold(
        id_medico=dependencias['id_medico'],
        id_paciente=dependencias['id_paciente']
    )
    db_session.add(prescricao)
    db_session.commit()
    prescricao_id = prescricao.id  # Guarda o ID antes da deleção

    # Deleta médico
    medico = db_session.get(Medico, dependencias['id_medico'])
    db_session.delete(medico)
    db_session.commit()

    # Verificação correta da existência
    existe_prescricao = db_session.query(
        db_session.query(PrescricaoOnHold)
        .filter_by(id=prescricao_id)
        .exists()
    ).scalar()

    assert not existe_prescricao, "Prescrição não foi removida com cascade delete"
    logger.info("✓ Cascade delete validado com sucesso!")

def test_estrutura_tabela(test_engine):
    logger.info("\n=== TESTE 5: Validação da estrutura da tabela ===")
    
    inspector = inspect(test_engine)
    colunas = inspector.get_columns('prescricao_on_hold')
    
    logger.info("Colunas encontradas:")
    estrutura_esperada = {
        'id': {'type': Integer, 'nullable': False, 'pk': True},
        'id_medico': {'type': Integer, 'nullable': False, 'pk': False},
        'id_paciente': {'type': Integer, 'nullable': False, 'pk': False},
        'data_prescricao': {'type': DateTime, 'nullable': True, 'pk': False}
    }
    
    for col in colunas:
        nome = col['name']
        logger.info("- %s (%s)", nome, col['type'].__class__.__name__)
        
        assert nome in estrutura_esperada, f"Coluna inesperada: {nome}"
        specs = estrutura_esperada[nome]
        
        assert isinstance(col['type'], specs['type']), f"Tipo incorreto para {nome}"
        assert col['nullable'] == specs['nullable'], f"Nullable incorreto para {nome}"
        assert col['primary_key'] == specs['pk'], f"Chave primária incorreta para {nome}"
    
    logger.info("✓ Estrutura da tabela validada com sucesso!")

if __name__ == "__main__":
    pytest.main(["-v", __file__])
