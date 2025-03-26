import pytest
from sqlalchemy import create_engine, inspect, Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker
from src.database.db_conexao import Base
from backend.models.medicamento import Medicamento
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.fixture(scope="module")
def test_engine():
    logger.info("\n\n=== PREPARANDO BANCO DE TESTES ===")
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)
    logger.info("\n=== BANCO DE TESTES LIMPO ===")

@pytest.fixture(autouse=True)
def limpar_dados(db_session):
    """Fixture para limpar dados antes de cada teste"""
    db_session.query(Medicamento).delete()
    db_session.commit()
    yield
    db_session.rollback()

@pytest.fixture
def db_session(test_engine):
    connection = test_engine.connect()
    transaction = connection.begin()
    
    Session = sessionmaker(
        bind=connection,
        autoflush=False,
        expire_on_commit=False
    )
    
    session = Session()
    logger.info("\n--- Nova sessão iniciada ---")
    
    try:
        yield session
    finally:
        logger.info("\n--- Finalizando sessão ---")
        session.close()
        
        if transaction.is_active:
            logger.info("Executando rollback...")
            transaction.rollback()
        
        connection.close()

def test_criacao_medicamento(db_session):
    logger.info("\n=== TESTE 1: Criação básica de medicamento ===")
    
    with db_session.begin_nested():
        novo_med = Medicamento(
            nome="Paracetamol",
            dosagem="500mg",
            peso=0.5,
            qr_code="QR123"
        )
        db_session.add(novo_med)
    
    registro = db_session.query(Medicamento).first()
    
    assert registro.nome == "Paracetamol", "Nome incorreto"
    assert registro.dosagem == "500mg", "Dosagem incorreta"
    assert registro.peso == 0.5, "Peso incorreto"
    logger.info("✓ Medicamento criado com ID: %d", registro.id)

def test_validacao_campos_obrigatorios(db_session):
    logger.info("\n=== TESTE 2: Validação de campos obrigatórios ===")
    
    with pytest.raises(Exception) as exc_info:
        with db_session.begin_nested():
            med_invalido = Medicamento(nome="Sem dosagem")
            db_session.add(med_invalido)
            db_session.commit()
    
    logger.info("Exceção capturada: %s", str(exc_info.value))
    assert "NOT NULL constraint failed" in str(exc_info.value)
    logger.info("✓ Campos obrigatórios validados!")

def test_qr_code_nao_unico(db_session):
    logger.info("\n=== TESTE 3: QR Code não único ===")
    
    with db_session.begin_nested():
        db_session.add_all([
            Medicamento(
                nome="Dipirona",
                dosagem="500mg",
                peso=0.5,
                qr_code="MESMO_QR"
            ),
            Medicamento(
                nome="Ibuprofeno",
                dosagem="400mg",
                peso=0.4,
                qr_code="MESMO_QR"
            )
        ])
    
    resultados = db_session.query(Medicamento).count()
    assert resultados == 2, "Deveria permitir QR Codes repetidos"
    logger.info("✓ QR Codes repetidos permitidos!")

def test_representacao_string(db_session):
    logger.info("\n=== TESTE 4: Representação string ===")
    
    with db_session.begin_nested():
        med = Medicamento(
            nome="Omeprazol",
            dosagem="20mg",
            peso=0.2,
            qr_code="QR456"
        )
        db_session.add(med)
    
    registro = db_session.query(Medicamento).first()
    expected_repr = "<Medicamento(nome=Omeprazol, dosagem=20mg, peso=0.2)>"
    assert str(registro) == expected_repr, f"Representação incorreta: {str(registro)}"
    logger.info("✓ Representação string válida!")

def test_estrutura_tabela(test_engine):
    logger.info("\n=== TESTE 5: Validação da estrutura da tabela ===")
    
    inspector = inspect(test_engine)
    columns = inspector.get_columns('medicamento')
    
    colunas_esperadas = {
        'id': {'type': Integer, 'primary_key': True, 'nullable': False},
        'nome': {'type': String, 'nullable': False},
        'dosagem': {'type': String, 'nullable': False},
        'peso': {'type': Float, 'nullable': False},
        'qr_code': {'type': String, 'nullable': False}
    }
    
    for col in columns:
        col_name = col['name']
        assert col_name in colunas_esperadas, f"Coluna inesperada: {col_name}"
        specs = colunas_esperadas[col_name]
        
        assert isinstance(col['type'], specs['type']), f"Tipo incorreto para {col_name}"
        assert col['nullable'] == specs['nullable'], f"Nullable incorreto para {col_name}"
        if 'primary_key' in specs:
            assert col['primary_key'] == specs['primary_key'], f"PK incorreta para {col_name}"
    
    logger.info("✓ Estrutura da tabela validada!")

if __name__ == "__main__":
    pytest.main(["-v", __file__])
