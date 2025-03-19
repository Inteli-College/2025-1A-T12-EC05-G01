import pytest
from sqlalchemy import create_engine, inspect, Integer, String
from sqlalchemy.orm import sessionmaker
from src.database.db_conexao import Base
from backend.models.prescricao_medicamento import PrescricaoMedicamento
from backend.models.prescricao_on_hold import PrescricaoOnHold
from backend.models.prescricao_aceita import PrescricaoAceita
from backend.models.medicamento import Medicamento
from backend.models.medico import Medico
from backend.models.paciente import Paciente
from backend.models.farmaceuticos import Farmaceutico
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
    """Cria toda a cadeia de dependências necessária"""
    # Criação de registros base
    medico = Medico(nome="Dr. Silva", crm="CRM/SP 789456")
    paciente = Paciente(nome="Carlos Andrade", leito="302B", hc="HC147258")
    farmaceutico = Farmaceutico(nome="Dra. Ana Costa")
    medicamento = Medicamento(
        nome="Dipirona",
        dosagem="500mg",
        peso=0.5,
        qr_code="DIP500"
    )
    
    session.add_all([medico, paciente, farmaceutico, medicamento])
    session.flush()
    
    # Prescrição On Hold
    prescricao_on_hold = PrescricaoOnHold(
        id_medico=medico.id,
        id_paciente=paciente.id
    )
    session.add(prescricao_on_hold)
    session.flush()
    
    # Prescrição Aceita
    prescricao_aceita = PrescricaoAceita(
        id_prescricao_on_hold=prescricao_on_hold.id,
        id_farmaceutico=farmaceutico.id
    )
    session.add(prescricao_aceita)
    session.flush()
    
    return {
        'id_prescricao_on_hold': prescricao_on_hold.id,
        'id_prescricao_aceita': prescricao_aceita.id,
        'id_medicamento': medicamento.id
    }

def test_criacao_prescricao_medicamento(db_session):
    logger.info("\n=== TESTE 1: Criação básica de PrescricaoMedicamento ===")
    
    dependencias = criar_dependencias(db_session)
    
    logger.info("Criando registro com todos os campos...")
    novo_registro = PrescricaoMedicamento(
        id_prescricao_on_hold=dependencias['id_prescricao_on_hold'],
        id_prescricao_aceita=dependencias['id_prescricao_aceita'],
        id_medicamento=dependencias['id_medicamento'],
        quantidade=5,
        status_medicamento="dispensado"
    )
    db_session.add(novo_registro)
    db_session.commit()
    
    registro = db_session.query(PrescricaoMedicamento).first()
    
    assert registro.id_prescricao_on_hold == dependencias['id_prescricao_on_hold'], "FK prescrição on_hold incorreta"
    assert registro.id_prescricao_aceita == dependencias['id_prescricao_aceita'], "FK prescrição aceita incorreta"
    assert registro.id_medicamento == dependencias['id_medicamento'], "FK medicamento incorreta"
    assert registro.quantidade == 5, "Quantidade incorreta"
    assert registro.status_medicamento == "dispensado", "Status incorreto"
    logger.info("✓ Registro criado com sucesso: ID %d", registro.id)

def test_criacao_sem_prescricao_aceita(db_session):
    logger.info("\n=== TESTE 2: Criação sem prescrição aceita (nullable) ===")
    
    dependencias = criar_dependencias(db_session)
    
    logger.info("Criando registro sem id_prescricao_aceita...")
    novo_registro = PrescricaoMedicamento(
        id_prescricao_on_hold=dependencias['id_prescricao_on_hold'],
        id_medicamento=dependencias['id_medicamento'],
        quantidade=3,
        status_medicamento="pendente"
    )
    db_session.add(novo_registro)
    db_session.commit()
    
    registro = db_session.query(PrescricaoMedicamento).first()
    
    assert registro.id_prescricao_aceita is None, "id_prescricao_aceita deveria ser NULL"
    logger.info("✓ Registro com NULL válido criado: ID %d", registro.id)

def test_campos_obrigatorios(db_session):
    logger.info("\n=== TESTE 3: Validação de campos obrigatórios ===")
    
    with pytest.raises(Exception) as exc_info:
        logger.warning("Tentando criar registro incompleto...")
        registro_invalido = PrescricaoMedicamento(
            status_medicamento="pendente"  # Faltam campos obrigatórios
        )
        db_session.add(registro_invalido)
        db_session.commit()
    
    logger.info("Exceção capturada: %s", str(exc_info.value))
    logger.info("✓ Campos obrigatórios validados corretamente")

def test_relacionamentos(db_session):
    logger.info("\n=== TESTE 4: Validação de relacionamentos ===")
    
    dependencias = criar_dependencias(db_session)
    
    # Cria registro principal
    pm = PrescricaoMedicamento(
        id_prescricao_on_hold=dependencias['id_prescricao_on_hold'],
        id_prescricao_aceita=dependencias['id_prescricao_aceita'],
        id_medicamento=dependencias['id_medicamento'],
        quantidade=2,
        status_medicamento="entregue"
    )
    db_session.add(pm)
    db_session.commit()
    
    # Testa relações através de joins
    query = db_session.query(
        PrescricaoMedicamento,
        PrescricaoOnHold,
        Medicamento
    ).join(
        PrescricaoOnHold,
        PrescricaoMedicamento.id_prescricao_on_hold == PrescricaoOnHold.id
    ).join(
        Medicamento,
        PrescricaoMedicamento.id_medicamento == Medicamento.id
    ).first()
    
    assert query is not None, "Join falhou"
    assert query.PrescricaoOnHold.id == dependencias['id_prescricao_on_hold'], "Relacionamento OnHold incorreto"
    assert query.Medicamento.nome == "Dipirona", "Relacionamento Medicamento incorreto"
    logger.info("✓ Relacionamentos validados com sucesso")

def test_estrutura_tabela(test_engine):
    logger.info("\n=== TESTE 5: Validação da estrutura da tabela ===")
    
    inspector = inspect(test_engine)
    colunas = inspector.get_columns('prescricao_medicamento')
    
    logger.info("Colunas encontradas:")
    estrutura_esperada = {
        'id': {'type': Integer, 'nullable': False, 'pk': True},
        'id_prescricao_on_hold': {'type': Integer, 'nullable': False, 'pk': False},
        'id_prescricao_aceita': {'type': Integer, 'nullable': True, 'pk': False},
        'id_medicamento': {'type': Integer, 'nullable': False, 'pk': False},
        'quantidade': {'type': Integer, 'nullable': False, 'pk': False},
        'status_medicamento': {'type': String, 'nullable': False, 'pk': False}
    }
    
    for col in colunas:
        nome = col['name']
        logger.info("- %s (%s)", nome, col['type'].__class__.__name__)
        
        assert nome in estrutura_esperada, f"Coluna inesperada: {nome}"
        specs = estrutura_esperada[nome]
        
        assert isinstance(col['type'], specs['type']), f"Tipo incorreto para {nome}"
        assert col['nullable'] == specs['nullable'], f"Nullable incorreto para {nome}"
        assert col['primary_key'] == specs['pk'], f"Chave primária incorreta para {nome}"
    
    logger.info("✓ Estrutura da tabela validada com sucesso")

if __name__ == "__main__":
    pytest.main(["-v", __file__])
