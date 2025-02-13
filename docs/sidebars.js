// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  // docsSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  docsSidebar: [
    'Início',
    {
      type: 'category',
      label: 'Introdução do projeto',
      items: [
        'Introdução do projeto/Introdução',
        'Introdução do projeto/Objetivos',
        'Introdução do projeto/Proposta de solução',
        'Introdução do projeto/Justificativa',
      ],
    },
    {
      type: 'category',
      label: 'Descrição da solução',
      items: [
        'Descrição da solução/Como a solução proposta deverá ser utilizada',
        'Descrição da solução/Quais os benefícios trazidos pela solução proposta',
        'Descrição da solução/Qual a solução proposta',
        'Descrição da solução/Qual será o critério de sucesso e qual medida será utilizada para o avaliar',
        'Descrição da solução/Qual é o problema a ser resolvido',
      ],
    },
    {
      type: 'category',
      label: 'Entendimento do Negócio',
      items: [
        'Entendimento do Negócio/matriz_de_risco',
        'Entendimento do Negócio/canvas_da_proposta_de_valor',
        'Entendimento do Negócio/Matriz-e-nao-e',
        'Entendimento do Negócio/canvas_mvp',
      ],
    },
    {
      type: 'category',
      label: 'Personas',
      items: [
        'Personas/Juliana/Juliana',
        'Personas/Rodrigo/Rodrigo',
      ],
    },
    {
      type: 'category',
      label: 'Imersão preliminar',
      items: [
        'Imersão preliminar/definicao',
        'Imersão preliminar/questionário',
        'Imersão preliminar/tipos de pesquisa',
        'Imersão preliminar/Pesquisa Desk/encarte erros de medicação',
        'Imersão preliminar/Pesquisa Desk/errosDeDispensaçãoNoAmbitoHospitalar',
        'Imersão preliminar/Pesquisa Desk/estratégiasParaReduzirErros',
        'Imersão preliminar/Pesquisa Desk/pesquisa desk',
      ],
    },
    {
      type: 'category',
      label: 'Arquitetura do Sistema',
      items: [
        'Arquitetura do Sistema/Diagrama de blocos',
        'Arquitetura do Sistema/Requisitos/Funcionais',
        'Arquitetura do Sistema/Requisitos/Não Funcioanis',
      ],
    },
  ],
};

export default sidebars;
