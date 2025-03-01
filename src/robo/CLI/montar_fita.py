import inquirer
from CLI.executar_rotina import executar_rotina_medicamento 
from time import sleep

constante_z = 12.0

def montar_fita(robo, medicamentos):
    """
    Permite ao usuário montar a fita de medicamentos escolhendo os tipos e as quantidades desejadas.
    Para cada item selecionado, a função executa a rotina do medicamento a quantidade de vezes especificada.
    """
    # Lista para armazenar os medicamentos e suas quantidades
    fita = {}
    
    while True:
        opcao = inquirer.prompt([
            inquirer.List(
                'opcao',
                message="Montar fita: Selecione a ação",
                choices=[
                    ("Adicionar medicamento", "adicionar"),
                    ("Realizar montagem da fita", "finalizar"),
                    ("Cancelar montagem da fita", "cancelar")
                ],
                carousel=True
            )
        ])['opcao']

        if opcao == "finalizar":
            break
        elif opcao == "cancelar":
            break

        # Seleciona o medicamento (utilizando os medicamentos carregados previamente)
        med = inquirer.prompt([
            inquirer.List(
                'medicamento',
                message="Selecione o medicamento",
                choices=[(f"Medicamento {m['medicamento']}", m) for m in medicamentos],
                carousel=True
            )
        ])['medicamento']

        # Permite que o usuário informe a quantidade desejada
        qtd_str = inquirer.prompt([
            inquirer.Text(
                'qtd',
                message="Digite a quantidade de medicamentos"
            )
        ])['qtd']

        try:
            qtd = int(qtd_str)
        except ValueError:
            print("Quantidade inválida. Tente novamente.")
            continue

        if med['medicamento'] not in fita:
            fita[med['medicamento']] = qtd
        else:
            fita[med['medicamento']] += qtd

        print("------------------------------")
        print("Fita atual:")
        print("------------------------------")
        for key, value in fita.items():
            print(f"Medicamento: {key}, quantidade: {value}")
        print("------------------------------")

    # Se houver itens na fita, inicia o processo de montagem
    if fita and opcao != "cancelar":
        print("Montagem da fita iniciada...")
        for medicamento, quantidade in fita.items():
            for i in range(quantidade):
                delta_z = i *  constante_z
                print(f"Iniciando rotina para Medicamento {medicamento} - Unidade {i+1} de {quantidade}")
                executar_rotina_medicamento(robo, medicamento, medicamentos, delta_z)
                
                x, y, z, r, *_ = robo.pose()
                
                
                ## Feito para que a montagem não seja iniciada antes que o robô chegue na home
                while round(x, 1) != 242.2 and round(z, 1) != 151.4: ## Essa é a posição home aproximada
                    x, y, z, r, *_ = robo.pose()
                    ## print(f"X: {x:.1f} Z: {z:.1f}")
                
        print("Montagem da fita concluída!")
    else:
        print("Nenhum medicamento selecionado para montagem da fita.")