---
title: Revisão de requisitos do projeto
sidebar_position: 1
slug: /revisao-requisitos
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Requisitos Funcionais e Não-Funcionais 

&nbsp;&nbsp;&nbsp;&nbsp;Requisitos representam as características, funcionalidades e restrições que um sistema deve possuir para atender às necessidades dos usuários e stakeholders. Eles servem como a fundação do projeto de software, orientando o desenvolvimento, garantindo a qualidade do produto final e alinhando as expectativas entre clientes, desenvolvedores e demais envolvidos no processo. Requisitos funcionais são funcionalidades específicas que um sistema precisa ter.

&emsp;Em resumo, segundo a Revista Quero¹, deve-se tratar individualmente de todas as ações que o software deve ser capaz de fazer para atender às necessidades e expectativas do usuário. Já os requisitos não-funcionais podem ser definidos como essenciais para garantir que o projeto funcione de forma eficiente, segura e intuitiva, atendendo às necessidades de desempenho e de escalabilidade. Além disso, eles abordam a integridade dos dados, a proteção das informações pessoais dos usuários, e a compatibilidade com a infraestrutura tecnológica existente. A implementação adequada desses requisitos contribuirá para uma experiência eficiente, fluída e confiável.

## Requisitos funcionais

&emsp;A partir disso, na quinta e última sprint de desenvolvimento do projeto, foi feita uma atualização dos requisitos funcionais e não-funcionais do projeto, de modo a entender tudo aqui que foi atingido no decorrer da execução do projeto, o que ficou para trás, e o que mudou conforme o projeto foi sento iterado em conjunto com o parceiro. Por exemplo, na sprint 1, foram definidos os seguintes requisitos funcionais:

<div align="center">
<sup>Quadro 1 - Requisitos Funcionais Sprint 1</sup>

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


&emsp;Com base na tabela acima (quadro 1), e no estado de completude do projeto, é possível dizer que os seguintes requisitos não foram atendidos:
* RF04: em nenhum momento foi implementado um feedback que utilizasse leds ou buzzers para indicar status do robô ou status. Entretanto, existem, no sistema, feedbacks visuais na tela do computador para indicar falha na montagem de fitas de medicamento. 
* RF06: Ao final do projeto, não foi implementado em nenhum momento a geração de relatórios ou de arquivos csv com base nos dados de fitas montadas ou em separação.

&emsp;Com exceção dos dois requisitos funcionais acima, todos os outros foram implementados com sucesso, incluindo a integração com prescrições eletrônicas, seleção de medicamentos pelo robô, validação por sensores inteligentes, registro de operações, controle do estoque e interface de monitoramento. Além disso, um requisito funcional foi adicionado a partir de conversas e validações com o parceiro de projeto. Dessa forma, a tabela atualizada fica como:

<div align="center">
<sup>Quadro 2 - Requisitos Funcionais Sprint 5</sup>

| ID  | Requisito Funcional                 | Descrição                                                                                                                                                                | Regra de Negócio                                                                                          |
|---------|----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| RF01    | Integração com prescrições eletrônicas | O sistema deve ser capaz de importar dados das prescrições eletrônicas do hospital.                                                                       | A integração deve ser feita em tempo real para garantir a atualização constante das prescrições.                  |
| RF02    | Seleção de medicamentos pelo robô Dobot  | O robô Dobot deve ser capaz de identificar e selecionar medicamentos com base nas prescrições recebidas.                                                  | O robô deve validar o medicamento através de leitura de código de barras antes da separação.                       |
| RF03    | Validação por sensores inteligentes     | O sistema deve utilizar sensores para validar o peso e o volume dos medicamentos selecionados.                                                                | A validação deve ser automática e impedir a continuidade do processo em caso de divergências.                        |
| RF04    | Registro de operações                  | O sistema deve registrar todas as etapas da separação, incluindo tempos e identificadores dos medicamentos.                                              | Os registros devem ser salvos automaticamente no banco de dados e estar disponíveis para auditoria.           |
| RF05    | Controle de estoque                     | O sistema deve atualizar o estoque automaticamente após a separação dos medicamentos.                                                                  | O controle de estoque deve ser integrado ao sistema hospitalar em tempo real.                                 |
| RF06    | Interface de monitoramento              | O sistema deve possuir uma interface amigável para monitoramento em tempo real das operações do robô e dos sensores.                                   | A interface deve permitir ajustes manuais e exibir alertas em caso de falhas.                                |
| RF07    | Triagem de prescrições              | O sistema deve permitir que o usuário aprove ou modifique a quantidade de medicamentos em uma prescrição recebida.                                   | A interface deve permitir ajustar a prescrição para valores errados ou aprová-las.

<sup>Fonte: Material produzido pelo grupo Dose Certa (2025)</sup>
</div>


## Requisitos não-funcionais

&emsp;Também na primeira sprint, os seguintes requisitos não-funcionais foram apontados:


<div align="center">
<sup>Quadro 3 - Requisitos Não Funcionais Sprint 1</sup>

| RNF#  | Descrição                                                                                                 | Aspecto de Qualidade     | Referência ao Negócio                                                                                          | Teste                                                                                                  | Caso de Aceite                                                                                                         | Caso de Recusa                                                                                                       | Prioridade |
|-----------|-----------------------------------------------------------------------------------------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|----------------|
| RNF01     | O tempo máximo de resposta do robô Dobot para cada medicamento deve ser de 3 segundos.                         | Eficiência de performance   | Atende à necessidade de um processo rápido e eficiente, garantindo agilidade na separação de medicamentos.         | Testes de desempenho para medir o tempo de resposta em condições normais e de pico.                        | O robô seleciona e valida medicamentos em menos de 3 segundos em 95% das tentativas.                                     | O robô demora mais de 3 segundos em 5% ou mais das tentativas.                                                           | Não            |
| RNF02     | O sistema deve garantir a confidencialidade dos dados dos pacientes e medicamentos.                              | Segurança                   | Atende à necessidade de proteger dados sensíveis, conforme a LGPD.                                                  | Testes de autenticação, autorização e simulação de ataques para avaliar a segurança.                       | Dados sensíveis são protegidos, e acessos não autorizados são bloqueados.                                             | Dados são acessíveis por usuários não autorizados ou falhas na identificação de tentativas de invasão.               | Sim            |
| RNF03     | O sistema deve garantir o armazenamento de dados mesmo em caso de falha de energia ou rede.                      | Confiabilidade               | Garante que nenhuma informação importante será perdida durante interrupções.                                   | Testes de falha de rede/energia, verificando o armazenamento local e posterior sincronização.                   | Dados armazenados localmente são sincronizados corretamente após a restauração da conexão.                             | Perda de dados durante falhas ou problemas na sincronização após o retorno da conexão.                                | Sim            |
| RNF04     | O sistema deve ser escalável para armazenar dados de até 50.000 medicamentos.                                   | Manutenibilidade             | Permite o crescimento do volume de dados sem comprometer a performance do sistema.                                    | Testes de estresse para verificar a capacidade de armazenamento e acesso a grandes volumes de dados.       | O sistema armazena e acessa dados de 50.000 medicamentos sem perda significativa de desempenho.                           | O sistema apresenta lentidão ou falhas ao acessar dados em grandes volumes.                                              | Não            |
| RNF05     | A interface do sistema deve ser intuitiva e acessível para os profissionais de saúde.                            | Usabilidade                  | Facilita o uso do sistema por farmacêuticos e técnicos, aumentando a eficiência operacional.                        | Testes de usabilidade com a equipe da farmácia, avaliando a facilidade de uso e compreensão da interface.      | Profissionais conseguem operar o sistema sem necessidade de treinamento extensivo.                                        | Profissionais enfrentam dificuldades significativas para operar o sistema sem suporte constante.                         | Sim            |

<sup>Fonte: Material produzido pelo grupo Dose Certa (2025)</sup>
</div>

&emsp;Ao final do projeto, foi possível entender que nenhum requisito funcional apontado no começo precisou de alterações, e que o sistema desenvolvido conseguiu atingir todos esses requisitos, como por exemplo:
* Escalabilidade em banco de dados: o schema do banco de dados foi desenvolvido de modo a facilitar a presença de um grande volume de dados, podendo armazenar facilmente mais de 50000 medicamentos.
* Acessibilidade do sistema: todas as telas foram desenvolvidas de maneira simples e acessível para quaisquer profissionais da área da saúde. 
* Armazenamento em caso de falha: o sistema sempre armazena os logs de tudo o que acontece no banco de dados, inclusive em casos de falha.
* Tempo máximo de resposta: o robô demora cerca de 1s (o requisito é de 3s) para iniciar a coleta de um medicamento. 
 
&emsp;Dessa forma, não foram realizadas alterações em relação aos requisitos não-funcionais no decorrer do projeto. 

&emsp;Por fim, é importante ressaltar que a iteração feita durante o projeto, aqui em especial nos requisitos, é algo fundamental e que garante que, num projeto ágil, a mudança constante de requisitos que um parceiro de projetos tem possa ser atendida o mais rápido possível. Assim, atualizar tais requisitos torna mais fácil o trabalho da equipe de desenvolvimento, que pode sempre focar nas funcionalidades atualizadas e mais importantes para o sistema. 

## Bibliografia

[1] Requisitos funcionais e não funcionais: o que são, diferenças e exemplos. Disponível em: https://querobolsa.com.br/revista/requisitos-funcionais-e-nao-funcionais.

