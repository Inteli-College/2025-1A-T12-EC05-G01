from fastapi import HTTPException
from flask import Blueprint, request
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from ...models.prescricao_aceita import PrescricaoAceita
from ...models.prescricao_medicamento import PrescricaoMedicamento
from ...models.paciente import Paciente
from ...models.prescricao_on_hold import PrescricaoOnHold
from ...models.medicamento import Medicamento
from ....database.db_conexao import SessionLocal

fitas_routes = Blueprint('fitas', __name__, url_prefix="/fitas")

@fitas_routes.route("/aguardando-selagem", methods=["GET"])
def FitasAguardandoSelagem():
    db = SessionLocal()
    try:
        prescricoes_aceitas = db.query(PrescricaoAceita).options(
            joinedload(PrescricaoAceita.prescricao_on_hold).joinedload(PrescricaoOnHold.paciente),
            joinedload(PrescricaoAceita.prescricoes_medicamentos).joinedload(PrescricaoMedicamento.medicamento)
        ).filter(
            PrescricaoAceita.status_prescricao.in_(['aguardando_selagem'])
        ).all()

        fitas = []
        
        for prescricao in prescricoes_aceitas:
            fitas.append({
                'id': prescricao.id,
                'nome': prescricao.prescricao_on_hold.paciente.nome,
                'dateTime': prescricao.prescricao_on_hold.data_prescricao.strftime('%d/%m/%Y, %H:%M'),
                'medicamentos': [
                    {
                        'medicamento': f"{pm.medicamento.nome} {pm.medicamento.dosagem}",
                        'quantidade': pm.quantidade
                    }
                    for pm in prescricao.prescricoes_medicamentos
                    if pm.status_medicamento in ['aprovado']
                ]
            })

            return {"fitas": fitas}, 200
       
    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@fitas_routes.route("/aguardando-triagem", methods=["GET"])
def FitasAguardandoTriagem():
    db = SessionLocal()
    try:
        prescricoes_on_hold = db.query(PrescricaoOnHold).options(
            joinedload(PrescricaoOnHold.paciente),
            joinedload(PrescricaoOnHold.medico),
            joinedload(PrescricaoOnHold.prescricoes_medicamentos).joinedload(PrescricaoMedicamento.medicamento)
        ).outerjoin(
            PrescricaoAceita, PrescricaoAceita.id_prescricao_on_hold == PrescricaoOnHold.id
        ).filter(
            PrescricaoAceita.id.is_(None),
            PrescricaoMedicamento.status_medicamento == "pendente"
            
        ).all()

        fitas = []
        
        for prescricao in prescricoes_on_hold:
            medicamentos = [
                {
                    'medicamento': f"{pm.medicamento.nome} {pm.medicamento.dosagem}",
                    'quantidade': pm.quantidade,
                    'status_medicamento': pm.status_medicamento,
                    'id_medicamento': pm.id,
                }
                for pm in prescricao.prescricoes_medicamentos 
                if pm.status_medicamento == "pendente"
            ]
            
            if medicamentos:
                fitas.append({
                    'id_prescricao': prescricao.id,
                    'nome_paciente': prescricao.paciente.nome,
                    'hc_paciente': prescricao.paciente.hc,
                    'nome_medico': prescricao.medico.nome,
                    'dateTime': prescricao.data_prescricao.strftime('%d/%m/%Y, %H:%M'),
                    'medicamentos': medicamentos
                })

        return {"fitas": fitas}, 200
       
    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@fitas_routes.route("/aguardando-separacao", methods=["GET"])
def FitasAguardandoSeparacao():
    db = SessionLocal()
    try:
        prescricoes_aceitas = db.query(PrescricaoAceita).options(
            joinedload(PrescricaoAceita.prescricao_on_hold).joinedload(PrescricaoOnHold.paciente),
            joinedload(PrescricaoAceita.prescricoes_medicamentos).joinedload(PrescricaoMedicamento.medicamento)
        ).filter(
            PrescricaoAceita.status_prescricao.in_(['aguardando_separacao', 'erro_separacao']),
            PrescricaoMedicamento.status_medicamento == "aprovado"
        ).all()

        fitas = []
        
        for prescricao in prescricoes_aceitas:

            medicamentos = [
                {
                    'medicamento': f"{pm.medicamento.nome} {pm.medicamento.dosagem}",
                    'quantidade': pm.quantidade
                }
                for pm in prescricao.prescricoes_medicamentos
            ]

            if medicamentos:
                fitas.append({
                    'id': prescricao.id,
                    'nome': prescricao.prescricao_on_hold.paciente.nome,
                    'dateTime': prescricao.prescricao_on_hold.data_prescricao.strftime('%d/%m/%Y, %H:%M'),
                    'medicamentos': medicamentos
                })

        return {"fitas": fitas}, 200
       
    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@fitas_routes.route("/on-hold", methods=["GET"])
def FitasOnHold():
    db = SessionLocal()
    try:
        prescricoes_on_hold = db.query(PrescricaoOnHold).options(
            joinedload(PrescricaoOnHold.paciente),
            joinedload(PrescricaoOnHold.medico),
            joinedload(PrescricaoOnHold.prescricoes_medicamentos).joinedload(PrescricaoMedicamento.medicamento)
        ).outerjoin(
            PrescricaoAceita, PrescricaoAceita.id_prescricao_on_hold == PrescricaoOnHold.id
        ).filter(
            PrescricaoOnHold.prescricoes_medicamentos.any(
                PrescricaoMedicamento.status_medicamento == "dispensado"
            )
        ).all()

        fitas = []
        
        for prescricao in prescricoes_on_hold:
            medicamentos = [
                {
                    'medicamento': f"{pm.medicamento.nome} {pm.medicamento.dosagem}",
                    'quantidade': pm.quantidade,
                    'status_medicamento': pm.status_medicamento,
                    'id_medicamento': pm.id,
                }
                for pm in prescricao.prescricoes_medicamentos 
                if pm.status_medicamento == "dispensado"
            ]
            
            if medicamentos:
                fitas.append({
                    'id_prescricao': prescricao.id,
                    'nome_paciente': prescricao.paciente.nome,
                    'hc_paciente': prescricao.paciente.hc,
                    'nome_medico': prescricao.medico.nome,
                    'dateTime': prescricao.data_prescricao.strftime('%d/%m/%Y, %H:%M'),
                    'medicamentos': medicamentos
                })

        return {"fitas": fitas}, 200
       
    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@fitas_routes.route("/atualizar-status-medicamento", methods=["PUT"])
def AtualizarStatusMedicamento():
    db = SessionLocal()
    try:
        data = request.json
        medicamento_id = data.get("id")
        novo_status = data.get("status")
        
        if not medicamento_id or not novo_status:
            raise HTTPException(status_code=400, detail="ID e status são obrigatórios")
            
        medicamento = db.query(PrescricaoMedicamento).filter(PrescricaoMedicamento.id == medicamento_id).first()
        
        if not medicamento:
            raise HTTPException(status_code=404, detail=f"Medicamento com ID {medicamento_id} não encontrado")
            
        medicamento.status_medicamento = novo_status
        db.commit()
        
        return {"message": f"Status do medicamento {medicamento_id} atualizado para {novo_status}"}, 200
        
    except HTTPException as e:
        db.rollback()
        return {"error": e.detail}, e.status_code
    except Exception as e:
        db.rollback()
        return {"error": str(e)}, 500
    finally:
        db.close()

@fitas_routes.route("/diagnostico", methods=["GET"])
def DiagnosticoFitas():
    db = SessionLocal()
    try:
        # 1. Verificar todas as prescrições aceitas
        prescricoes_aceitas = db.query(PrescricaoAceita).all()
        
        # 2. Verificar os medicamentos associados às prescrições
        prescricoes_medicamento = db.query(PrescricaoMedicamento).filter(
            PrescricaoMedicamento.id_prescricao_aceita.isnot(None)
        ).all()
        
        resultado = {
            "total_prescricoes_aceitas": len(prescricoes_aceitas),
            "total_medicamentos_em_prescricoes": len(prescricoes_medicamento),
            "detalhes_prescricoes": [],
            "problemas_encontrados": []
        }
        
        # Verificar cada prescrição aceita
        for pa in prescricoes_aceitas:
            medicamentos = db.query(PrescricaoMedicamento).filter(
                PrescricaoMedicamento.id_prescricao_aceita == pa.id
            ).all()
            
            medicamentos_detalhes = []
            for med in medicamentos:
                med_info = db.query(Medicamento).filter(Medicamento.id == med.id_medicamento).first()
                if med_info:
                    medicamentos_detalhes.append({
                        "id": med.id,
                        "nome": f"{med_info.nome} {med_info.dosagem}",
                        "status": med.status_medicamento,
                        "quantidade": med.quantidade
                    })
                else:
                    resultado["problemas_encontrados"].append(f"Medicamento ID {med.id_medicamento} não encontrado para prescrição {med.id}")
                    
            # Procurar por medicamentos que têm o id_prescricao_on_hold mas não id_prescricao_aceita
            medicamentos_on_hold = db.query(PrescricaoMedicamento).filter(
                PrescricaoMedicamento.id_prescricao_on_hold == pa.id_prescricao_on_hold,
                PrescricaoMedicamento.id_prescricao_aceita.is_(None)
            ).all()
            
            if medicamentos_on_hold:
                resultado["problemas_encontrados"].append(
                    f"Prescrição {pa.id} tem {len(medicamentos_on_hold)} medicamentos com id_prescricao_on_hold={pa.id_prescricao_on_hold} "
                    f"mas sem id_prescricao_aceita definido"
                )
            
            prescricao_detalhes = {
                "id": pa.id,
                "id_prescricao_on_hold": pa.id_prescricao_on_hold,
                "status": pa.status_prescricao,
                "total_medicamentos": len(medicamentos),
                "medicamentos": medicamentos_detalhes
            }
            
            resultado["detalhes_prescricoes"].append(prescricao_detalhes)
            
        return resultado, 200
        
    except Exception as e:
        print(f"Erro no diagnóstico: {str(e)}")
        return {"error": str(e)}, 500
    finally:
        db.close()