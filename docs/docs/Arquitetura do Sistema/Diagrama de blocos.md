---
title: Diagrama de blocos
sidebar_position: 11
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Diagrama de blocos

<div style={{ textAlign: 'center' }}>
  <p><strong>Diagrama de blocos da arquitetura</strong></p>
  <img
    src={useBaseUrl("/img/diagrama_blocos_arquitetura.png")}
    alt="Diagrama de blocos da arquitetura"
    title="Diagrama de blocos da arquitetura"
    style={{ maxWidth: '80%', height: 'auto' }}
  />
  <p>Fonte: Elaborado pelo grupo Dose Certa (2025)</p>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;O diagrama de blocos é um modelo padronizado e eficaz para representar a interação entre os componentes do sistema e o fluxo de informações entre eles. Nesta seção, apresentamos a arquitetura geral do projeto, desde a prescrição inicial do médico até a administração do medicamento ao paciente.

&nbsp;&nbsp;&nbsp;&nbsp;O processo se inicia com o Médico registrando a prescrição do paciente na Interface de Controle, que se comunica com a API do sistema para armazenar temporariamente os dados. O Enfermeiro acessa essa interface e revisa a prescrição, podendo aprová-la ou solicitar alterações. Caso haja uma solicitação de alteração, a API retorna a prescrição para o Médico com um status pendente de ajuste.

&nbsp;&nbsp;&nbsp;&nbsp;Com a prescrição aprovada, a API envia os dados para a Plataforma de Controle, onde o Técnico Farmacêutico confirma a solicitação. Nesse momento, a API registra a confirmação no Banco de Dados, garantindo que a informação esteja sincronizada com o sistema. Em seguida, a API aciona o Sistema do Braço Robótico, que recupera os medicamentos necessários do Bin de armazenamento e os entrega ao Técnico Farmacêutico para conferência.

&nbsp;&nbsp;&nbsp;&nbsp;Após a conferência, o Técnico Farmacêutico prepara uma Fita de Administração contendo os medicamentos selecionados. A API então registra essa etapa no Banco de Dados, atualizando o status do pedido. Por fim, os medicamentos são administrados ao Paciente, completando o ciclo do sistema.

