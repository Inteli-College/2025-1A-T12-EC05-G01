---
title: Resultados Ux Research
sidebar_position: 1
slug: /resultados
---

# O Questionário

&nbsp;&nbsp;&nbsp;&nbsp;Como explicado no tópico "[questionário](../../Sprint%201/Imersão%20preliminar/questionário.md)" da seção "imersão preliminar" dessa documentação, o Grupo Dose Certa optou por realizar uma pesquisa com os usuários do sistema em desenvolvimento, a fim de entender quais seriam as principais dores atualmente e quais as funcionalidades mais importantes a serem implementadas no sistema. Diante disso, no dia 21/02/2025, foram entrevistadas duas funcionárias do Hospital de Clínicas da Unicamp: Mariana Ribeiro Araújo (farmacêutica supervisora) e Suzana (técnica em farmácia). 

&nbsp;&nbsp;&nbsp;&nbsp;A ambas as entrevistadas foi aplicado o mesmo questionário, e dele foram obtidos os seguintes insights:

## Fluxo de tarefas:

> Triagem das prescrições -> pedido -> separação -> bipagem -> selagem da fita

* Aqui, entende-se pedido como a lista com os medicamentos da prescrição que foram aprovados, ou seja, se uma prescrição chega com 5 medicamentos e a triagem só aprova 3, então o pedido terá apenas os 3 medicamentos aprovados.

## Principais atividades a serem melhoradas:
- Controle de medicamentos devolvidos -> Nem todos os medicamentos devolvidos voltam com código de barras, então a maioria dos registros precisa ser feita manualmente e não via sistêmica;
- Triagem e controle do livro de psicotrópicos -> atividade hoje é realizada manualmente, então está muito suscetível a erros

## Frequência de erros na montagem:
&nbsp;&nbsp;&nbsp;&nbsp;Quanto a essa pergunta, as respostas das entrevistadas divergiram: enquanto uma delas afirmou que os erros são frequentes, ainda que tenham reduzido após implementação do processo de bipagem, a outra afirmou que os erros de montagem são raros e têm diminuído ainda mais. Diante disso, podemos afirmar que **os erros estão em diminuição**, mas sua frequência só poderá ser melhor definida com uma gama maior de entrevistados.

## Erros mais frequentes
&nbsp;&nbsp;&nbsp;&nbsp;É consenso entre as entrevistadas que os principais erros que ocorrem no processo de montagem das fitas são erros humanos, e estão relacionados principalmente a **erros de dosagem** e **confusão entre medicamentos parecidos**. Além disso, a **devolução de medicamentos a bins incorretos** pode levar a erros de separação, visto que esse processo leva em consideração os bins dos medicamentos.

## Tempo gasto no processo
&nbsp;&nbsp;&nbsp;&nbsp;No processo atual, o tempo médio de **correção** de fitas montadas incorretamente é de aproximadamente **15 minutos por fita**, e o processo de **checagem** de fitas pode levar aproximadamente **1 hora para cada 10 fitas**.

# Conclusão
&nbsp;&nbsp;&nbsp;&nbsp;Diante dos resultados do questionário, podemos concluir que, atualmente, as principais dores do cliente estão relacionadas ao excesso de tempo gasto com a montagem das fitas, assim como à frequência/ocorrência de erros humanos no processo. No mais, podemos admitir que o controle de estoque é a principal funcionalidade a ser implementada além do braço robótico, visto que com a união de ambos teremos uma redução nos erros humanos e um controle mais prático dos medicamentos que entram e saem da farmácia.
