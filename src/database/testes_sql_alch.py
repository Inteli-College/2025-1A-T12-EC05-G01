import pytest

from sqlalchemy.exc import IntegrityError, OperationalError
from db_conexao import SessionLocal, engine  # Adicione engine aqui

from models.saida import Saidas
from models.prescricao_medicamento import PrescricaoMedicamento
from models.prescricao_aceita import PrescricaoAceita
from models.prescricao_on_hold import PrescricaoOnHold
from models.paciente import Paciente
from models.medico import Medico
from models.medicamento import Medicamento
from models.farmaceuticos import Farmaceutico
from models.estoque import Estoque
from models.perdas import Perdas
from db_conexao import Base

def clear_database():
    """Remove e recria toda a estrutura do banco de dados"""
    print("\n⏳ Reiniciando completamente o banco de dados...")
    
    try:
        # Etapa 1: Remover todas as tabelas
        print("🧨 Apagando estrutura existente...")
        Base.metadata.drop_all(engine)
        
        # Etapa 2: Criar novas tabelas com a estrutura atual
        print("🏗  Criando nova estrutura...")
        Base.metadata.create_all(engine)
        
        print("\n🎉 Banco de dados totalmente recriado!")
        
    except Exception as e:
        print(f"\n❌ Erro grave durante a reconstrução: {str(e)}")
        raise

def log_erro(etapa, erro):
    """Função auxiliar para log de erros"""
    print(f"\n❌ ERRO NA ETAPA: {etapa}")
    print(f"🔍 Detalhes: {str(erro)}")
    print("🔄 Realizando rollback...")

def test_medico():
    print("\n" + "="*60)
    print("🚀 Iniciando teste de Cadastro de Médico")
    print("="*60)
    
    db = SessionLocal()
    try:
        print("\n⚡ Criando novo médico...")
        novo_medico = Medico(
            nome="Dr. Carlos Silva",
            crm="CRM/SP-123456"
        )
        db.add(novo_medico)
        db.commit()
        print(f"✅ Médico criado | ID: {novo_medico.id}")

        print("\n🔍 Consultando médico no banco...")
        medico_db = db.query(Medico).filter_by(crm="CRM/SP-123456").first()
        
        assert medico_db is not None, "Médico não encontrado no banco"
        print(f"📄 Registro encontrado: {medico_db}")
        print(f"👨⚕ Detalhes: {medico_db.nome} (CRM: {medico_db.crm})")

    except IntegrityError as e:
        log_erro("Cadastro de Médico - Unique Constraint", e)
        db.rollback()
    except Exception as e:
        log_erro("Cadastro de Médico", e)
        db.rollback()
        raise
    finally:
        db.close()
        print("\n🔒 Conexão fechada")

def test_paciente():
    print("\n" + "="*60)
    print("🚀 Iniciando teste de Internação de Paciente")
    print("="*60)
    
    db = SessionLocal()
    try:
        print("\n⚡ Registrando novo paciente...")
        novo_paciente = Paciente(
            nome="Ana Claudia Santos",
            leito="Enf-405",
            hc="HC-987654"
        )
        db.add(novo_paciente)
        db.commit()
        print(f"✅ Paciente internado | ID: {novo_paciente.id}")

        print("\n🔍 Buscando paciente por HC...")
        paciente_db = db.query(Paciente).filter_by(hc="HC-987654").first()
        
        assert paciente_db is not None, "Paciente não encontrado"
        print(f"📄 Registro encontrado: {paciente_db}")
        print(f"👩⚕ Detalhes: {paciente_db.nome} (Leito: {paciente_db.leito})")

    except Exception as e:
        log_erro("Internação de Paciente", e)
        db.rollback()
        raise
    finally:
        db.close()
        print("\n🔒 Conexão fechada")

def test_medicamento():
    print("\n" + "="*60)
    print("🚀 Iniciando teste de Cadastro de Medicamento")
    print("="*60)
    
    db = SessionLocal()
    try:
        print("\n⚡ Cadastrando novo medicamento...")
        novo_medicamento = Medicamento(
            nome="Paracetamol",
            dosagem="500mg",
            peso=0.5,
            qr_code="QRPARA500"
        )
        db.add(novo_medicamento)
        db.commit()
        print(f"✅ Medicamento registrado | ID: {novo_medicamento.id}")

        print("\n🔍 Consultando medicamento...")
        medicamento_db = db.query(Medicamento).filter_by(nome="Paracetamol").first()
        
        assert medicamento_db is not None, "Medicamento não encontrado"
        print(f"📦 Detalhes: {medicamento_db.nome} ({medicamento_db.dosagem})")
        print(f"⚖ Peso: {medicamento_db.peso}g")
        print(f"🔖 QR Code: {medicamento_db.qr_code}")

    except Exception as e:
        log_erro("Cadastro de Medicamento", e)
        db.rollback()
        raise
    finally:
        db.close()
        print("\n🔒 Conexão fechada")

def test_estoque():
    print("\n" + "="*60)
    print("🚀 Iniciando teste de Controle de Estoque")
    print("="*60)
    
    db = SessionLocal()
    try:
        print("\n⚡ Etapa 1/2 - Cadastrando medicamento...")
        medicamento = Medicamento(
            nome="Dipirona", 
            dosagem="1g", 
            peso=1.0,
            qr_code="QRDIPI1000"
        )
        db.add(medicamento)
        db.commit()
        print(f"✅ Medicamento registrado | ID: {medicamento.id}")

        print("\n⚡ Etapa 2/2 - Adicionando ao estoque...")
        novo_estoque = Estoque(
            id_medicamento=medicamento.id,
            lote="LOTE-2024-05",
            quantidade=150,
            validade="2025-12-31",
            bin=15,
            fornecedor="Farmacolabs"
        )
        db.add(novo_estoque)
        db.commit()
        print(f"✅ Estoque atualizado | ID: {novo_estoque.id}")

        print("\n🔍 Verificando registro de estoque...")
        estoque_db = db.query(Estoque).filter_by(lote="LOTE-2024-05").first()
        
        assert estoque_db is not None, "Registro de estoque não encontrado"
        print(f"📦 Medicamento: {estoque_db.medicamento.nome}")
        print(f"📆 Validade: {estoque_db.validade}")
        print(f"📦 Quantidade: {estoque_db.quantidade} unidades")

    except Exception as e:
        log_erro("Controle de Estoque", e)
        db.rollback()
        raise
    finally:
        db.close()
        print("\n🔒 Conexão fechada")

def test_farmaceutico():
    print("\n" + "="*60)
    print("🚀 Iniciando teste de Cadastro de Farmacêutico")
    print("="*60)
    
    db = SessionLocal()
    try:
        print("\n⚡ Registrando novo farmacêutico...")
        novo_farmaceutico = Farmaceutico(nome="Dra. Julia Mendes")
        db.add(novo_farmaceutico)
        db.commit()
        print(f"✅ Farmacêutico cadastrado | ID: {novo_farmaceutico.id}")

        print("\n🔍 Consultando farmacêuticos...")
        farmaceutico_db = db.query(Farmaceutico).first()
        
        assert farmaceutico_db is not None, "Nenhum farmacêutico encontrado"
        print(f"👩⚕ Detalhes: {farmaceutico_db.nome}")

    except Exception as e:
        log_erro("Cadastro de Farmacêutico", e)
        db.rollback()
        raise
    finally:
        db.close()
        print("\n🔒 Conexão fechada")

def test_prescricao_completa():
    print("\n" + "="*60)
    print("🚀 Iniciando teste de Fluxo Completo de Prescrição")
    print("="*60)
    
    db = SessionLocal()
    try:
        print("\n⚡ Etapa 1/5 - Cadastrando profissionais e paciente...")
        medico = Medico(nome="Dr. Roberto Almeida", crm="CRM/RJ-654321")
        paciente = Paciente(nome="Pedro Costa", leito="UTI-03", hc="HC-112233")
        farmaceutico = Farmaceutico(nome="Farmac. Luiza Gomes")
        
        db.add_all([medico, paciente, farmaceutico])
        db.commit()
        print(f"👨⚕ Médico ID: {medico.id}")
        print(f"👤 Paciente ID: {paciente.id}")
        print(f"👩⚕ Farmacêutico ID: {farmaceutico.id}")

        print("\n⚡ Etapa 2/5 - Cadastrando medicamento...")
        medicamento = Medicamento(
            nome="Omeprazol", 
            dosagem="20mg", 
            peso=0.02,
            qr_code="QROME20"
        )
        db.add(medicamento)
        db.commit()
        print(f"💊 Medicamento ID: {medicamento.id}")

        print("\n⚡ Etapa 3/5 - Criando prescrição pendente...")
        presc_on_hold = PrescricaoOnHold(
            id_medico=medico.id,
            id_paciente=paciente.id
        )
        db.add(presc_on_hold)
        db.commit()
        print(f"📝 Prescrição pendente ID: {presc_on_hold.id}")

        print("\n⚡ Etapa 4/5 - Adicionando medicamento à prescrição...")
        presc_med = PrescricaoMedicamento(
            id_prescricao_on_hold=presc_on_hold.id,
            id_medicamento=medicamento.id,
            quantidade=10,
            status_medicamento="pendente"
        )
        db.add(presc_med)
        db.commit()
        print(f"💊 Medicamento na prescrição ID: {presc_med.id}")

        print("\n⚡ Etapa 5/5 - Validando prescrição...")
        presc_aceita = PrescricaoAceita(
            id_prescricao_on_hold=presc_on_hold.id,
            id_farmaceutico=farmaceutico.id
        )
        db.add(presc_aceita)
        db.commit()
        print(f"🖋 Prescrição validada ID: {presc_aceita.id}")

        print("\n🔍 Atualizando status do medicamento...")
        presc_med.id_prescricao_aceita = presc_aceita.id
        presc_med.status_medicamento = "dispensado"
        db.commit()
        print("🔄 Status atualizado para 'dispensado'")

        print("\n✅ Fluxo completo testado com sucesso!")

    except Exception as e:
        log_erro("Fluxo de Prescrição", e)
        db.rollback()
        raise
    finally:
        db.close()
        print("\n🔒 Conexão fechada")

def test_saidas_perdas():
    print("\n" + "="*60)
    print("🚀 Iniciando teste de Saídas e Perdas")
    print("="*60)
    
    db = SessionLocal()
    try:
        print("\n⚡ Etapa 1/4 - Cadastrando medicamento...")
        medicamento = Medicamento(
            nome="Amoxicilina", 
            dosagem="500mg", 
            peso=0.5,
            qr_code="QRAMOX500"
        )
        db.add(medicamento)
        db.commit()
        print(f"💊 Medicamento ID: {medicamento.id}")

        print("\n⚡ Etapa 2/4 - Adicionando ao estoque...")
        estoque = Estoque(
            id_medicamento=medicamento.id,
            lote="LOTE-PERDA-01",
            quantidade=100,
            validade="2024-12-31",
            bin=8,
            fornecedor="Biotec"
        )
        db.add(estoque)
        db.commit()
        print(f"📦 Estoque ID: {estoque.id} | Quantidade: {estoque.quantidade}")

        print("\n⚡ Etapa 3/4 - Registrando paciente...")
        paciente = Paciente(nome="Mariana Silva", leito="Enf-210", hc="HC-445566")
        db.add(paciente)
        db.commit()
        print(f"👤 Paciente ID: {paciente.id}")

        print("\n⚡ Etapa 4/4 - Registrando saída e perda...")
        saida = Saidas(
            id_estoque=estoque.id,
            id_paciente=paciente.id,
            quantidade=5
        )
        perda = Perdas(
            id_estoque=estoque.id,
            motivo="Quebra de estoque"
        )
        
        db.add_all([saida, perda])
        db.commit()
        print(f"📤 Saída ID: {saida.id} | Quantidade: {saida.quantidade}")
        print(f"📉 Perda ID: {perda.id} | Motivo: {perda.motivo}")

        print("\n🔍 Verificando registros...")
        saida_db = db.query(Saidas).get(saida.id)
        perda_db = db.query(Perdas).get(perda.id)
        
        assert saida_db is not None, "Saída não registrada"
        assert perda_db is not None, "Perda não registrada"
        print("✅ Todas as transações validadas")

    except Exception as e:
        log_erro("Saídas e Perdas", e)
        db.rollback()
        raise
    finally:
        db.close()
        print("\n🔒 Conexão fechada")

if __name__ == "__main__":
    try:
        # Etapa crítica: Recria o banco com a nova estrutura
        clear_database()
        
        # Execução dos testes
        test_medico()
        test_paciente()
        test_medicamento()
        test_estoque()
        test_farmaceutico()
        test_prescricao_completa()
        test_saidas_perdas()
        
        print("\n🎉 Todos os testes foram executados com sucesso!")
    except Exception as e:
        print(f"\n💥 Falha crítica: {str(e)}")
        print("Testes interrompidos devido a erros graves!")
