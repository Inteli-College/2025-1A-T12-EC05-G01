---
title: Diagrama de blocos
sidebar_position: 11
---

# Diagrama de blocos
&nbsp;&nbsp;&nbsp;&nbsp;O diagrama de blocos é um modelo padronizado e eficaz de representar as diversas direções que um algoritmo segue. Uma forma visual de representar a sequência lógica de um determinado processamento. Nesta seção iremos apresentar a arquitetura geral do projeto a partir do modelo de diagrama de blocos, passando desde a prescrição inicial do médico até o remédio ser administrado no paciente.

&nbsp;&nbsp;&nbsp;&nbsp;Começando com o Médico, que irá montar a prescrição do paciente, mandando-a para uma Interface de Controle, onde um Enfermeiro é responsável por aprovar a prescrição ou pedir qualquer mudança caso ache necessário. Caso ele peça uma mudança, a prescrição volta para o médico para este avaliar a mudança solicitada.

&nbsp;&nbsp;&nbsp;&nbsp;Quando a prescrição é aprovada pelo Enfermeiro, a API é responsável por mandá-la para a Plataforma de Controle, onde o Técnico Farmacêutico terá que confirmar a prescrição. Quando confirmada esta prescrição, a API irá mandar o sinal para o Sistema do Braço Robótico e também irá se comunicar com o Banco de Dados para atualizá-lo conforme o conteúdo da prescrição solicitada. O Braço Robótico então irá pegar os medicamentos solicitados no Bin, o trazendo para o Técnico Farmacêutico. Com todos medicamentos selecionado e confirmado pelo Técnico Farmacêutico, ele então prepara uma Fita com os rémedios e administra eles para o Paciente.


