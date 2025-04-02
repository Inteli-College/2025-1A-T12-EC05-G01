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
| **Placas de Controle**     | 1          | Dobot Magician Lite              | R$ 16.000,00   |
| **Placas de Controle**     | 1          | Arduíno Nano                     | R$ 31,50       |
| **Sensores**               | 1          | MH-ET Live Scanner V3.0          | R$ 243,82      |
| **Sensores**               | 1          | Sensor Infravermelho TCRT5000    | R$ 6,50        |
| **Acessórios e Cabos**     | 13         | Jumpers                          | R$ 5,00        |
| **Acessórios e Cabos**     | 1          | Fita Dupla Face                  | R$ 3,00        |
| **Componentes Eletrônicos**| 1          | Resistor de 330Ω                 | R$ 0,75        |
| **Componentes Eletrônicos**| 1          | Resistor de 1kΩ                  | R$ 0,75        |
| **Prototipagem**           | 1          | Protoboard Micro                 | R$ 3,90        |
| **Estrutura e Proteção**   | 1          | Case para Raspberry Pi           | R$ 30,00       |
|                            |            |                                  |                |
|                            |            | **Total do Protótipo**           | **R$ 17.415,22** |

---

## Estimativa de Custo para Implementação em Escala

A seguir, a estimativa para produção de **50 unidades**, já considerando a substituição de componentes mais caros por alternativas industriais acessíveis e a eliminação de elementos de prototipagem.

| Item                                      | Estimativa Unitária | Quantidade | Custo Total Estimado |
|-------------------------------------------|---------------------|------------|------------------------|
| Placa personalizada com microcontrolador  | R$ 150,00           | 50         | R$ 7.500,00            |
| Sensor QR Code industrial (OEM)           | R$ 120,00           | 50         | R$ 6.000,00            |
| Sensor infravermelho                      | R$ 4,00             | 50         | R$ 200,00              |
| Estrutura customizada (impressão/injeção) | R$ 300,00           | 50         | R$ 15.000,00           |
| Braço robótico simplificado               | R$ 3.500,00         | 50         | R$ 175.000,00          |
| Protoboards e resistores (produção)       | R$ 15,00            | 50         | R$ 750,00              |
| Cabos, conectores, acabamentos            | R$ 50,00            | 50         | R$ 2.500,00            |
| Suporte técnico (12 meses)                | R$ 300,00/mês       | —          | R$ 3.600,00            |

**Total Previsto para Escala (~50 unidades + suporte):** **R$ 210.550,00**

---

## Comparativo: Protótipo vs Escala

| Item                        | Protótipo          | Escala (por unidade)  |
|-----------------------------|--------------------|------------------------|
| Braço Robótico              | R$ 16.000,00       | R$ 3.500,00            |
| Placa de Controle           | R$ 1.090,00        | R$ 150,00              |
| Leitor QR Code              | R$ 243,82          | R$ 120,00              |
| Total por Unidade           | R$ 17.415,22       | ~R$ 4.200,00           |

:::tip
Ao otimizar os componentes e processos, é possível reduzir o custo unitário em **mais de 75%** em relação ao protótipo original.
:::

---

## Período de Implementação

Considera-se que a implementação do projeto em escala será feita ao longo de **12 meses**, o que é apropriado para:

- Homologação em ambientes hospitalares.
- Treinamento de equipes locais.
- Instalação física e ajustes operacionais.
- Ciclo de suporte técnico e garantia.

---

- O **protótipo** teve um custo de aproximadamente **R$ 17.415,22**.
- A **implementação em escala** reduz o custo por unidade para cerca de **R$ 4.200,00**.
- O investimento total estimado para 50 unidades é de **R$ 210.550,00**, incluindo suporte anual.
- O projeto demonstra **viabilidade econômica clara**, com retorno potencial a partir da otimização em escala e replicação da solução.
