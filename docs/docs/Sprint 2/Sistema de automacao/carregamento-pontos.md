---
title: Carregamento de pontos pré-definidos
sidebar_position: 2
slug: /carregamento-pontos
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Carregamento de pontos

Para possibilitar que o robô execute as funções básicas de coleta de medicamentos nos bins e transporte até o bandeja para tornar possível a montagem das fitas, foi necessário posicionar o robô em diferentes pontos manualmente para registrar as coordenadas do robô em cada ponto. Durante esse processo, foi registrado as coordenadas exatas de cada posição, que são posteriormente utilizadas para comandar os movimentos do robô. Após o registro, foi elaborado um arquivo JSON contendo todos os pontos pré-definidos. Assim, foi elaborado o seguinte arquivo `.json` com as coordenadas de cada ponto pré-definido:

```json
{
  "medicamentos": [
    {
      "medicamento": 1,
      "pontos": [
        {
          "ponto": 1,
          "x": 242.2294,
          "y": 0.0,
          "z": 151.3549,
          "r": 0.0,
          "movimento": "movj",
          "suctionCup": "off"
        },
        {
          "ponto": 2,
          "x": 210.4828,
          "y": -134.0619,
          "z": 151.063,
          "r": -32.4941,
          "movimento": "movj",
          "suctionCup": "off"
        },
        {
          "ponto": 3,
          "x": 259.3422,
          "y": -179.3704,
          "z": 139.5613,
          "r": -34.6691,
          "movimento": "movj",
          "suctionCup": "off"
        },
        {
          "ponto": 4,
          "x": 251.6451,
          "y": -178.862,
          "z": 29.7396,
          "r": -35.4041,
          "movimento": "movl",
          "suctionCup": "off"
        },
        {
          "ponto": 5,
          "x": 251.0203,
          "y": -178.4476,
          "z": 10.8886,
          "r": -35.4086,
          "movimento": "movl",
          "suctionCup": "on"
        },
        {
          "ponto": 6,
          "x": 248.5668,
          "y": -176.6154,
          "z": 148.5751,
          "r": -35.3951,
          "movimento": "movl",
          "suctionCup": "on"
        },
        {
          "ponto": 7,
          "x": -61.4342,
          "y": -298.7121,
          "z": 149.0144,
          "r": -101.6216,
          "movimento": "movj",
          "suctionCup": "on"
        },
        {
          "ponto": 8,
          "x": -77.8979,
          "y": -300.8484,
          "z": -8.107,
          "r": -104.5166,
          "movimento": "movl",
          "suctionCup": "on"
        },
        {
          "ponto": 9,
          "x": -80.269,
          "y": -309.8394,
          "z": -20.1414,
          "r": -104.5241,
          "movimento": "movl",  
          "suctionCup": "off"
        },
        {
          "ponto": 10,
          "x": -97.1691,
          "y": -310.0745,
          "z": 130.8323,
          "r": -107.3996,
          "movimento": "movj",
          "suctionCup": "off"
        }
      ]
    },
    {
      "medicamento": 2,
      "pontos": [
        {
          "ponto": 1,
          "x": 258.3503,
          "y": -102.9024,
          "z": 65.2056,
          "r": -21.7177,
          "movimento": "movj",
          "suctionCup": "on"
        },
        {
          "ponto": 2,
          "x": 255.452,
          "y": -105.5703,
          "z": 16.5641,
          "r": -22.4538,
          "movimento": "movj",  
          "suctionCup": "on"
        },

```

Neste arquivo, os pontos são organizados por medicamento (bin), o que permite que cada trajetória seja definida com precisão. Para cada ponto, os parâmetros utilizados são:

- ponto: Número identificador da posição na sequência.
- x, y, z: Coordenadas que determinam a posição do robô.
- r: Orientação do end effector (rotacionado em graus).
- movimento: Tipo de comando de movimento (movj utilizado quando a prioridade é a velocidade enquanto que o movl foca em precisão).
- suctionCup: Define quando a sucção está ativada ou desativada.

Dessa forma, o código acima é um trecho do arquivo `robo/Dobot/pontos/pontos.json` que ilustra de maneira bem clara o processo de carregamento de pontos pré-definidos, com os pontos sendo agrupados conforme os movimentos necessários para cada bin (variando de 1 a 5) e cada ponto contendo a o número de identificação do ponto para cada bin, as coordenadas, o tipo de movimento e se o modo de sucção está ativado ou não. 


:::tip Próximas etapas
Nesta seção foi possível entender de modo mais detalhado o processo de carregamento de pontos do robô, que se inicia de modo manual e é passado para um arquivo para que esses pontos possam ser utilizados para controlar o robô. Na próxima seção será abordado a navegação do robô para esses pontos pré-definidos.
:::
