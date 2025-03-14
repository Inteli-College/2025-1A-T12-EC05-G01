---
title: Esquemático do hardware periférico
sidebar_position: 1
slug: /esquematico
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Os hardwares periféricos do sistema

&emsp;Durante o desenvolvimento da Sprint 3 do projeto, foi necessário implementar o sistema de hardware e periféricos externos do braço robótico da solução. Tais hardwares periféricos incluem um sensor de QR Code e um sensor infravermelho.


## Sensor infravermelho 

&emsp;O sensor infravermelho é de modelo TCRT5000 e funciona de modo a emitir uma luz em frequência infravermelha, ou seja, invisível ao olho humano. Essa luz emitida reflete em um objeto e volta ao receptor do sensor. A partir disso, podemos medir a intensidade com a qual a luz voltou. Assim, podemos definir se um objeto está perto ou longe do sensor. Isso se faz extremamente útil para o projeto em questão, onde é necessário verificar se o robô realmente pegou um medicamento. Dessa forma, foi montado um suporte com os sensores posicionados de maneira que, quando um objeto é coletado pelo robô, o sensor consegue perceber isso. Por conta disso, é possível tomar medidas cabíveis quando um medicamento, por exemplo, cair no meio do transporte. 

<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 1 - Suporte desenvolvido com sensores</strong></p>
  <img 
    src={useBaseUrl('/img/suporte_sensores.jpeg')} 
    alt="Suporte sensores" 
    title="Suporte sensores" 
    style={{ maxWidth: '80%', height: 'auto' }}
  />
  <p>Fonte: Elaborado pelo grupo Dose Certa (2025)</p>
</div>

## Leitor de QR Code

&emsp;Além do sensor infravermelho, um leitor de QR Code MH-ET foi conectado ao Raspberry Pi, que está sendo utilizado como computador/cérebro do robô. O leitor de QR Code está conectado ao computador via cabo USB, de modo que é possível ler os seus dados a partir de uma simples leitura da porta serial. O leitor de QR Code tem a funcionalidade de realizar a bipagem do medicamento, ou seja, registrar que tal medicamento foi retirado de um bin a fim de realizar atualizações no estoque e realizar cobranças aos pacientes. No fluxo do sistema, o braço robótico fica parado em uma posição acima do bin de medicamento até que consiga ler um QR Code válido. Caso não consiga ler, a montagem não é feita. 

## Diagramas e esquemáticos

&emsp;Juntando todos os sensores, foi possível obter os seguintes diagramas e esquemáticos:

<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 2 - Diagrama de ligação dos sensores</strong></p>
  <img 
    src={useBaseUrl('/img/diagrama_sensores.png')} 
    alt="Diagrama de ligação dos sensores" 
    title="Diagrama de ligação dos sensores" 
    style={{ maxWidth: '80%', height: 'auto' }}
  />
  <p>Fonte: Elaborado pelo grupo Dose Certa (2025)</p>
</div>


<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 3 - Esquemático de ligação dos sensores</strong></p>
  <img 
    src={useBaseUrl('/img/esquematico_sensores.png')} 
    alt="Esquemático de ligação dos sensores" 
    title="Esquemático de ligação dos sensores" 
    style={{ maxWidth: '80%', height: 'auto' }}
  />
  <p>Fonte: Elaborado pelo grupo Dose Certa (2025)</p>
</div>

&emsp;Explicando melhor o esquemático, é possível perceber que o sensor infravermelho está conectado a dois resistores, que estão presentes a fim de criar um divisor de tensão para ajustar a tensão de operação do fototransistor. Além disso, é possível perceber que o sensor infravermelho não está conectado diretamente ao Raspberry Pi 5, mesmo que este possua portas GPIO. Isto ocorre porque o Raspberry Pi 5 não possui conversores ADC, e, portanto, não pode ler sinais analógicos como o deste sensor. Dessa forma, foi necessário ler o sensor com um Arduino Nano e enviar os valores via I2C para o Raspberry Pi 5. Tal ligação pode ser observada com as conexões entre os pinos A4 e A5 com os pinos I2C do Raspberry. O esquemático apresenta o leitor de QR Code de maneira simplificada uma vez que ele apenas se conecta ao USB do Raspberry Pi 5. 
## Conclusão

&emsp;Dessa forma, é possível entender melhor o funcionamento dos circuitos que foram desenvolvidos na sprint 3. Tais circuitos e sensores são de extrema importância para o sistema, uma vez que colaboram com segurança, rastreabilidade e confiabilidade do sistema no geral. No momento da sprint 3, tais sensores ainda não estão integrados com o banco de dados. Entretanto, este é um dos planos para as sprints futuras. 
