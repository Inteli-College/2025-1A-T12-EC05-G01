import pytest
from sqlalchemy import create_engine, inspect, String, DateTime, Integer, Text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from datetime import datetime, timezone
import json
from database.db_conexao import Base
from database.models.logs import Logs
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

def test_criacao_log(db_session):
    logger.info("\n=== TESTE 1: Criação básica de log ===")
    
    log_data = {
        "level": "INFO",
        "origin": "auth-service",
        "action": "USER_LOGIN",
        "description": "Login de usuário bem-sucedido",
        "status": "SUCCESS",
        "log_data": json.dumps({"user_id": 123, "ip": "192.168.1.1"})
    }
    
    novo_log = Logs(**log_data)
    db_session.add(novo_log)
    db_session.commit()
    
    registro = db_session.query(Logs).first()
    
    assert registro is not None, "Log não foi persistido"
    assert registro.level == log_data["level"], "Nível incorreto"
    assert registro.origin == log_data["origin"], "Origem incorreta"
    assert isinstance(registro.timestamp, datetime), "Timestamp não gerado"
    logger.info("✓ Log básico criado: %s", registro)

def test_campos_obrigatorios(db_session):
    logger.info("\n=== TESTE 2: Validação de campos obrigatórios ===")
    
    with pytest.raises(Exception) as exc_info:
        logger.warning("Tentando criar log incompleto...")
        log_invalido = Logs()  # Todos os campos obrigatórios faltando
        db_session.add(log_invalido)
        db_session.commit()
    
    logger.info("Exceção capturada: %s", str(exc_info.value))
    logger.info("✓ Campos obrigatórios validados")

def test_validacao_campos(db_session):
    logger.info("\n=== TESTE 3: Validação de valores dos campos ===")
    
    # Teste de status inválido
    with pytest.raises(Exception) as exc_info:
        log_invalido = Logs(
            level="INFO",
            origin="system",
            action="STARTUP",
            description="Teste",
            status="INVALID_STATUS"  # Valor inválido
        )
        db_session.add(log_invalido)
        db_session.commit()
    
    assert "CHECK constraint failed" in str(exc_info.value)
    logger.info("✓ Validação de status funcionando")


def test_log_data_field(db_session):
    logger.info("\n=== TESTE 4: Teste do campo log_data ===")
    
    data = {
        "user_id": 456,
        "details": {"attempts": 3, "device": "mobile"}
    }
    
    novo_log = Logs(
        level="WARNING",
        origin="auth",
        action="LOGIN_ATTEMPT",
        description="Múltiplas tentativas de login",
        log_data=json.dumps(data)
    )
    db_session.add(novo_log)
    db_session.commit()
    
    registro = db_session.query(Logs).first()
    loaded_data = json.loads(registro.log_data)
    
    assert loaded_data["user_id"] == 456, "Dados incorretos"
    assert "device" in loaded_data["details"], "Estrutura de dados inválida"
    logger.info("✓ Dados armazenados corretamente")

def test_timestamp_automatico(db_session):
    logger.info("\n=== TESTE 5: Verificação de timestamp automático ===")
    
    before_create = datetime.now(timezone.utc)
    novo_log = Logs(
        level="DEBUG",
        origin="test",
        action="TIMESTAMP_TEST",
        description="Teste de timestamp automático",
        status="SUCCESS"
    )
    db_session.add(novo_log)
    db_session.commit()
    
    registro = db_session.query(Logs).first()
    # Tolerância de 2 segundos para diferenças de tempo
    assert abs((registro.timestamp.replace(tzinfo=timezone.utc) - before_create).total_seconds() < 2)
    logger.info("✓ Timestamp automático funcionando")


def test_status_default(db_session):
    logger.info("\n=== TESTE 6: Verificação de valor padrão para status ===")
    
    novo_log = Logs(
        level="INFO",
        origin="system",
        action="DEFAULT_STATUS_TEST",
        description="Teste de valor padrão"
    )
    db_session.add(novo_log)
    db_session.commit()
    
    registro = db_session.query(Logs).first()
    assert registro.status == "SUCCESS", "Valor padrão de status incorreto"
    logger.info("✓ Valor padrão para status funcionando")

if __name__ == "__main__":
    pytest.main(["-v", __file__])
