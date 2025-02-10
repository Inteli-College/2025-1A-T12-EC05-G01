---
title: Funcionais
sidebar_position: 11
slug: /
---

# Requisitos

## Requisitos Funcionais

Requisitos funcionais são funcionalidades específicas que o sistema automatizado de separação de medicamentos deve possuir. Esses requisitos definem as ações que o software e o hardware (incluindo o robô Dobot) devem executar para atender às necessidades do Hospital de Clínicas da Unicamp.

**Quadro 4 - Requisitos Funcionais em forma de quadro**

| **ID**  | **Requisito Funcional**                 | **Descrição**                                                                                                                                                                | **Regra de Negócio**                                                                                          |
|---------|----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| RF01    | Integração com prescrições eletrônicas | O sistema deve ser capaz de importar dados das prescrições eletrônicas do hospital.                                                                       | A integração deve ser feita em tempo real para garantir a atualização constante das prescrições.                  |
| RF02    | Seleção de medicamentos pelo robô Dobot  | O robô Dobot deve ser capaz de identificar e selecionar medicamentos com base nas prescrições recebidas.                                                  | O robô deve validar o medicamento através de leitura de código de barras antes da separação.                       |
| RF03    | Validação por sensores inteligentes     | O sistema deve utilizar sensores para validar o peso e o volume dos medicamentos selecionados.                                                                | A validação deve ser automática e impedir a continuidade do processo em caso de divergências.                        |
| RF04    | Feedback visual e sonoro                | O sistema deve fornecer feedback visual (LEDs) e sonoro (buzzer) para indicar o sucesso ou erro na separação.                                              | LED verde e som curto indicam sucesso; LED vermelho e dois bipes indicam erro.                                 |
| RF05    | Registro de operações                  | O sistema deve registrar todas as etapas da separação, incluindo tempos e identificadores dos medicamentos.                                              | Os registros devem ser salvos automaticamente no banco de dados e estar disponíveis para auditoria.           |
| RF06    | Geração de relatórios                    | O sistema deve gerar relatórios detalhados sobre a eficiência do processo, taxa de erros e tempo de execução.                                             | Os relatórios devem ser exportáveis em formatos como PDF e CSV.                                            |
| RF07    | Controle de estoque                     | O sistema deve atualizar o estoque automaticamente após a separação dos medicamentos.                                                                  | O controle de estoque deve ser integrado ao sistema hospitalar em tempo real.                                 |
| RF08    | Interface de monitoramento              | O sistema deve possuir uma interface amigável para monitoramento em tempo real das operações do robô e dos sensores.                                   | A interface deve permitir ajustes manuais e exibir alertas em caso de falhas.                                |

Fonte: Material produzido pelo grupo BiMu (2024)

Esses requisitos garantirão que o sistema atenda tanto às necessidades operacionais quanto às expectativas de usabilidade e segurança do hospital.



