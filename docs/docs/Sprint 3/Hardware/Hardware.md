---
title: Hardware Implementado
sidebar_position: 2
slug: /hardware
---

import useBaseUrl from '@docusaurus/useBaseUrl';

## Hardware produzido e testado

&emsp;  Durante o desenvolvimento da Sprint 3 do projeto, foi necessário implementar e testar o hardware do sistema robótico, incluindo o robô e seus sensores periféricos.<br/>
&emsp; O sistema foi capaz de receber comandos enviados pelo usuário para pegar o medicamento solicitado, ler o QR Code para conferir se está pegando o medicamento correto, identificar se o medicamento foi pego pela ventosa e depositá-lo no bin para a montagem da fita <br/>


<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 1 - Leitura do QR Code no terminal</strong></p>
  <img 
    src={useBaseUrl('/img/qrcode.png')} 
    alt="leitura QR Code" 
    title="leitura QR Code" 
    style={{ maxWidth: '80%', height: 'auto' }}
  />
  <p>Fonte: Elaborado pelo grupo Dose Certa (2025)</p>
</div>
<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 2 - leitura do sensor infravermelho</strong></p>
  <img 
    src={useBaseUrl('/img/sensor.png')} 
    alt="leitura do sensor infravermelho" 
    title="leitura do sensor infravermelho" 
    style={{ maxWidth: '80%', height: 'auto' }}
  />
  <p>Fonte: Elaborado pelo grupo Dose Certa (2025)</p>
</div>
&emsp; A seguir está um vídeo do funcionamento do robô e do envio de comandos pelo usuário:

[Funcionamento do robô](https://youtu.be/kcvzukUuEyo)

# Testes realizados 

&emsp; Para validar o funcionamento e confiabilidade do sistema, foram implementados um leitor de QR Code para conferir se o remédio está correto e um sensor infravermelho para checar se o medicamento realmente foi pego e não caiu durante o percurso para continuar sua rotina de medicamentos. Caso seja identificado que o medicamento caiu durante este processo, ele voltará à posição inicial e iniciará novamente o processo de montagem da fita. <br/>

&emsp; A seguir está um vídeo do teste desta funcionalidade:

[Teste do sensor infravermelho](https://youtu.be/utGXoDlKVVY)