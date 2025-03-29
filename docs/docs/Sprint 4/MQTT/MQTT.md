---
title: MQTT
sidebar_position: 1
slug: /mqtt
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Protocolo MQTT 

&emsp;O chamado "protocolo MQTT", ou "Message Queueing Telemetry Transport", é um protocolo de comunicação amplamente utilizado em dispositivos de Internet das Coisas. Isso se deve, em grande parte, ao quão leve e eficiente o protocolo é [[1]](https://www.f5.com/pt_br/glossary/mqtt). Neste protocolo, um "publisher" publica informações em um determinado tópico e um "listener" recebe essas informações. Além disso, é importante ressaltar que tudo isso é intermediado por um "broker".

## Protocolo MQTT para comunicação em tempo real

&emsp;No presente projeto, o protocolo MQTT foi o escolhido para lidar com toda a comunicação em tempo real que deve ser feita entre o robô e o software que roda na WEB. Outra possibilidade era utilizar, por exemplo, a comunicação via websocket. Entretanto, o MQTT foi escolhido por facilitar o processo, permitindo um setup de tecnologias mais rápido e robusto, além de permitir a utilização de brokers públicos. 

&emsp;Dessa forma, na quarta sprint, foi implementado o protocolo MQTT no projeto, contando com publicações em dois tópicos:
* dobot/status: Aqui, o Dobot publica constantemente o seu estado de conexão. Assim, é possível avisar ao usuário caso a conexão com o robô seja perdida.
* dobot/acoes: Neste tópico, o Dobot publica suas ações enquanto realiza a montagem de uma fita de medicamentos. Ele publica, por exemplo, qual medicamento está pegando, em qual ponto está, etc. Isso é usado para que o usuário consiga acompanhar em tempo real o que o robô está fazendo.

&emsp;Para a sprint 4 do projeto, apenas o primeiro tópico foi implementado em sua completude, podendo, de fato, ser utilizado para visualizar se o robô está conectado através das telas no frontend. No tópico de status, o robô publica a mensagem "conectado" ou "desconectado". A partir disso, temos um "listener" no frontend que atualiza o ícone de conexão do Dobot em tempo real de acordo com essa estado. Caso o robô esteja desconectado, o usuário pode apertar o botão de reconectar. 

<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 1 - NavBar com status do robô</strong></p>
  <img 
    src={useBaseUrl('/img/dobot_status.png')} 
    alt="NavBar com status do robô" 
    title="NavBar com status do robô" 
    style={{ maxWidth: '80%', height: 'auto' }}
  />
  <p>Fonte: Material produzido por Dose Certa (2025)</p>
</div>

## Próximos passos

&emsp;Por fim, com a funcionalidade de visualização de status do Dobot já completamente implementada, o próximo passo de desenvolvimento que envolve o MQTT é desenvolver a interface que permite ao usuário visualizar quais ações o robô está realizando em tempo real durante a separação de uma fita de medicamentos. Tal processo irá permitir, por exemplo, que o usuário inicie ou pause uma montagem e tenha mais informações acerca dos logs que o robô gera durante o seu funcionamento.

## Bibliografia

[[1]](https://www.f5.com/pt_br/glossary/mqtt) F5 Networks. O que é MQTT? Disponível em: https://www.f5.com/pt_br/glossary/mqtt. Acesso em: 29 mar. 2025. 
