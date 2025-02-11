---
sidebar_position: 1
---

# Matriz de risco

&nbsp;&nbsp;&nbsp;&nbsp;A matriz de risco é uma ferramenta essencial para a identificação, avaliação e priorização de potenciais ameaças e oportunidades que possam impactar o sucesso de um projeto. Sua importância reside na capacidade de proporcionar uma visão clara dos fatores que podem interferir no alcance dos objetivos, permitindo a adoção de estratégias eficazes de mitigação ou aproveitamento. 

## 1. Estrutura da Matriz de Risco

&nbsp;&nbsp;&nbsp;&nbsp;A seguinte matriz de risco foi elaborada considerando os riscos e oportunidades do projeto, abrangendo aspectos relacionados ao próprio grupo, ao parceiro, ao hardware e ao software.

<p align="center"><strong>Figura X - Matriz de risco</strong></p>
<p align="center">
    <img
        src="../../img/matrizderisco.png"
        alt="Matriz de risco"
        title="Matriz de risco"
        style={{ maxWidth: '80%', height: 'auto' }}
    />
</p>
<p align="center">Fonte: Elaborado pelos próprios autores</p>


&nbsp;&nbsp;&nbsp;&nbsp;Nela, é possível observar riscos que podem comprometer o desenvolvimento do projeto, mas, ao mesmo tempo, também entende-se que é necessário estar preparado para aproveitar as oportunidades que podem surgir durante a progressão da solução.
## 2. Riscos pouco comprometedores

:::tip Estratégia de Mitigação
Os riscos abaixo possuem **baixa probabilidade e baixo impacto**, mas ainda exigem medidas preventivas.
:::

* **Falha na leitura dos códigos de barras**: Os insumos podem descer a rampa de modo que os códigos de barras não fiquem voltados para a região que o robô consegue realizar a leitura. Para mitigar, no MVP, serão feito testes com os insumos dentro de um material específico, para evitar que ocorram os casos de erros de leitura por parte do robô dobot. Assim, a possibilidade de ocorrer erros de leitura podem acabar sendo baixas, assim como o impacto desse risco.

* **Erros de formatação dos dados importados pela API**: Os dados importados pela API do Hospital das Clínicas da Unicamp podem vir com problemas de formatação. Para contornar problemas advindos disso, quando for disponibilizado para a equipe a API do HC, serão feito diversos testes para entender como os dados serão importados. Assim, entendendo isso, os riscos associados a essa questão serão facilmente minimizados e evitados.
  

## 3. Riscos moderadamente comprometedores

:::warning Impacto Moderado
Os riscos abaixo podem impactar o andamento do projeto, mas podem ser gerenciados com boas práticas.
:::

* **Segurança de dados**: Existe o risco de vazamento de informações sensíveis, já que o sistema lida com dados de pacientes e inventário de medicamentos. Para evitar esse problema, serão adotadas medidas como uso de senhas fortes para o banco de dados, controle de acesso restrito a funções essenciais e verificações periódicas de possíveis brechas de segurança. Também é planejado seguir as normas previstas na LGPD.


* **Problemas de usabilidade**: Durante o desenvolvimento da interface do usuário na aplicação web, pode ser desenvolvida uma interface com uma usabilidade pouco intuitiva para os farmacêuticos e técnicos que utilizarão o produto final. Com isso em mente, já no início do desenvolvimento do projeto, foi feita uma pesquisa a respeito das personas que utilizarão nosso sistema com o intuito de desenvolver uma solução centrada no usuário. Além disso, para mitigar a possibilidade de riscos associados à usabilidade afetarem o projeto, serão realizados testes de usabilidade antes da entrega final.


* **Robô falhar coletar os insumos**: É possível que o robô apresente certas inconsistências ao tentar coletar insumos de variados formatos. Para evitar que isso possa se tornar um problema real, o grupo fará testes já no início de desenvolvimento do projeto, com o foco em testar diferentes materiais, pesos e dimensões de insumos, simulando o que ele irá coletar dentro de uma farmácia do HC. Caso o robô, de fato, apresente problemas ao agarrar ou com a sucção, a equipe irá conversar com os professores e técnicos de laboratório para encontrar maneiras de minimizar esses efeitos adversos no desenvolvimento do projeto. 


## 4. Riscos altamente comprometedores

:::danger Impacto Alto
Estes riscos podem comprometer o projeto se não forem gerenciados corretamente.
:::

* **Falha na comunicação entre hardware e software**: Como a solução envolve a integração contínua entre hardware e software, é de fundamental importância a comunicação plena entre o dobot, a aplicação web e os servidores. Nesse contexto, há um risco baixo, mas de muito impacto, de haver falhas na comunicação entre hardware e software. Para mitigar esse risco, o projeto incluirá protocolos de comunicação robustos, com verificação de funcionamanto e maneiras de reconexão automática (quando necessário). Assim, falhas pontuais podem ser rapidamente detectadas e corrigidas.
    

* **Dificuldades de integração com o sistema do HC**: Para que o projeto desenvolvido funcione adequadamente e seja integrado ao Hospital das Clínicas da Unicamp, é essencial que o sistema desenvolvido seja integrado corretamente com o do hospital. No entanto, ao longo do desenvolvimento, há uma possibilidade alta de a equipe possuir dificuldades em fazer a integração com as APIs do hospital, uma vez que boa parte dos membros não estão familiarizados com isso e irão aprender ao longo do projeto. Em adição a essa questão, as APIs disponibilizadas pelo hospital podem fornecer mais informações do que o necessário para o escopo do projeto. Com tudo isso, o grupo pode enfrentar atrasos no cronograma. Portanto, é um risco com um alto impacto e que, para mitigar, a equipe deve aproveitar a abertura que os professores e monitores dão para auxiliar no desenvolvimento do projeto, além de que membros mais experientes devem atuar como mentores para auxiliar na integração, reduzindo a curva de aprendizado dos demais.


## 5. Oportunidades

:::success Oportunidade de Crescimento
Além dos riscos, há oportunidades estratégicas que podem ser exploradas.
:::

* **Otimização da separação e montagem**: Com a automação, o tempo gasto e a taxa de erros podem ser significativamente reduzidos, aumentando a segurança e a eficiência no hospital. É planejado monitorar indicadores-chave (taxa de erros, tempo de montagem) para refinar continuamente o processo e comprovar o ganho de produtividade para o hospital.

* **Escalabilidade e manutenibilidade**: A solução pode apresentar muitos dados que suportem a eficiência da solução, motivando a expansão para outras áreas de atuação do hospital. Pensando nessa possível oportunidade, será desenvolvida uma arquitetura modular e com uma documentação explicativa, facilitando tanto o crescimento do sistema quanto sua manutenção futura.


&nbsp;&nbsp;&nbsp;&nbsp;Portanto, com a elaboração dessa matriz de risco, **o grupo está preparado para evitar e mitigar possíveis riscos** que podem vir a prejudicar o desenvolvimento da solução. Também, **há planos de ações** para aproveitar da melhor maneira as oportunidades que poderão surgir ao longo do projeto.