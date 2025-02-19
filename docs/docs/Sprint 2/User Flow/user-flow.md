---
title: User Flow
sidebar_position: 1
slug: /user-flow
---

&nbsp;&nbsp;&nbsp;&nbsp;Segundo o artigo "User Journeys vs. User Flows" [[1]](#referências), os *user flows* descrevem os processos pelos quais os usuários passam para alcançar seus objetivos; desse modo, eles buscam detalhar um conjunto de interações que compõem um caminho comum do usuário dentro de um produto. Assim, um *user flow* ou fluxo de utilização do usuário é um conjunto de interações que descrevem a sequência típica ou ideal de etapas necessárias para realizar uma tarefa comum em um produto. Para representar visualmente esse fluxo, foi criado o Mapeamento do Fluxo de Utilização do Usuário (Figura 1), o qual visa a apresentar os passos para a conclusão da tarefa, os caminhos alternativos ou desvios possíveis nesse trajeto e os pontos em que o usuário precisa tomar uma decisão.

<div align="center">
<sub>Figura 1 - Mapeamento do Fluxo de Utilização do Usuário</sub>

![Mapeamento do Fluxo de Utilização do Usuário](<../../../static/img/user-flow.png>)<br />
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Portanto, a Figura 1 representa todo o fluxo dentro do sistema, incluindo os *wireframes* das telas e os componentes físicos. Desse modo, o fluxo do usuário inicia com a tela de cadastro. Para facilitar  visualização, a Figura 2 representa as etapas iniciais do fluxo.

<div align="center">
<sub>Figura 2 - Etapas de cadastro, login e recuperação de senha</sub>

![Etapas de cadastro, login e recuperação de senha](<../../../static/img/cadastro-login-userflow.png>)<br />
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>


&nbsp;&nbsp;&nbsp;&nbsp;Assim, o fluxo inicia com o cadastro do usuário no sistema, atendendo à [US04](../User%20Stories/user-stories.md). Após a realização do cadastro, o usuário é redirecionado para a tela de login, onde ocorrerá a autenticação dentro do sistema. Caso o (usuário) esqueça a senha, ele pode acessa a tela para recuperação de senha por meio de um botão e, com a senha recuperada, será possível realizar o login normalmente. A primeira tela após a realização do login é a de Dashboard, a qual pode ser vista na Figura 3 abaixo.

<div align="center">
<sub>Figura 3 - Dashboard e Barra lateral</sub>

![Dashboard e Barra lateral](<../../../static/img/dashboard-sidebar.png>)<br />
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;A primeira tela após a realização do login é a de Dashboard, onde estão disponíveis métricas como quantidade de erros, tempo médio de montagem das fitas, montagens em andamento e totais, atendendo a [US01](../User%20Stories/user-stories.md). A partir da Dashboard e das demais telas do sistema, é possível acessar a barra de navegação lateral, a qual possibilita o redirecionamento para as demais telas do sistema, de acordo com o objetivo do usuário. Duas dessas telas estão representadas na Figura 4.

<div align="center">
<sub>Figura 4 - Checagem de Estoque e Prescrições</sub>

![Dashboard e Barra lateral](<../../../static/img/estoque-prescricoes.png>)<br />
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;A tela de checagem de estoque permite a verificação das quantidades de medicamentos disponíveis dentro da farmácia, correspondendo a [US08](../User%20Stories/user-stories.md). Já a tela de prescrições é destinada à triagem das prescrições recebidas, ela representará, em nosso sistema a tela existente no sistema do hospital; assim, quando o sistema for ser de fato utilizado, ela será substituida pela tela existente, garantindo a integração com o sitema do HC, conforme a [US02](../User%20Stories/user-stories.md). As outras duas telas existentes e a conexão com o hardware podem ser vistos na Figura 5.

<div align="center">
<sub>Figura 5 - Montagens Realizadas, Verificação de Medicamentos e componentes físicos</sub>

![Telas e conexão com hardware](<../../../static/img/fitas-hardware.png>)<br />
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;A tela de Montagens Realizadas permite o controle da montagem de todas as fitas que já foram triadas, com comando para iniciar e pausar o processo e com a informação se a montagem já foi concluída ou não; dessa forma, a [US05](../User%20Stories/user-stories.md) é atendida. Caso haja algum erro no processo de montagem, um alerta será mostrado nessa tela, correspondendo à [US06](../User%20Stories/user-stories.md). Nessa tela, também será possível entrar no modo de teste de funcionamento de robô, conforme a [US03](../User%20Stories/user-stories.md). A tela para verificação dos medicamentos mostra a lista de medicamentos presentes nas fitas já separadas, as quais precisam ser seladas manualmente pelos técnicos farmacêuticos. 

&nbsp;&nbsp;&nbsp;&nbsp;Ademais, na Figura 5, também são mostrados os componentes físicos do sistema, contando com um braço robótico, ao qual será acoplado um leitor de códigos de barra e QR Code. Ao enviar uma fita para separação pela tela de Montagens Realizadas, o robô recebe os comandos para separação daquela fita e retorna ao usuário uma bandeja com os medicamentos separados e bipados. Além disso, também é possível pausar ou cancelar o processo de separação por essa tela. Desse modo, as [US07](../User%20Stories/user-stories.md) e [US09](../User%20Stories/user-stories.md) estão atendidas nesse fluxo.

&nbsp;&nbsp;&nbsp;&nbsp;Logo, realizar o mapeamento do fluxo do usuário permite a visualização dos passos necessários para que o usuário realize as tarefas do sistema, além de permitir a verificação de possíveis problemas. Com esse mapeamento, também é possível checar se a solução proposta está de acordo com as *user stories*, ou seja, está adequada às necessidades do usário.

## Referências

[1] KAPLAN, KATE. User Journeys vs. User Flows. Disponível em: https://www.nngroup.com/articles/user-journeys-vs-user-flows/. Acesso em 17 de fevereiro de 2025.