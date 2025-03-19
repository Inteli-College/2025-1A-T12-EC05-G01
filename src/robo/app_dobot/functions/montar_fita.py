from time import sleep
from CLI.executar_rotina import executar_rotina_medicamento

CONSTANTE_Z = 12.0

def adicionar_medicamento(fita, medicamento, quantidade):
    if medicamento not in fita:
        fita[medicamento]= quantidade 
    else:
        fita[medicamento] += quantidade

    print(f"Medicamento {medicamento} adicionado a fita {fita}")
    return fita

def cancelar_montagem(fita):
    fita.clear()
    print("Montagem da fita cancelada")
    return fita

def finalizar_montagem(robo, medicamentos, fita):
    if not fita:
        return {"status": "error", "message": "Sem medicamentos na fita"}
    
    print ("Montagem da fita iniciada...")

    for medicamento, quantidade in fita.items():
        for i in range(quantidade):

            delta_z = i * CONSTANTE_Z
            
            print(f"Iniciando rotina para medicamento {medicamento} - Unidade {i + 1} de{quantidade}")

            success = executar_rotina_medicamento(robo, medicamento, medicamentos, delta_z)

            if not success:
                return {"status": "error", "message": f"Falha ao executar rotina for {medicamento}"}
            
            x, y, z, r *_ = robo.pode()
            sleep(0.1)


    print("Montagem da fita concluida")
    return { "status": "success", "message": "Montagem da fita concluida"}