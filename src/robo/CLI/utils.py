from yaspin import yaspin 
import keyboard 
import time

def executar_rotina_medicamento(robo, medicamento):
    """Executa a rotina completa para um medicamento selecionado"""
    with yaspin(text=f"Executando rotina para Medicamento {medicamento['medicamento']}...", color="green") as spinner:
        try:
            # Configurar velocidade padrão
            robo.set_speed(200, 200)
            robo.home()
            

            for i, ponto in enumerate(medicamento['pontos'], 1):
                # Converter coordenadas para float
                x = float(ponto['x'])
                y = float(ponto['y'])
                z = float(ponto['z'])
                r = float(ponto['r'])
                
                # Selecionar tipo de movimento
                if ponto['movimento'] == 'movj':
                    robo.movej_to(x, y, z, r, wait=True)
                elif ponto['movimento'] == 'movl':
                    robo.movel_to(x, y, z, r, wait=True)
                
                # Controlar ventosa
                if ponto['suctionCup'].lower() == 'on':
                    robo.suck(True)
                else:
                    robo.suck(False)
                
                # Pequena pausa para estabilização
                time.sleep(0.3)
                
                spinner.text = f"Medicamento {medicamento['medicamento']} - Ponto {i}/{len(medicamento['pontos'])} concluído"
            
            spinner.ok("✔ Rotina completa executada com sucesso!")
        except Exception as e:
            spinner.fail(f"❌ Falha na execução: {str(e)}")

        robo.home()

def controle_manual(robo, delta=20, interval=0.005):
    """Controle manual com movimentos do tipo MOVJ"""
    print("Modo de controle manual ativado (MOVJ). Use as teclas:")
    print("  ←/→: mover em X | ↑/↓: mover em Y | W/S: mover em Z")
    print("  A/D: ajustar rotação | Q: sair")
    
    while True:
        if keyboard.is_pressed('q'):
            print("Saindo do modo de controle manual.")
            break

        if keyboard.is_pressed('h'):
            robo.home();
        

        x, y, z, r, *_ = robo.pose()
        dx = dy = dz = dr = 0

        if keyboard.is_pressed('left'): dx = -delta
        if keyboard.is_pressed('right'): dx = delta
        if keyboard.is_pressed('up'): dy = delta
        if keyboard.is_pressed('down'): dy = -delta
        if keyboard.is_pressed('w'): dz = delta
        if keyboard.is_pressed('s'): dz = -delta
        if keyboard.is_pressed('a'): dr = -delta
        if keyboard.is_pressed('d'): dr = delta

        if dx or dy or dz or dr:
            robo.movej_to(
                x + dx,
                y + dy,
                z + dz,
                r + dr,
                wait=False
            )


