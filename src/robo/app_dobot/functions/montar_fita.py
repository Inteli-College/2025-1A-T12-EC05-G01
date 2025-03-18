# functions/montar_fita.py

def montar_fita(robo, medicamentos, fita, constante_z=12.0):
    """
    Realiza a montagem da fita de medicamentos.
    """
    if not fita:
        return {"status": "erro", "mensagem": "Nenhum medicamento selecionado para montagem da fita."}

    print("Montagem da fita iniciada...")
    for medicamento, quantidade in fita.items():
        for i in range(quantidade):
            delta_z = i * constante_z
            print(f"Iniciando rotina para Medicamento {medicamento} - Unidade {i+1} de {quantidade}")
            executar_rotina_medicamento(robo, medicamento, medicamentos, delta_z)

            x, y, z, r, *_ = robo.pose()

            # Espera o robô retornar à posição home
            while round(x, 1) != 242.2 and round(z, 1) != 151.4:  # Posição home aproximada
                x, y, z, r, *_ = robo.pose()

    print("Montagem da fita concluída!")
    return {"status": "sucesso", "mensagem": "Montagem da fita concluída!"}