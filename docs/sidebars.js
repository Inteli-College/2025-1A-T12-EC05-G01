// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // docsSidebar: [{type: 'autogenerated', dirName: '.'}],

  // Mas você pode criar uma sidebar manualmente
  docsSidebar: [
    'Início',
    {
      type: 'category',
      label: 'Sprint 1',
      items: [
        {
          type: 'category',
          label: 'Introdução do projeto',
          items: [
            'Sprint 1/Introdução do projeto/Introdução',
            'Sprint 1/Introdução do projeto/Objetivos',
            'Sprint 1/Introdução do projeto/Proposta de solução',
            'Sprint 1/Introdução do projeto/Justificativa',
          ],
        },
        {
          type: 'category',
          label: 'Descrição da solução',
          items: [
            'Sprint 1/Descrição da solução/Como a solução proposta deverá ser utilizada',
            'Sprint 1/Descrição da solução/Quais os benefícios trazidos pela solução proposta',
            'Sprint 1/Descrição da solução/Qual a solução proposta',
            'Sprint 1/Descrição da solução/Qual será o critério de sucesso e qual medida será utilizada para o avaliar',
            'Sprint 1/Descrição da solução/Qual é o problema a ser resolvido',
          ],
        },
        {
          type: 'category',
          label: 'Entendimento do Negócio',
          items: [
            'Sprint 1/Entendimento do Negócio/matriz_de_risco',
            'Sprint 1/Entendimento do Negócio/canvas_da_proposta_de_valor',
            'Sprint 1/Entendimento do Negócio/Matriz-e-nao-e',
            'Sprint 1/Entendimento do Negócio/canvas_mvp',
          ],
        },
        {
          type: 'category',
          label: 'Personas',
          items: [
            'Sprint 1/Personas/Juliana/Juliana',
            'Sprint 1/Personas/Rodrigo/Rodrigo',
          ],
        },
        {
          type: 'category',
          label: 'Imersão preliminar',
          items: [
            'Sprint 1/Imersão preliminar/definicao',
            'Sprint 1/Imersão preliminar/questionário',
            'Sprint 1/Imersão preliminar/tipos de pesquisa',
            'Sprint 1/Imersão preliminar/Pesquisa Desk/pesquisa desk',
            'Sprint 1/Imersão preliminar/Pesquisa Desk/encarte erros de medicação',
            'Sprint 1/Imersão preliminar/Pesquisa Desk/errosDeDispensaçãoNoAmbitoHospitalar',
            'Sprint 1/Imersão preliminar/Pesquisa Desk/estratégiasParaReduzirErros',
          ],
        },
        {
          type: 'category',
          label: 'Arquitetura do Sistema',
          items: [
            'Sprint 1/Arquitetura do Sistema/Diagrama de blocos',
            'Sprint 1/Arquitetura do Sistema/Requisitos/Funcionais',
            'Sprint 1/Arquitetura do Sistema/Requisitos/Não Funcioanis',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Sprint 2',
      items: [
        'Sprint 2/User Stories/user-stories',
      ],
    },
  ],
};

export default sidebars;
