from fastapi import HTTPException
from flask import Blueprint, request
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from ...models.prescricao_aceita import PrescricaoAceita
from ...models.prescricao_medicamento import PrescricaoMedicamento
from ...models.paciente import Paciente
from ...models.prescricao_on_hold import PrescricaoOnHold
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
                        'id': pm.id,
                        'medicamento': f"{pm.medicamento.nome} {pm.medicamento.dosagem}",
                        'quantidade': pm.quantidade,
                        'status': pm.status_medicamento
                    }
                    for pm in prescricao.prescricoes_medicamentos
                    if pm.status_medicamento in ['aprovado', 'em_separacao', 'separado']
                ]
            })

        return {"fitas": fitas}, 200
       
    except HTTPException as e:
        return {"error": e.detail}, e.status_code
    except Exception as e:
        return {"error": str(e)}, 500
    finally:
        db.close()

@fitas_routes.route("/aguardando-triagem/<status_med>", methods=["GET"])
def FitasAguardandoTriagem(status_med):
    db = SessionLocal()
    try:
        prescricoes_on_hold = db.query(PrescricaoOnHold).options(
            joinedload(PrescricaoOnHold.paciente),
            joinedload(PrescricaoOnHold.medico),
            joinedload(PrescricaoOnHold.prescricoes_medicamentos).joinedload(PrescricaoMedicamento.medicamento)
        ).outerjoin(
            PrescricaoAceita, PrescricaoAceita.id_prescricao_on_hold == PrescricaoOnHold.id
        )

        if status_med == "pendente":
            prescricoes_on_hold = prescricoes_on_hold.join(PrescricaoMedicamento).filter(
                PrescricaoAceita.id.is_(None),
                PrescricaoMedicamento.status_medicamento == "pendente"
            )
        elif status_med == "dispensado":
            prescricoes_on_hold = prescricoes_on_hold.join(PrescricaoMedicamento).filter(
                PrescricaoMedicamento.status_medicamento == "dispensado"
            )

        prescricoes_on_hold = prescricoes_on_hold.all()

        fitas = []
        
        for prescricao in prescricoes_on_hold:
            fitas.append({
                'id_prescricao': prescricao.id,
                'nome_paciente': prescricao.paciente.nome,
                'hc_paciente': prescricao.paciente.hc,
                'nome_medico': prescricao.medico.nome,
                'dateTime': prescricao.data_prescricao.strftime('%d/%m/%Y, %H:%M'),
                'medicamentos': [
                    {
                        'medicamento': f"{pm.medicamento.nome} {pm.medicamento.dosagem}",
                        'quantidade': pm.quantidade,
                        'status_medicamento': pm.status_medicamento,
                        'id_medicamento': pm.id,
                    }
                    for pm in prescricao.prescricoes_medicamentos
                    if pm.status_medicamento == status_med
                ]
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