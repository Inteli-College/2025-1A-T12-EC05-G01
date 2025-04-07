---
title: Arquitetura Atualizada
sidebar_position: 1
slug: /arquitetura-atualizada
---

&nbsp;&nbsp;&nbsp;&nbsp;Na Sprint 1, foi desenvolvida uma [Arquitetura Proposta](/docs/Sprint%201/Arquitetura%20do%20Sistema/Diagrama%20de%20blocos); contudo, ao longo do desenvolvimento do projeto, algumas mudanças foram feitas. Nesse sentido, a versão atualizada da arquitetura encontra-se na Figura 1 abaixo.

<div align="center">
<sub>Figura 1 - Arquitetura Atualizada</sub>

![Adicionar Bin](<../../../static/img/Front-End.png>)
<sup>Fonte: Material produzido pelos autores (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;Assim, conforme pode ser visto na Figura 1, a principal mudança foi a comunicação com o banco de dados: a comunicação com o banco de dados foi centralizada no back-end da aplicação. Dessa forma, o back-end do robô interage com o back-end da aplicação para armazenar os dados pertinentes. Essa mudança foi feita para melhorar a organização do sistema e facilitar a manutenção, centralizando todas as consultas ao banco de dados em um único ponto.

&nbsp;&nbsp;&nbsp;&nbsp;Outra mudança foi a implementação de telas no sistema para criação e para triagem da prescrição. Embora haja essas *features* no sistema existente do HC, a inclusão dessas funcionalidades no protótipo busca simular com maior fidelidade o processo operacional da farmácia.

&nbsp;&nbsp;&nbsp;&nbsp;Portanto, o fluxo de dipensação de medicamento inicia-se com a inserção da prescrição médica na plataforma web, onde o médico detalha as informações do paciente e os medicamentos necessários. Nessa mesma plataforma, o farmacêutico realiza a triagem e aprovação da prescrição. Logo, após a aprovação, o robô inicia a separação dos medicamentos conforme as instruções da plataforma. O resultado é a fita de medicamentos, que é verificada e selada pelo técnico de farmácia antes de ser entregue ao enfermeiro, que a leva até o paciente. Todas as prescrições, assim como logs do robô e o fluxo do estoque são armazenados por meio do back-end da aplicação no banco de dados.

