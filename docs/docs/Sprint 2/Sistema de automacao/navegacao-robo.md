---
title: Navegação do robô 
sidebar_position: 3
slug: /navegacao-robo
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Com os pontos pré-definidos sendo carregados em um arquivo JSON, foi criado uma base para ser possível manipular o robô para que ele se mova da maneira desejada. A partir do uso da biblioteca `pydobot` e da criação da seguinte função `executar_rotina_medicamento`, foi possível executar os primeiros comandos para que o robô navegue para os pontos previamente definidos.

```python
def executar_rotina_medicamento(robo, medicamento):
    """Executa a rotina completa para um medicamento selecionado, 
       iterando por cada ponto do medicamento passado e levando o robô
       para tal ponto. Também realiza verificação se o movimento é 
       linear ou por junta, e se o suctionCup está ativo ou não.
       Manda o robô para home antes e depois de pegar o medicamento."""
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
                
                
                spinner.text = f"Medicamento {medicamento['medicamento']} - Ponto {i}/{len(medicamento['pontos'])} concluído"
            
            spinner.ok("✔ Rotina completa executada com sucesso!")
        except Exception as e:
            spinner.fail(f"❌ Falha na execução: {str(e)}")

        robo.home()
```

A função acima itera sobre os pontos definidos para o medicamento selecionado. Para cada ponto, há a **conversão das coordenadas** para o tipo float, **seleção do tipo de movimento** (movj ou movl), **controle da ventosa** (ativa ou inativa) e um **feedback visual** da execução do código no terminal. Após percorrer todos os pontos, a rotina finaliza retornando o robô à posição "home", preparando o sistema para a próxima operação e mitigando erros.

Já o código a seguir atua como um suporte para os comandos de navegação, criando funções a partir da biblioteca `pydobot`.


```python 
import pydobot

class Dobot(pydobot.Dobot):
    """
    Classe que extende a classe inerente à biblioteca pydobot
    A biblioteca pydobot deixa de implementar algumas funções importantes
    que podem ser encontradas aqui. Um exemplo é a função home(), que manda 
    o robô para a home.
    Outras funções que podem ser implementadas podem ser encontradas nos
    enums da biblioteca e nos CommunicationProtocolIDs. 
    """
    def __init__(self, port=None, verbose=False):
        super().__init__(port=port, verbose=verbose)

    def movej_to(self, x, y, z, r, wait=True):
        super()._set_ptp_cmd(x, y, z, r, mode=pydobot.enums.PTPMode.MOVJ_XYZ, wait=wait)

    def movel_to(self, x, y, z, r, wait=True):
        super()._set_ptp_cmd(x, y, z, r, mode=pydobot.enums.PTPMode.MOVL_XYZ, wait=wait)    
        
    def home(self):
        msg = pydobot.message.Message()
        msg.id = pydobot.enums.CommunicationProtocolIDs.CommunicationProtocolIDs.SET_HOME_CMD
        msg.ctrl = pydobot.enums.ControlValues.ControlValues.ONE
        return super()._send_command(msg)
    
    def set_speed(self, speed, acceleration):
        super().speed(speed, acceleration)

    def clear_all_alarms(self):
        msg = pydobot.message.Message()
        msg.id = pydobot.enums.CommunicationProtocolIDs.CommunicationProtocolIDs.CLEAR_ALL_ALARMS_STATE
        msg.ctrl = pydobot.enums.ControlValues.ControlValues.ONE
        return super()._send_command(msg)

    def get_alarm_state(self):
        msg = pydobot.message.Message()
        msg.id = pydobot.enums.CommunicationProtocolIDs.CommunicationProtocolIDs.GET_ALARMS_STATE
        msg.ctrl = pydobot.enums.ControlValues.ControlValues.ONE
        return super()._send_command(msg)




if __name__ == "__main__":
    robo = Dobot(port="COM6", verbose=False)
    
```


Os códigos apresentados nesta seção demonstram como a navegação do robô é iniciada a partir dos pontos pré-definidos e como a função `executar_rotina_medicamento` realiza os movimentos, diferenciando entre comandos lineares e por juntas, além de controlar o sistema de sucção. No entanto, é importante ressaltar que esse trecho não abrange toda a funcionalidade de navegação do sistema. Outras partes do código, que complementam e integram a operação completa do robô, serão apresentadas na próxima seção.

:::tip Próxima Seção
Na próxima seção, haverá a explicação detalhada do funcionamento da CLI e das principais funções que compõem o fluxo completo de controle do robô. Esses componentes adicionais são fundamentais para a operação integrada do sistema e serão abordados com exemplos e análises que facilitam o entendimento do fluxo completo de execução.
:::