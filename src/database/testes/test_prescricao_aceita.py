import pytest
from sqlalchemy import create_engine, inspect, Integer, DateTime
from sqlalchemy.orm import sessionmaker
from database.db_conexao import Base
from database.models.prescricao_aceita import PrescricaoAceita
from database.models.prescricao_on_hold import PrescricaoOnHold
from database.models.medico import Medico
from database.models.paciente import Paciente
from database.models.farmaceuticos import Farmaceutico
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

def criar_dependencias(session):
    """Cria registros necessários para os testes"""
    medico = Medico(nome="Dr. Carlos", crm="CRM/SP 123456")
    paciente = Paciente(nome="Maria Silva", leito="201A", hc="HC78901")
    farmaceutico = Farmaceutico(nome="Farmacêutico João")
    
    session.add_all([medico, paciente, farmaceutico])
    session.flush()
    
    prescricao_on_hold = PrescricaoOnHold(
        id_medico=medico.id,
        id_paciente=paciente.id
    )
    session.add(prescricao_on_hold)
    session.flush()
    
    return {
        'id_prescricao': prescricao_on_hold.id,
        'id_farmaceutico': farmaceutico.id
    }

def test_criacao_prescricao_aceita(db_session):
    logger.info("\n=== TESTE 1: Criação básica de prescrição aceita ===")
    
    dependencias = criar_dependencias(db_session)
    
    logger.info("Criando nova prescrição aceita...")
    nova_aceita = PrescricaoAceita(
        id_prescricao_on_hold=dependencias['id_prescricao'],
        id_farmaceutico=dependencias['id_farmaceutico']
    )
    db_session.add(nova_aceita)
    db_session.commit()
    
    logger.info("Verificando persistência no banco...")
    registro = db_session.query(PrescricaoAceita).first()
    
    assert registro.id_prescricao_on_hold == dependencias['id_prescricao'], "ID prescrição incorreto"
    assert registro.id_farmaceutico == dependencias['id_farmaceutico'], "ID farmacêutico incorreto"
    assert isinstance(registro.data_validacao, datetime), "Data de validação não gerada automaticamente"
    logger.info("✓ Registro válido: ID %d - Data: %s", registro.id, registro.data_validacao)

def test_campos_obrigatorios(db_session):
    logger.info("\n=== TESTE 2: Validação de campos obrigatórios ===")
    
    with pytest.raises(Exception) as exc_info:
        logger.warning("Tentando criar registro sem campos obrigatórios...")
        prescricao_invalida = PrescricaoAceita()
        db_session.add(prescricao_invalida)
        db_session.commit()
    
    logger.info("Exceção capturada: %s", str(exc_info.value))
    logger.info("✓ Validação de campos obrigatórios funcionando!")

def test_consulta_multiplos_registros(db_session):
    logger.info("\n=== TESTE 3: Consulta de múltiplas prescrições aceitas ===")
    
    dependencias = criar_dependencias(db_session)
    
    with db_session.begin_nested():
        db_session.add_all([
            PrescricaoAceita(
                id_prescricao_on_hold=dependencias['id_prescricao'],
                id_farmaceutico=dependencias['id_farmaceutico']
            ),
            PrescricaoAceita(
                id_prescricao_on_hold=dependencias['id_prescricao'],
                id_farmaceutico=dependencias['id_farmaceutico']
            )
        ])
    
    logger.info("Buscando todos os registros...")
    resultados = db_session.query(PrescricaoAceita).all()
    
    assert len(resultados) == 2, f"Quantidade incorreta: {len(resultados)}"
    logger.info("✓ Quantidade de registros correta: %d", len(resultados))

def test_estrutura_tabela(test_engine):
    logger.info("\n=== TESTE 4: Validação da estrutura da tabela ===")
    
    inspector = inspect(test_engine)
    colunas = inspector.get_columns('prescricao_aceita')
    
    logger.info("Colunas encontradas:")
    esperadas = {
        'id': {'type': Integer, 'nullable': False, 'pk': True},
        'id_prescricao_on_hold': {'type': Integer, 'nullable': False, 'pk': False},
        'id_farmaceutico': {'type': Integer, 'nullable': False, 'pk': False},
        'data_validacao': {'type': DateTime, 'nullable': True, 'pk': False}
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
