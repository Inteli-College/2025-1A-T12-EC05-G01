---
title: User Stories
sidebar_position: 1
slug: /user-stories
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# User Stories 

&emsp;User Stories (Histórias de usuário em português) são ferramentas muito utilizadas no desenvolvimento de tecnologias e que possuem a finalidade de descrever funcionalidades de um sistema que está sendo criado dentro de metodologias ágeis. As user stories possuem como principal objetivo descrever a visão de determinado cliente (no nosso caso, das Personas criadas) e como tal necessidade deve ser implementada pela equipe de desenvolvimento [[1]](https://cwi.com.br/blog/user-stories-estruturacao-e-dicas-extras/). Também é importante deixar claro que as histórias de usuário normalmente seguem um padrão de formatação semelhante a "Eu, [nome do usuário], enquanto [função do usuário], desejo/quero [funcionalidade do sistema], a fim de que [ganho gerado pela funcionalidade]."

## User Stories da Persona Juliana
&emsp;Sendo a farmacêutica responsável por coordenar e vistoriar os processos na farmácia e também aprovar ou modificar prescrições médicas, as histórias de usuário de Juliana são muito ligadas a esses temas. Dessa forma, as suas user stories seguem como:


<div align="center">

<p allign="center"> Tabela 01 - User Stories da Persona Juliana </p>

| ID   | Descrição | Principal Feature no Sistema |
|------|------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| US01 | Eu, Juliana Montana, enquanto coordenadora da farmácia do HC Unicamp, quero uma plataforma que me demonstre métricas de desempenho sobre as montagens de fitas médicas feitas na farmácia, a fim de otimizar a alocação de recursos nos processos. | Dashboard de métricas e desempenho |
| US02 | Eu, Juliana Montana, enquanto coordenadora da farmácia do HC Unicamp, quero que o sistema de automação para montagem de fitas médicas seja integrado com o sistema atual do hospital, permitindo que eu envie prescrições aprovadas pelo sistema atual para o sistema de automação, a fim de aumentar a agilidade no processo de separação de medicamentos. | Integração com o sistema hospitalar |
| US03 | Eu, Juliana Montana, como responsável por coordenar e treinar a equipe de farmacêuticos e técnicos da farmácia do HC Unicamp, gostaria de ter um sistema fácil de se explicar e que agregue funcionalidade de teste para que os funcionários possam ver o funcionamento do robô antes de montar uma fita. | Modo de teste/simulação do robô |
| US04 | Eu, Juliana Montana, como coordenadora da farmácia do HC Unicamp, quero que o sistema possua uma página de cadastro/login que possa distinguir os usuários entre técnicos, farmacêuticos e enfermeiros, a fim de poder entender qual cargo realizou qual ação na plataforma. | Controle de acesso e permissões |

<p allign="center"> Material produzido por Dose Certa (2025) </p>

</div>

&emsp;Dessa forma, as histórias de usuário da persona Juliana têm como objetivo refletir as necessidades dela em relação ao sistema de automação que está sendo desenvolvido, refletindo as funcionalidades do sistema que ela mais valoriza e direcionando a equipe no desenvolvimento dessas features. A US01, por exemplo, destaca a necessidade de Juliana de visualizar métricas sobre a montagem das fitas de medicamento e está ligada ao desenvolvimento, por parte da equipe, de uma dashboard que mostra dados como, por exemplo, tempo médio para se montar uma fita. Já a US03 está relacionada ao fato de que Juliana não aceitará a implementação do sistema automatizado em sua farmácia caso ela não entenda como ele funciona. Além disso, ela destaca a sua vontade de participar do treinamento da equipe. Assim, isso reflete na necessidade de implementar um "modo de treinamento" para o robô, que permita que a equipe se familiarize com o sistema antes de já o colocar para montar fitas de medicamentos. 


## User Stories da Persona Rodrigo

&emsp;Rodrigo, diferentemente de Juliana, é o técnico de farmácia. No sistema atual, ele é o responsável por, manualmente, coletar os medicamentos em seus respectivos bins (estoque), bipar (ler código de barras do medicamento) e montar a fita. No sistema de automação que está sendo desenvolvido, o seu trabalho será mais voltado para o acompanhamento do processo, verificação por erros do robô e selagem da fita de medicamentos. Assim, as suas histórias de usuário refletem essas características. 

<div align="center">

<p align="center"> Tabela 02 - User Stories da Persona Rodrigo </p>

| ID   | Descrição | Principal Feature no Sistema |
|------|------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|
| US05 | Eu, Rodrigo Mendes, como técnico farmacêutico, quero uma interface com feed ao vivo da operação robótica e indicadores de progresso, a fim de acompanhar cada etapa da separação sem necessidade de intervenção manual. | Monitoramento em tempo real |
| US06 | Eu, Rodrigo Mendes, como técnico farmacêutico, desejo que o sistema dispare um alerta imediato caso detecte inconsistências (ex: medicamento caiu do braço robótico), para interromper o processo antes da montagem final. | Sistema de alerta e controle de erros |
| US07 | Eu, Rodrigo Mendes, como técnico farmacêutico, quero que o robô seja capaz de realizar a leitura de um código de barras ou QR code presente nos medicamentos, a fim de reduzir o tempo que eu gasto fazendo isso. | Leitor de código de barras/QR Code |
| US08 | Eu, Rodrigo Mendes, como técnico farmacêutico responsável pela atualização e manutenção do estoque, quero que o sistema de automação atualize a quantidade de medicamentos disponíveis no estoque automaticamente, a fim de evitar discrepâncias com o inventário físico. | Atualização automática do estoque |
| US09 | Eu, Rodrigo Mendes, como técnico farmacêutico, gostaria que o braço robótico fosse capaz de separar ao menos 4 medicamentos dispostos em bins e os colocasse em uma bandeja para selagem, a fim de reduzir o meu trabalho com ações repetitivas. | Manipulação automatizada de medicamentos |

<p align="center"> Material produzido por Dose Certa (2025) </p>

</div>

&emsp;Assim, é possível ver que as histórias de usuário da persona Rodrigo demonstram as necessidades que o técnico farmacêutico terá enquanto utiliza o sistema de automação. Tais histórias trazem conceitos como a necessidade de alertas em caso de erro, visualização do estado atual do robô enquanto ele separa os medicamentos e a realização da bipagem dos medicamentos de maneira autônoma. A US08, por exemplo, reflete a necessidade que Rodrigo tem de que o sistema, ao pegar um medicamento para montar uma fita, automaticamente dê a baixa desse medicamento no banco de dados para que o estoque se mantenha atualizado e consistente. Em termos de desenvolvimento, essa história do usuário pode ser traduzida na implementação de um banco de dados que armazene os medicamentos e suas quantidades e que seja atualizado após a montagem de cada fita. 

&emsp;Em suma, as histórias de usuário são ferramentas poderosas que ajudam um time de desenvolvedores que trabalham com metodologias ágeis a traduzir as necessidades e dores de suas personas/usuários da solução em funcionalidades que são mais palpáveis para o time de desenvolvimento da parte tecnológica da solução. Assim, as histórias de usuário da persona Juliana e da persona Rodrigo são fundamentais para que a equipe possa entender o que cada persona precisa e implementar essas funcionalidades no sistema, dando mais prioridade àquelas que são mais importantes ou que atacam dores maiores dos usuários.

## Bibliografia

 [[1]](https://cwi.com.br/blog/user-stories-estruturacao-e-dicas-extras/) USER STORIES: boas práticas, estruturação e dicas extras. CWI, [s.d.]. Disponível em: https://cwi.com.br/blog/user-stories-estruturacao-e-dicas-extras/. Acesso em: 18 fev. 2025


