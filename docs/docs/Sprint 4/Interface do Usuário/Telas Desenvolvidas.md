---
title: Telas Desenvolvidas
sidebar_position: 2
slug: /telas-desenvolvidas
---

&nbsp;&nbsp;&nbsp;&nbsp;Durante a Sprint 4, foi dada continuidade ao desenvolvimento da interface do usuário, com a finalização do desenvolvimento do *front-end* e com a realização da integração da maioria das telas com o *back-end*. Desse modo, as Figuras 1 a 14 abaixo mostram como as telas ficaram ao final da oitava semana de desenvolvimento do projeto.

&nbsp;&nbsp;&nbsp;&nbsp;Nesse cenário, a primeira tela acessada pelo usuário ao entrar no sistema é a tela de cadastro (Figura 1). Essa tela está integrada ao *back-end* além de realizar a autenticação com o [Firebase Authentication](https://firebase.google.com/docs/auth?hl=pt-br). Ao realizar o cadastro, deve-se informar se o usuário é um médico para que, caso o seja, todas as vezes que realizar login, ser direcionado para tela de criação de prescrição.

<div align="center">
<sub>Figura 1 - Cadastro</sub>

![Cadastro](<../../../static/img/telas/Cadastro.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Após a realização do cadastro, quando o usuário precisar acessar novamente o sistema, o fará por meio da tela de login (Figura 2). A qual realiza a autenticação com o Firebase e também está integrada ao banco de dados, informando qual o tipo do usuário (médico ou enfermeiro).

<div align="center">
<sub>Figura 2 - Login</sub>

![Login](<../../../static/img/telas/Login.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Após a autenticação, a primeira tela disponível no sistema é a tela de Dashboard, a qual possibilita uma visão geral do sistema. No topo dessa tela (Figura 3), há um gráfico com a taxa de sucesso do sistema, isto é, a razão entre fitas montadas corretamente entre o total de fitas montadas. Além disso, há uma visualização do status das fitas para cada paciente. Esse trecho ainda não foi integrado ao *back-end* do sistema, tarefa que será realizada na última Sprint de desenvolvimento.

<div align="center">
<sub>Figura 3 - Dashboard 1</sub>

![Dashboard 1](<../../../static/img/telas/Dashboard1.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Ainda na Dashboard (Figura 4), são visíveis as mensagens de log do robô salvas no banco de dados. Esse trecho está integrado ao *back-end*, fornecendo as informações sobre o funcionamento do robô. Ademais, na parte inferior dessa tela há campos com dados acerca das fitas: quantidade de fitas montadas, quantidade de fitas que precisam ser montadas e o tempo necessário para montar as fitas em espera. Esses dados ainda estão mockados e deverão ser funcionais na próxima Sprint.

<div align="center">
<sub>Figura 4 - Dashboard 2</sub>

![Dashboard 2](<../../../static/img/telas/Dashboard2.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;De todas as telas dentro do sistema é possível acessar a Sidebar (Figura 5), a qual contém as opções de navegação, permitindo ao usuário acessar facilmente as demais telas da aplicação. Dessa forma, a experiência de navegação torna-se mais eficiente. Ainda, a nomeação das telas busca seguir o padrão de nomes já adotado pela farmácia do hospital: Triagem, Separação e Selagem; assim, a interação com o sistema torna-se mais intuitiva, pois mantém a familiaridade com os processos já estabelecidos na rotina da farmácia, facilitando a adaptação e reduzindo a curva de aprendizado.

<div align="center">
<sub>Figura 5 - Sidebar</sub>

![Sidebar](<../../../static/img/telas/Sidebar.png>)<br/>
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Outrossim, na Navbar (Figura 6), há botões e visualizações úteis acerca do robô. O ícone de casa leva o robô para posição home; o círculo ao lado da palavra Dobot indica se o robô está conectado ou não a depender da cor: verde para conectado e laranja para desconectado; o botão "Reconectar"; o botão "Adicionar Bin" que leva à tela para cadastramento de outros pontos onde o robô deve coletar medicamentos; e um ícone de sino que levará a uma aba de notificações informando ao usuário caso ocorra algum erro no processo de separação de fitas. Essas funcionalidas, com exceção das notificações, já estão integradas ao robô.

<div align="center">
<sub>Figura 6 - Navbar</sub>

![Navbar](<../../../static/img/telas/Navbar.png>) <br/>
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Dentro do fluxo da farmácia, após a criação das prescrições, elas devem ser triadas pelos farmacêuticos antes de irem para separação. Desse modo, a Figura 7 representa a tela de Triagem, na qual é possível alterar a quantidade de um medicamento a ser enviado, removê-lo da fita ou adicionar mais medicamentos. Segundo feedback do parceiro na review, não deveria haver a opção de remoção, mas de dispensar o medicamento mais tarde; dessa forma, pretende-se implementar essa melhoria para a entrega final.

<div align="center">
<sub>Figura 7 - Triagem</sub>

![Triagem](<../../../static/img/telas/Triagem.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Após a aprovação dos medicamentos pelos farmacêuticos, eles são enviados automaticamente para separação e são, assim, exibidos na tela de Fila de Separação (Figura 8). Dessarte, é possível acompanhar o status de montagem de cada fita triada e qual a ordem em que serão separadas. Essa tela ainda não está integrada ao *back-end*, tarefa que está no *backlog* da quinta Sprint.

<div align="center">
<sub>Figura 8 - Fila de Separação</sub>

![Fila de Separação](<../../../static/img/telas/FilaSeparacao.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Após a separação, as fitas devem ser seladas pelos farmacêuticos ou técnicos de farmácia. Assim, quando o robô termina de montar as fitas, elas passam a estar visíveis na tela de Selagem (Figura 9), para que o usuário realize manualmente a conferência da fita e informe ao sistema, por meio dos botões, se a fita foi selada ou se foi montada com erro. 

<div align="center">
<sub>Figura 9 - Selagem</sub>

![Selagem](<../../../static/img/telas/Selagem.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Outra dor trazida pelos farmacêuticos foi a de controle do estoque; portanto, para aliviar essa dor, o sistema conta com uma tela (Figuras 10 a 12) cujo objetivo é mostrar dados do estoque ao usuário. No topo da página (Figura 10), é possível visualizar quais medicamentos estão acabando e precisam ser reabastecidos.

<div align="center">
<sub>Figura 10 - Estoque 1</sub>

![Estoque 1](<../../../static/img/telas/Estoque1.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Ainda na tela de Estoque, conforme ilustrado na Figura 11, é possível visualizar o histórico das últimas movimentações, incluindo informações sobre as últimas adições e últimas retiradas. Essa funcionalidade permite, pois, um acompanhamento das atualizações no estoque, contribuindo para um melhor controle e gestão dos medicamentos.

<div align="center">
<sub>Figura 11 - Estoque 2</sub>

![Estoque 2](<../../../static/img/telas/Estoque2.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Por fim, a tela de Estoque também apresenta uma Visão Geral (Figura 12), exibindo a quantidade de cada medicamento armazenado em cada um dos bins. Essa funcionalidade proporciona uma visualização mais clara do estoque, com uma outra perspectiva para gestão dos medicamentos.

<div align="center">
<sub>Figura 12 - Estoque 3</sub>

![Estoque 3](<../../../static/img/telas/Estoque3.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;A tela Adicionar Bin (Figura 13) permite ao usuário cadastrar novos pontos para a coleta de medicamentos pelo robô. Para o cadastro desses pontos, o usuário deverá preencher qual o medicamento que estará no bin, mover o robô para os pontos necessário e, em cada ponto, selecionar a opção "move J" ou a "move L" e ativar ou não a sucção. Após o mapeamento dos pontos, será possível finalizar o cadastro do novo bin. Além disso, essa tela oferece a visualização dos bins já cadastrados, permitindo a remoção deles conforme necessário.

<div align="center">
<sub>Figura 13 - Adicionar Bin</sub>

![Adicionar Bin](<../../../static/img/telas/AddBin.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Além disso, o sistema permite que o usuário monte fitas independentemente das prescrições registradas. Para isso, foi desenvolvida a tela ilustrada na Figura 14. Nessa interface, o usuário pode inserir os medicamentos e suas respectivas quantidades, montando uma fita e enviando-a ao robô para processamento. Alternativamente, também é possível retirar um medicamento específico sem a necessidade de montar uma fita completa.

<div align="center">
<sub>Figura 14 - Montar Fita</sub>

![Montar Fita](<../../../static/img/telas/MontarFita.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Dessarte, a Interface do Usuário desenvolvida pelo grupo permite que todas as funcionalidades do sistema sejam acessadas de forma mais intuitiva que pela CLI. Além de fornecer visualizações sobre o funcionamento do sistema, facilitando o monitoramento e a interação dos usuários com o processo automatizado de separação das fitas de medicamentos.