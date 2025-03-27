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