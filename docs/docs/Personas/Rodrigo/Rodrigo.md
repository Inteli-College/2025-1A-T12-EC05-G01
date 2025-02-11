---
title: Persona Rodrigo - Técnico de Farmácia
sidebar_position: 13
slug: /Persona/Rodrigo
---
import useBaseUrl from '@docusaurus/useBaseUrl';

# Persona Técnico de Farmácia - Rodrigo Mendes

## Persona
&emsp; A segunda persona desenvolvida foi o Rodrigo Mendes. Essa persona é a que mais irá interagir com a nossa solução, iniciando o processo de separação do robô, pegando os medicamentos separados para selagem e entrega da fita de medicamentos para a equipe de enfermagem para ser administrada nos pacientes. 


<div style={{textAlign:'center'}}>
    <p><strong>Figura X- Persona Rodrigo Mendes parte 1 </strong></p>
        <img
        src={useBaseUrl('/img/personaRodrigo1.png')}
        alt="Persona Rodrigo Mendes"
        title="Persona Rodrigo Mendes"
        style={{maxWidth:'80%', height:'auto'}}
        />
    <p> Fonte: Elaborado pelos próprios autores</p>
</div>

&emsp; Como mostra a imagem, Rodrigo tem 22 anos e trabalha como técnico de farmácia no HC de campinas. Ele é formado em técnico de farmácia pelo Instituto Federal de São Paulo e sempre demostoru interesse pela área da saúde. 

&emsp; Atualmente, Rodrigo tatua na farmácia do Hospital das Clínicas há 5 anos é e responsável pela separação dos medicamentos. Além disso, ainda realiza tarefas adicionais como verificar e organizar o estoque de medicamentos. Seu maior objetivo profissional é conhecer mais sobre as possibilidades de tecnologia no ramo da saúde, buscando maneiras de otimizar os processos e minimizar erros, tornando a farmácia mais eficiente e segura para os pacientes. 

&emsp; Gabriel é extremamente detalhista e organizado no que faz. Ele sempre confere duas ou três vezes os medicamentos antes de liberá-los, pois sabe que qualquer erro pode impactar diretamente a saúde dos pacientes. Quando um novo processo é implementado na farmácia, ele gosta de testá-lo e entender seu funcionamento antes de adotá-lo totalmente, garantindo que tudo ocorra conforme o esperado.

&emsp; Em relação à tecnologia, apesar de ter contato com a tecnologia todos os dias, sua experiência com novas ferramentas em seu trabalho é limitada, já que o hospital ainda conta com processos mais tradicionais.

<div style={{textAlign:'center'}}>
    <p><strong>Figura X- Persona Rodrigo Mendes parte 2 </strong></p>
        <img
        src={useBaseUrl('/img/personaRodrigo2.png')}
        alt="Persona Rodrigo Mendes"
        title="Persona Rodrigo Mendes"
        style={{maxWidth:'80%', height:'auto'}}
        />
    <p> Fonte: Elaborado pelos próprios autores</p>
</div>

&emsp; Em seu trabalho, as principais dores que Rodrigo enfrenta incluem:

* Que a carga de trabalho aumente ao invés de diminuir por conta de eventuais erros que o sistema pode apresentar, causando um retrabalho.

* Que erros causados pelo sistema prejudiquem a segurança dos pacientes, sendo por erro de medicamentos ou quantidades. 

&emsp; Além disso, Rodrigo tem interesse em acompanhar de perto a implementação desta solução na farmácia. Ele quer entender como o sistema funciona para poder monitorar e garantir que ele está funcionando corretamente e, se necessário, realiar ajustes que auxiliem o funcionamento do sistema.

&emsp; Por fim, no seu mapa de empatia, Rodrigo deseja garantir a segurança dos pacientes, já que qualquer erro pode se tornar muito maior quando se trata de medicamentos. Além disso, ele sente que tarefas repetitivas afetam sua motivação e o medo de causar erros fatais é um estresse constante. Apesar disso, ele tenta manter tudo sob controle, mesmo que, em alguns momentos, a grande quantidade de trabalho acaba comprometendo sua organização. Assim, essa persona é essencial para entender as necessidades do usuário que estará em constante contato com a solução, garantindo que o sistema não apenas otimize o tempo de trabalho mas também garanta a segurançaa e confiabilidade do sistema.



## Mapa de jornada do usuário

&emsp; Para entender melhor qual seria a interação do usuário com o sistema de automação, criamos um mapa de jornada do usuário. Rodrigo Mendes trabalha na separação de medicamentos em uma farmácia hospitalar e recentemente começou a utilizar um sistema automatizado para esse processo. Sua jornada passa por quatro etapas principais: Recebimento da prescrição aprovada, Separação automatizada, Conferência do processo de separação e Selagem e liberação da fita.

<div style={{textAlign:'center'}}>
    <p><strong>Figura X- Mapa de jornada do usuário Rodrigo </strong></p>
        <img
        src={useBaseUrl('/img/mapaJornadaRodrigo.jpg')}
        alt="Persona Rodrigo Mendes"
        title="Persona Rodrigo Mendes"
        style={{maxWidth:'80%', height:'auto'}}
        />
    <p> Fonte: Elaborado pelos próprios autores</p>
</div>

1. Recebimento da prescrição aprovada
O processo de Rodrigo começa quando ele recebe a notificação de que uma prescrição foi aprovada pelo farmacêutico e precisa ser separada. Ele acessa o sistema e verifica todos os medicamentos e suas quantidades. Neste momento, ele sente um certo receio quanto à confiabilidade do sistema, questionando se as informações estão corretas e se a automação realmente ajudará a reduzir erros.

2. Separação automatizada
Após conferir os detalhes, Rodrigo seleciona a opção para que o robô inicie a separação dos medicamentos. O sistema então executa o processo automaticamente, pegando e depositando os medicamentos no local correto. Durante essa etapa, Rodrigo acompanha atentamente a operação, inicialmente inseguro, mas depois sentindo confiança ao ver que o robô parece funcionar corretamente, sem apresentar falhas aparentes.

3. Conferência do processo de separação
Após a separação ser realizada, Rodrigo verifica se os medicamentos e as quantidades correspondem à prescrição. Ao confirmar que tudo está correto, ele sente satisfação ao perceber que seu trabalho ficou mais ágil e seguro. Essa etapa reforça a confiabilidade do sistema e dá a Rodrigo mais tranquilidade para seguir com as próximas fases.

4. Selagem e liberação da fita
Após conferir os medicamentos, Rodrigo realiza a selagem da fita e a entrega para a equipe de enfermagem, que será responsável pela administração aos pacientes. Ele sente orgulho ao perceber que o novo sistema ajudou a reduzir a chance de erro e facilitou seu trabalho.

**Oportunidades**
&emsp; Uma possível melhoria no sistema seria a inclusão de informações sobre a disponibilidade de medicamentos em estoque no momento da triagem, além da possibilidade de enviar justificativas para prescrições que precisaram ser alteradas ou rejeitadas. Isso ajudaria Rodrigo a entender melhor o processo e a reduzir incertezas.

**Responsabilidades**
Para que o sistema funcione corretamente e atenda às necessidades de Rodrigo, o frontend precisa ser claro e intuitivo, minimizando erros por usabilidade. Já o backend deve garantir uma comunicação rápida e eficiente entre os servidores, evitando falhas no processamento das informações.