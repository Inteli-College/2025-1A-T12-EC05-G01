from time import sleep
from app_dobot.functions.executar_rotina import executar_rotina_medicamento

CONSTANTE_Z = 12.0

def finalizar_montagem(robo, medicamentos, fita, callback):
    """Executa a montagem completa da fita com publicação de status"""
    if not fita:
        callback("montagem_cancelada", {"motivo": "Fita vazia"})
        return {"status": "error", "message": "Sem medicamentos na fita"}
    
    callback("inicio_montagem", {
        "total_medicamentos": len(fita),
        "medicamentos": list(fita.keys())
    })
    
    for medicamento, quantidade in fita.items():
        callback("iniciando_medicamento", {
            "medicamento": medicamento,
            "quantidade": quantidade
        })
        
        for i in range(quantidade):
            delta_z = i * CONSTANTE_Z
            
            callback("iniciando_unidade", {
                "medicamento": medicamento,
                "unidade_atual": i + 1,
                "total_unidades": quantidade,
                "delta_z": delta_z
            })
            
            success = executar_rotina_medicamento(
                robo, medicamento, medicamentos, delta_z,
                callback=callback,
                tentativas=0,
                max_tentativas=3
            )
            
            if not success:
                callback("falha_unidade", {
                    "medicamento": medicamento,
                    "unidade_atual": i + 1,
                    "motivo": "Falha na execução da rotina"
                })
                return {
                    "status": "error",
                    "message": f"Falha ao executar rotina para {medicamento}"
                }
            
            callback("unidade_concluida", {
                "medicamento": medicamento,
                "unidade_atual": i + 1,
                "total_unidades": quantidade
            })
            
            # Verificação de home com publicação de status
            robo.home()
            callback("retorno_home", {})
            x, y, z, r, *_ = robo.pose()
            while round(x, 1) != 242.2 or round(z, 1) != 151.4:
                x, y, z, r, *_ = robo.pose()
                sleep(0.1)
    
    callback("fim_montagem", {
        "status": "success",
        "message": "Montagem da fita concluída"
    })
    return {"status": "success", "message": "Montagem da fita concluída"}