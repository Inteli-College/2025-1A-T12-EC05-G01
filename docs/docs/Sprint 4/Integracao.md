---
title: Integração com o Robô
sidebar_position: 2
slug: /integracao
---

import useBaseUrl from '@docusaurus/useBaseUrl';

&emsp; Além das telas com as quais o usuário mais irá interagir como triar uma prescrição, fila de separação e controle de estoque, também desenvolvemos uma tela que contém os principais comandos da CLI. Assim, caso haja qualquer problema no processo de triagem ou separação de medicamentos, é possível o usuário ter uma comunicação direta com o robô



<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 1 - Página de comunicação com o robô</strong></p>
  <img 
    src={useBaseUrl('/img/integra.png')} 
    alt="comunicacao robo" 
    title="comunicacao robo" 
    style={{ maxWidth: '80%', height: 'auto' }}
  />
  <p>Fonte: Elaborado pelo grupo Dose Certa (2025)</p>
</div>

&emsp; Nesta tela o usuário pode selecionar medicamentos e suas quantidades para adicionar numa fita e enviá-la diretamente para a etapa de montagem. Além disso, há também uma visualização dos medicamentos conforme eles vão sendo adicionados a fita, reduzindo a possibilidade de erros. No entanto, nesta tela não é possível modificar os medicamentos de uma fita, apenas enviá-la para montagem ou cancelar. 

&emsp; Esta página conta também com uma seção de busca de medicamentos, na qual o usuário pode visualizar todos os medicamentos disponíveis no estoque e retirar o medicamento que necessita. 

&emsp; Em resumo, esta interface centraliza algumas operações essenciais para, caso haja algum erro na triagem das fitas, o fluxo de trabalho não seja interrompido. Dessa forma, o usuário pode rapidamente selecionar medicamentos e eenviá-los diretamente para o processo de separação, reduzindo o tempo de execução e possíveis falhas operacionais. 