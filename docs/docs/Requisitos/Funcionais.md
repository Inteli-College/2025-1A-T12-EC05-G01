---
title: Funcionais
sidebar_position: 11
slug: /
---

# Requisitos

&nbsp;&nbsp;&nbsp;&nbsp;Requisitos representam as características, funcionalidades e restrições que um sistema deve possuir para atender às necessidades dos usuários e stakeholders. Eles servem como a fundação do projeto de software, orientando o desenvolvimento, garantindo a qualidade do produto final e alinhando as expectativas entre clientes, desenvolvedores e demais envolvidos no processo.

## Requisitos Funcionais

&nbsp;&nbsp;&nbsp;&nbsp;Requisitos funcionais são funcionalidades específicas que um sistema precisa ter. Em resumo, segundo a Revista Quero¹, deve-se tratar individualmente de todas as ações que o software deve ser capaz de fazer para atender às necessidades e expectativas do usuário. Dessa forma, a primeira etapa é separar todas as funcionalidades desejadas e em ordem cronológica. Com isso, é importante detalhá-las, isso é feito na aba de "Descrição". Por fim, são expostas as regras de negócios, que explicam como o sistema deve fazer o que foi planejado no requisito (Quadro 4).

<br>
<div align="center">
<sup>Quadro 2 - Requisitos Funcionais</sup>

| ID  | Requisito Funcional                 | Descrição                                                                                                                                                                | Regra de Negócio                                                                                          |
|---------|----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| RF01    | Integração com prescrições eletrônicas | O sistema deve ser capaz de importar dados das prescrições eletrônicas do hospital.                                                                       | A integração deve ser feita em tempo real para garantir a atualização constante das prescrições.                  |
| RF02    | Seleção de medicamentos pelo robô Dobot  | O robô Dobot deve ser capaz de identificar e selecionar medicamentos com base nas prescrições recebidas.                                                  | O robô deve validar o medicamento através de leitura de código de barras antes da separação.                       |
| RF03    | Validação por sensores inteligentes     | O sistema deve utilizar sensores para validar o peso e o volume dos medicamentos selecionados.                                                                | A validação deve ser automática e impedir a continuidade do processo em caso de divergências.                        |
| RF04    | Feedback visual e sonoro                | O sistema deve fornecer feedback visual (LEDs) e sonoro (buzzer) para indicar o sucesso ou erro na separação.                                              | LED verde e som curto indicam sucesso; LED vermelho e dois bipes indicam erro.                                 |
| RF05    | Registro de operações                  | O sistema deve registrar todas as etapas da separação, incluindo tempos e identificadores dos medicamentos.                                              | Os registros devem ser salvos automaticamente no banco de dados e estar disponíveis para auditoria.           |
| RF06    | Geração de relatórios                    | O sistema deve gerar relatórios detalhados sobre a eficiência do processo, taxa de erros e tempo de execução.                                             | Os relatórios devem ser exportáveis em formatos como PDF e CSV.                                            |
| RF07    | Controle de estoque                     | O sistema deve atualizar o estoque automaticamente após a separação dos medicamentos.                                                                  | O controle de estoque deve ser integrado ao sistema hospitalar em tempo real.                                 |
| RF08    | Interface de monitoramento              | O sistema deve possuir uma interface amigável para monitoramento em tempo real das operações do robô e dos sensores.                                   | A interface deve permitir ajustes manuais e exibir alertas em caso de falhas.                                |

<sup>Fonte: Material produzido pelo grupo Dose Certa (2025)</sup>
</div>

&nbsp;&nbsp;&nbsp;&nbsp;A definição desses requisitos funcionais estabelece uma base sólida para o desenvolvimento de um sistema automatizado que não apenas automatiza processos, mas também melhora a precisão e a segurança na administração de medicamentos. Ao garantir que cada etapa do processo esteja delineada, o sistema contribuirá para reduzir erros, otimizar o tempo de trabalho e garantir a rastreabilidade completa das operações, resultando em um ambiente hospitalar mais eficiente e seguro, objetivo final do parceiro com esse projeto. 

## Referências

[1] Requisitos funcionais e não funcionais: o que são, diferenças e exemplos. Disponível em: https://querobolsa.com.br/revista/requisitos-funcionais-e-nao-funcionais.

