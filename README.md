# Inteli - Instituto de Tecnologia e Liderança 

<p align="center">
<a href= "https://www.inteli.edu.br/"><img src="media/inteli.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0" width=40% height=40%></a>
</p>

<br>

# Grupo: Dose Certa

## Projeto: Dosaí

## 👨‍🎓 Integrantes: 

<div align="center">
  <table>
    <tr>
      <td align="center"><a href="https://www.linkedin.com/in/ana-beggiato/"><img style="border-radius: 10%;" src="./media/membros/ana.jpg" width="100px;" alt="Foto de Ana Beatriz Beggiato" /><br><sub><b>Ana Beatriz Beggiato</b></sub></a></td>
      <td align="center"><a href="https://www.linkedin.com/in/bruno-jancso-fabiani-0272532b3/"><img style="border-radius: 10%;" src="./media/membros/bruno.jpg" width="100px;" alt="Foto de Bruno Jancsó Fabiani"/><br><sub><b>Bruno Jancsó Fabiani</b></sub></a></td>
      <td align="center"><a href="https://www.linkedin.com/in/caio-alcantara-santos/"><img style="border-radius: 10%;" src="./media/membros/caio.jpg" width="100px;" alt="Foto de Caio de Alcantara Santos"/><br><sub><b>Caio de Alcantara Santos</b></sub></a></td>
      <td align="center"><a href="https://www.linkedin.com/in/carol-pascarelli/"><img style="border-radius: 10%;" src="./media/membros/carolina.jpg" width="100px;" alt="Foto de Carolina Pascarelli Alves Santos"/><br><sub><b>Carolina Pascarelli Alves Santos</b></sub></a></td>
      <td align="center"><a href="https://www.linkedin.com/in/danielppdias/"><img style="border-radius: 10%;" src="./media/membros/daniel.jpg" width="100px;" alt="Foto de Daniel Parente Pessoa Dias"/><br><sub><b>Daniel Parente Pessoa Dias</b></sub></a></td>
      <td align="center"><a href="https://www.linkedin.com/in/davi-abreu-da-silveira/"><img style="border-radius: 10%;" src="./media/membros/davi.jpg" width="100px;" alt="Foto de Davi Abreu da Silveira"/><br><sub><b>Davi Abreu da Silveira</b></sub></a></td>
      <td align="center"><a href="https://www.linkedin.com/in/sophia-emanuele-de-senne-silva/"><img style="border-radius: 10%;" src="./media/membros/sophia.jpg" width="100px;" alt="Foto de Sophia Emanuele de Senne Silva"/><br><sub><b>Sophia Emanuele de Senne Silva</b></sub></a></td>
    </tr>
  </table>
</div>

## 👩‍🏫 Professores:
### Coordenador(a) de curso
- <a href="https://www.linkedin.com/in/michele-bazana-de-souza-69b77763/">Michele Bazana de Souza</a>
### Orientador(a) 
- <a href="https://www.linkedin.com/in/murilo-zanini-de-carvalho-0980415b/">Murilo Zanini de Carvalho</a>
### Instrutores
- <a href="https://www.linkedin.com/in/andregodoichiovato/">André Godoi Chiovato</a>
- <a href="https://www.linkedin.com/in/filipe-gon%C3%A7alves-08a55015b/">Filipe Gonçalves de Souza Nogueira da Silva</a> 
- <a href="https://www.linkedin.com/in/gui-cestari/">Guilherme Henrique de Oliveira Cestari</a> 
- <a href="https://www.linkedin.com/in/lisane-valdo/">Lisane Valdo</a>
- <a href="https://www.linkedin.com/in/rodrigo-mangoni-nicola-537027158/">Rodrigo Mangoni Nicola</a>
- <a href="https://www.linkedin.com/in/geraldo-magela-severino-vasconcelos-22b1b220/">Geraldo Magela Severino Vasconcelos</a>

## 📜 Descrição

&nbsp;&nbsp;&nbsp;&nbsp;Descrição do projeto.

[Link para o vídeo de demonstração do funcionamento do projeto]()

## 📁 Estrutura de pastas

Dentre os arquivos e pastas presentes na raiz do projeto, definem-se:

- <b>media</b>: aqui estão os arquivos relacionados a parte gráfica do projeto, ou seja, as imagens e vídeos que os representam.

- <b>docs</b>: aqui estão todos os documentos do projeto..

- <b>src</b>: Todo o código fonte criado para o desenvolvimento do projeto, incluindo firmware, notebooks, backend e frontend, se aplicáveis.

- <b>README.md</b>: arquivo que serve como guia e explicação geral sobre o projeto (o mesmo que você está lendo agora).

### Guia de Como Rodar a Documentação do Projeto

A documentação do projeto foi feita utilizando a ferramenta Docusaurus, que é útil quando se é necessário criar artefatos de documentação visualmente agradáveis em um curto espaço de tempo. Assim, esse guia explica como configurar o ambiente e rodar o código da documentação, que consiste em uma aplicação web contendo tudo o que foi desenvolvido durante as 5 sprints de projeto.


#### **Pré-requisitos**  
Antes de começar, certifique-se de ter os seguintes programas instalados:  
- [Visual Studio Code (VSCode)](https://code.visualstudio.com/)  
- [Node JS v18.0 ou superior](https://nodejs.org/pt/download)
- [Git](https://git-scm.com/downloads)  

#### **Passo a Passo**  

##### 1. Clonar o repositório  
Abra o terminal e execute o comando:  

```bash
git clone https://github.com/Inteli-College/2025-1A-T12-EC05-G01
```

##### 2. Entre na pasta de documentação  
No VsCode, abra um terminal na raíz (pasta inicial do projeto) e rode o comando:  

```bash
cd docs
```

##### 3. Instalando dependências  
Para instalar as dependências, no mesmo terminal do passo anterior, rode:  

```bash
npm install
```

Caso não possua o npm, em sistemas Linux/Ubuntu/Debian, rode:

```bash
sudo apt install npm
```

Note que para sistemas como Windows (e normalmente também em Linux e MacOS) o npm já é instalado junto com o Node. 

##### 4. Rodando a documentação  

Estando em "C:/Users/Seu-Usuário/Caminho-para-pasta/2025-1A-T12-EC05-G01/docs>, ou seja, na pasta ```docs``` do projeto, rode, no mesmo terminal dos passos anteriores, o seguinte comando:

```bash
npm start
```

Após rodar este comando, você verá algumas informações no terminal. A primeira vez rodando a documentação pode levar alguns minutos, então tenha paciência. Caso tudo ocorra corretamente, ao final da inicialização será possível acessar a documentação no navegador através da url [localhost:3000](localhost:3000). Conseguindo visualizar a documentação, você será capaz de ver tudo o que foi desenvolvido em cada sprint do projeto.
## 🗃 Histórico de lançamentos

### 0.5.0 - 11/04/2025

### 0.4.0 - 28/03/2025 

### 0.3.0 - 14/03/2025

### 0.2.0 - 28/02/2024

### 0.1.0 - 14/02/2025

## 📋 Licença/License

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL">Dose Certa</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.inteli.edu.br/">Inteli</a>, <a href="https://github.com/anabeggiato">Ana Beatriz Beggiato<a>, <a href="https://github.com/BrunoFabiani">Bruno Jancsó Fabiani</a>, <a href="https://github.com/caio-alcantara">Caio de Alcantara Santos</a>, <a href="https://github.com/carol-pascarelli">Carolina Pascarelli Alves Santos</a>, <a href="https://github.com/danielppd">Daniel Parente Pessoa Dias</a>, <a href="https://github.com/daviiabreu">Davi Abreu da Silveira</a>, <a href="https://github.com/SophiSenne">Sophia Emanuele de Senne Silva</a>