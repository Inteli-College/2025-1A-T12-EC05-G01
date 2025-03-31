---
title: Sistema de Monitoramento
sidebar_position: 2
slug: /sistema-de-monitoramento
---

## Banco de dados
    
&nbsp;&nbsp;&nbsp;&nbsp;Este é o esquema do nosso banco de dados:

![Imagem do banco de dados](../../../docs/static/img/bancodedados.jpg)

&nbsp;&nbsp;&nbsp;&nbsp;O banco de dados é mais aprofundando em outra seção da documentação.

## Operações CRUD

&nbsp;&nbsp;&nbsp;&nbsp;De acordo com Elmasri e Navathe em *Fundamentals of Database Systems*, "as operações de inserção, consulta, atualização e deleção são essenciais para a manipulação de dados, constituindo o núcleo funcional de um sistema de gerenciamento de banco de dados."

&nbsp;&nbsp;&nbsp;&nbsp;Baseado nestes principios que nós desenvolvemos o nosso banco de dados e operações CRUD: um acrônimo que representa as quatro operações básicas de manipulação de dados em um sistema de banco de dados.

- **Create (Criar):** Inserir novos registros.
- **Read (Ler):** Consultar e recuperar dados.
- **Update (Atualizar):** Modificar registros existentes.
- **Delete (Excluir):** Remover registros.

&nbsp;&nbsp;&nbsp;&nbsp;Para todas as tabelas no banco de dados foram implementadas as operações CRUD. Além disso, foi criada uma camada de lógica de aplicação, responsável por intermediar as requisições entre o frontend e o banco de dados. Essa camada inclui o tratamento de exceções, controle de sessões com o banco, padronização das respostas da API e execução de regras de negócio necessárias para o correto funcionamento da aplicação. Também foram utilizadas práticas como o carregamento eficiente de dados relacionados, garantindo performance e consistência nas respostas.

## Interface

&nbsp;&nbsp;&nbsp;&nbsp;Para a interface da aplicação foi usado React, uma biblioteca JavaScript para criação de interfaces de usuário, e para a estilização dos componentes foi utilizada a biblioteca styled-components, permitindo escrever estilos CSS diretamente dentro do JavaScript, com escopo local por componente.

&nbsp;&nbsp;&nbsp;&nbsp;Além disso, a página foi desenvolvida com TypeScript, garantindo segurança de tipos e melhor organização do código. Hooks como useState e useEffect são utilizados para controle de estado e efeitos colaterais.

&nbsp;&nbsp;&nbsp;&nbsp;A comunicação com o backend é feita por meio de requisições HTTP, consumindo uma API local que interage com o banco de dados para criar, consultar e alterar informações clínicas, como pacientes, medicamentos e prescrições médicas. A interface permite a seleção de medicamentos, a vinculação a pacientes, e o envio dessas informações de forma estruturada para o backend. Além disso, partes da aplicação se comunicam com um braço robótico (Dobot), também via API, permitindo capturar posições, controlar movimentos e configurar sequências associadas a medicamentos no sistema.

## QR code
&nbsp;&nbsp;&nbsp;&nbsp;O hardware utilizado para leitura é um leitor de código serial, conectado diretamente à aplicação. Um dos maiores desafios foi garantir a comunicação estável entre o leitor e o sistema, considerando a diversidade de portas seriais e variações nos dispositivos. A conexão com o leitor é feita automaticamente através de uma varredura nas portas disponíveis. O sistema seleciona a porta correta, configura os parâmetros necessários e inicia o processo de escaneamento contínuo, pronto para detectar qualquer código QR posicionado frente ao leitor.

&nbsp;&nbsp;&nbsp;&nbsp;Cada leitura realizada é tratada por uma camada lógica que converte os dados brutos em informações estruturadas. Essas informações são então armazenadas em um banco de dados SQLite. Os registros incluem o conteúdo lido e um carimbo de tempo (timestamp) da leitura. Além da leitura, foram implementadas funcionalidades completas de CRUD sobre os registros escaneados. O usuário pode consultar os códigos já lidos, modificar informações associadas, excluir registros antigos ou inserir novos manualmente caso necessário.





