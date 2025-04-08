---
title: Monitoramento de ações do Dobot
sidebar_position: 1
slug: /monitoramento-acoes
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Monitoramento de ações do Dobot

&emsp;Para a quinta sprint do projeto, um dos focos do desenvolvimento foi a criação de um sistema de monitoramento de ações para o Dobot utilizando o protocolo MQTT de comunicação. Com este protocolo, o Dobot envia constantemente a ação que está executando no momento e essa ação fica disponível para o usuário no frontend da aplicação. A ideia aqui é que o usuário sempre tenha ciência do que o robô está fazendo e também seja alertado de eventuais erros. 

## Formato de envio de dados

&emsp;Os dados são enviados via protocolo MQTT para o tópico dobot/acoes:

```python
def publicar_acao_mqtt(acao, topico='dobot/acoes' ,detalhes=None):
    """Publica uma ação do Dobot via MQTT com estrutura JSON"""
    if detalhes is None:
        detalhes = {}
    payload = {
        "acao": acao,
        "timestamp": datetime.now().isoformat(),
        "detalhes": detalhes
    }
    current_app.mqtt.publish(topico, json.dumps(payload), retain=True)
```

&emsp;Com isso, o frontend pode se conectar neste mesmo tópico, receber as mensagens e as mostrar na tela da seguinte maneira:

<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 1 - Visualização de ações do Dobot</strong></p>
  <img 
    src={useBaseUrl('/img/acoes_dobot.jpeg')} 
    alt="Visualização de ações do Dobot" 
    title="Visualização de ações do Dobot" 
    style={{ maxWidth: '80%', height: 'auto' }}
  />
  <p>Fonte: Elaborado pelo grupo Dose Certa (2025)</p>
</div>

&emsp;Com a implementação do sistema de monitoramento via MQTT, é possível oferecer aos farmacêuticos uma interface mais transparente e com mais informações, porém sem ficar poluída. Essa funcionalidade contribui diretamente para a segurança e previsibilidade do sistema, que são alguns dos requisitos não-funcionais do sistema. No futuro, o monitoramento pode ser expandido com recursos adicionais, como histórico de ações, filtros por tipo de operação e integração com sistemas de notificação em caso de falhas ou anomalias.



