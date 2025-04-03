---
title: Analise Financeira
sidebar_position: 4
slug: /analise-financeira
---

# Análise Financeira do Projeto

Esta seção apresenta a análise financeira do projeto **Dose Certa**, detalhando os custos associados à construção do **protótipo** e realizando uma estimativa dos custos de **implementação em escala**. O objetivo é esclarecer o investimento necessário para viabilizar a solução, avaliar sua viabilidade econômica e destacar os principais diferenciais de custo entre o desenvolvimento inicial e sua aplicação em larga escala.

---

## Custo do Protótipo

A tabela a seguir apresenta os itens utilizados na montagem do protótipo, com suas respectivas categorias, quantidades, nomes e valores unitários:


| Categoria                   | Quantidade | Nome                             | Valor Unitário |
|----------------------------|------------|----------------------------------|----------------|
| **Placas de Controle**     | 1          | Raspberry Pi 5 8GB               | R$ 1.090,00    |
| **Placas de Controle**     | 1          | Dobot Magician Lite              | ~R$ 16.000,00   |
| **Placas de Controle**     | 1          | Arduino Nano                     | R$ 31,50       |
| **Sensores**               | 1          | MH-ET Live Scanner V3.0          | R$ 243,82      |
| **Sensores**               | 1          | Sensor Infravermelho TCRT5000    | R$ 6,50        |
| **Acessórios e Cabos**     | 13         | Jumpers                          | R$ 2,63        |
| **Acessórios e Cabos**     | 1          | Fita Dupla Face                  | R$ 2,00        |
| **Componentes Eletrônicos**| 1          | Resistor de 330Ω                 | R$ 0,75        |
| **Componentes Eletrônicos**| 1          | Resistor de 1kΩ                  | R$ 0,75        |
| **Prototipagem**           | 1          | Protoboard Micro                 | R$ 3,90        |
| **Estrutura e Proteção**   | 1          | Case para Raspberry Pi           | R$ 30,00       |
|                            |            |                                  |                |
|                            |            | **Total do Protótipo**           | **R$ 17.415,22** |

---

## Estimativa de Custo para Implementação em Escala

Como o parceiro informou que há cerca de **26 farmácias** a serem atendidas, a estimativa de produção considera a fabricação de **26 unidades**, mantendo a robustez do sistema e substituindo apenas os itens que podem ser otimizados com produção em escala (como sensores, estrutura e acessórios).

| Item                                      | Estimativa Unitária | Quantidade | Custo Total Estimado |
|-------------------------------------------|---------------------|------------|------------------------|
| Placa personalizada com microcontrolador  | R$ 850,00           | 26         | R$ 22.100,00           |
| Sensor QR Code industrial (OEM)           | R$ 120,00           | 26         | R$ 3.120,00            |
| Sensor infravermelho                      | R$ 4,00             | 26         | R$ 104,00              |
| Estrutura customizada (injeção ou corte)  | R$ 300,00           | 26         | R$ 7.800,00            |
| Braço robótico simplificado (educacional)| R$ 14.000,00        | 26         | R$ 364.000,00          |
| Protoboards e resistores integrados       | R$ 7,40             | 26         | R$ 192,40              |
| Cabos, conectores e acabamentos           | R$ 50,00            | 26         | R$ 1.300,00            |
| Suporte técnico (12 meses)                | R$ 300,00/mês       | —          | R$ 3.600,00            |

**Total Previsto para Escala (26 unidades + suporte técnico):** **R$ 402.216,40**

---

## Comparativo: Protótipo vs Escala

| Item                        | Protótipo          | Escala (por unidade)  |
|-----------------------------|--------------------|------------------------|
| Braço Robótico              | R$ 16.000,00       | R$ 14.000, 00            |
| Placa de Controle           | R$ 1.090,00        | R$ 850,00              |
| Leitor QR Code              | R$ 243,82          | R$ 80,00              |
| Arduino Nano                | R$ 31,50           | R$ 11,69              |
| Total por Unidade           | R$ 17.415,22       | ~R$ 14.951,69          |

:::tip
Ao otimizar os componentes e processos, é possível reduzir o custo unitário em **cerca de 15%** em relação ao protótipo original.
:::

---

## Período de Implementação

Considera-se que a implementação do projeto em escala será feita ao longo de **12 meses**, o que é apropriado para:

- Homologação em ambientes hospitalares.
- Treinamento da equipe de farmacêuticos.
- Instalação física e ajustes operacionais.
- Ciclo de suporte técnico e garantia.

---

- O **protótipo** teve um custo de aproximadamente **R$ 17.415,22**.
- A **implementação em escala** prevê um custo **por unidade de cerca de R$ 14.951,69**, considerando robustez e suporte.
- O investimento total estimado para **26 unidades** é de aproximadamente **R$ 402.216,40**, já incluindo suporte técnico por 12 meses.
- O projeto demonstra **viabilidade econômica clara**, especialmente quando considerado o impacto positivo nas operações farmacêuticas, a padronização de processos e a rastreabilidade dos medicamentos.
