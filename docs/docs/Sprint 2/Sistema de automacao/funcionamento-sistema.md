---
title: Funcionamento do sistema
sidebar_position: 1
slug: /funcionamento-sistema
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Sistema de automação

Nesta seção, é apresentado o sistema de automação desenvolvido que integra o robô com um software controlado via CLI (Command Line Interface). A comunicação entre o robô e o software é realizada através da biblioteca [pydobot](https://github.com/luismesas/pydobot), permitindo o envio de comandos que o robô executa de forma precisa.

O software, implementado em Python, possibilita:
- **Detecção e conexão** com o robô por meio da identificação automática da porta serial;
- **Controle por CLI** com opções para executar rotinas pré-definidas, controle manual e retorno à posição inicial (home);
- **Carregamento e execução** de trajetórias a partir de arquivos de referência contendo pontos de movimentação.
- **Montagem de fita de medicamento** em que o usuário poderá inserir os medicamentos e respctivas quantidades por meio da CLI.
- **Ajuda** para quando o usuário não conseguir entender os comandos da CLI.

## Vídeo de funcionamento do sistema

A seguir é possível conferir o vídeo demonstrativo do funcionamento do sistema, que evidencia como os comandos enviados pela CLI resultam nos movimentos esperados pelo robô:

[VIDEO DO ROBO/CLI](https://youtu.be/WzDmWVUwjK0) 
</br>


Dessa forma, através do vídeo acima é possível entender, de modo geral, as principais funcionalidades do sofware integrado com o robô, como navegar pela CLI, a maneira como as instruções são passada para o robô e como ele executa as tarefas de modo preciso. Além disso, foi claro ver a presença de elementos para facilitar a navegação e visualização, como o uso de cores e elementos de carregamento, inseridos por meio do uso da biblioteca `yaspin`. 

Também fizemos um vídeo narrado explicando melhor todas as funcionalidades do sistema para melhor entendimento do usuário das features do nosso sistema inicial.

[VIDEO NARRADO DO ROBO/CLI](https://youtu.be/bLQEqhimKkk) 



:::tip Próximas etapas
O que possibilita o controle do robô, conforme demonstrado no vídeo, é explicado de maneira mais aprofundada ao longo da documentação. Nas seções seguintes, será possível encontrar os códigos de carregamentos de pontos, os comandos básicos para mover o robô e instruções de uso das funções da CLI.
:::
