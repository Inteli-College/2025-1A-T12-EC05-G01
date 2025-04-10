---
title: Fila de separação
sidebar_position: 1
slug: /fila-separacao
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Fila de separação de fitas

&emsp;A fila de separação de fitas de medicamento, neste projeto, constitui a área da interface visual do sistema de automação que contempla todas aquelas fitas que já foram aprovadas para separação porém ainda não foram separadas pelo robô. Nesta tela, o farmacêutico ou técnico é capaz de visualizar as fitas que estão aguardando montagem e, então, liberar uma por uma para a montagem. Além disso, ele sempre pode ver o status de funcionamento e as ações que o Dobot está executando no momento.

## Funcionamento

&emsp;Em relação ao seu funcionamento, a explicação é relativamente simples: ao carregar a página, o sistema recebe do banco de dados as fitas que estão aguardando separação. Existe, então, um botão em cada fita, onde o usuário pode clicar para iniciar a separação de tal fita. Clicando neste botão, duas requisições são feitas, uma para adicionar todos os medicamentos na fita do Dobot e outra para finalizar a montagem e liberar o robô para pegar os medicamentos. Com isso, apertando o botão, o robô começa a pegar os medicamentos até que finalize a fita. Vale ressaltar que todo o processo pode ser acompanhado na barra lateral, que exibe as ações do Dobot no momento. Abaixo, é possível ver uma imagem que demonstra o funcionamento da tela:

<div style={{ textAlign: 'center' }}>
  <p><strong>Figura 1 - Visualização da tela de separação de fitas</strong></p>
  <img 
    src={useBaseUrl('/img/fila_separacao.jpeg')} 
    alt="Visualização da tela de separação de fitas" 
    title="Visualização da tela de separação de fitas" 
    style={{ maxWidth: '100%', height: 'auto' }}
  />
  <p>Fonte: Elaborado pelo grupo Dose Certa (2025)</p>
</div>

&emsp;Em termos de código, foi desenvolvida uma rota a mais no backend Flask do robô e foram feitas alterações nesta página de fila de separação. Em relação à rota no backend do robô, foi adicionada uma função para que ele fosse capaz de receber um payload com uma fita de medicamentos completa no formato `{medicamento: quantidade}` e passasse isso para o seu próprio objeto de fita. Assim, no frontend, só é necessário formatar essa fita no formato esperado pelo Dobot e chamar duas rotas: uma para adicionar os medicamentos na fita e outra para começar a montagem. Dessa forma, esses procedimentos possibilitam iniciar a montagem da fita instantaneamente ao apertar o botão. 

&emsp;Finalizando, é importante destacar que nem todos os comportamentos esperados foram implementados nesta tela. Por exemplo, o indicador de status da fita, que na imagem acima aparece como "aguardando", não é atualizado em nenhum momento. Entretanto, todos esses passos ficam como essenciais para serem desenvolvidos nos próximos passos do projeto. Além disso, esta é, provavelmente, uma das telas mais importantes de toda a aplicação e agrega tremendo valor ao sistema e ao parceiro de projeto, uma vez que é aqui que o usuário consegue liberar o robô para realizar a sua principal função: a montagem de fitas de medicamentos.