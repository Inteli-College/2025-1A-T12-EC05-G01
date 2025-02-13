import React from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout title="Home" description="Página inicial do projeto Dose Certa">
      <div className={styles.container}>
        <h2 className={styles.title}>Inteli - Instituto de Tecnologia e Liderança</h2>
        <p align="center">
          <a href="https://www.inteli.edu.br/">
            <img src={useBaseUrl('media/inteli.png')} alt="Inteli - Instituto de Tecnologia e Liderança" className={styles.logo} />
          </a>
        </p>
        <br />
        <h2 className={styles.projectName}>Nome do Projeto</h2>
        <h3 className={styles.sectionTitle}>👨‍🎓 Integrantes:</h3>
        <div align="center">
          <table className={styles.table}>
            <tbody>
              <tr>
                {[
                  { name: "Ana Beatriz Beggiato", img: "ana.jpg", linkedin: "ana-beggiato" },
                  { name: "Bruno Jancsó Fabiani", img: "bruno.jpg", linkedin: "bruno-jancso-fabiani-0272532b3" },
                  { name: "Caio de Alcantara Santos", img: "caio.jpg", linkedin: "caio-alcantara-santos" },
                  { name: "Carolina Pascarelli Alves Santos", img: "carolina.jpg", linkedin: "carol-pascarelli" },
                  { name: "Daniel Parente Pessoa Dias", img: "daniel.jpg", linkedin: "danielppdias" },
                  { name: "Davi Abreu da Silveira", img: "davi.jpg", linkedin: "davi-abreu-da-silveira" },
                  { name: "Sophia Emanuele de Senne Silva", img: "sophia.jpg", linkedin: "sophia-emanuele-de-senne-silva" }
                ].map((member) => (
                  <td align="center" key={member.name} className={styles.member}>
                    <a href={`https://www.linkedin.com/in/${member.linkedin}/`}>
                      <img style={{ borderRadius: '10%' }} src={useBaseUrl(`./static/img/fotos-grupo/${member.img}`)} width="100px" alt={`Foto de ${member.name}`} />
                      <br /><sub><b>{member.name}</b></sub>
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3 className={styles.sectionTitle}>👩‍🏫 Professores:</h3>
        <h4 className={styles.subSectionTitle}>Coordenador(a) de curso</h4>
        <ul className={styles.list}>
          <li><a href="https://www.linkedin.com/in/michele-bazana-de-souza-69b77763/">Michele Bazana de Souza</a></li>
        </ul>
        <h4 className={styles.subSectionTitle}>Orientador(a)</h4>
        <ul className={styles.list}>
          <li><a href="https://www.linkedin.com/in/murilo-zanini-de-carvalho-0980415b/">Murilo Zanini de Carvalho</a></li>
        </ul>
        <h4 className={styles.subSectionTitle}>Instrutores</h4>
        <ul className={styles.list}>
          {[
            { name: "André Godoi Chiovato", linkedin: "andregodoichiovato" },
            { name: "Filipe Gonçalves de Souza Nogueira da Silva", linkedin: "filipe-gon%C3%A7alves-08a55015b" },
            { name: "Guilherme Henrique de Oliveira Cestari", linkedin: "gui-cestari" },
            { name: "Lisane Valdo", linkedin: "lisane-valdo" },
            { name: "Rodrigo Mangoni Nicola", linkedin: "rodrigo-mangoni-nicola-537027158" },
            { name: "Geraldo Magela Severino Vasconcelos", linkedin: "geraldo-magela-severino-vasconcelos-22b1b220" }
          ].map((instructor) => (
            <li key={instructor.name}>
              <a href={`https://www.linkedin.com/in/${instructor.linkedin}/`}>{instructor.name}</a>
            </li>
          ))}
        </ul>
        
        <h3 className={styles.sectionTitle}>📜 Descrição</h3>
        <p className={styles.description}>Descrição do projeto.</p>
        <p><a href="">[Link para o vídeo de demonstração do funcionamento do projeto]</a></p>

        <h3 className={styles.sectionTitle}>📁 Estrutura de pastas</h3>
        <ul className={styles.list}>
          <li><b>media</b>: Contém imagens e vídeos do projeto.</li>
          <li><b>docs</b>: Documentação do projeto.</li>
          <li><b>src</b>: Código fonte do projeto.</li>
          <li><b>README.md</b>: Guia e explicação geral do projeto.</li>
        </ul>

        <h3 className={styles.sectionTitle}>🔧 Instalação</h3>
        <p className={styles.description}>Guia de instalação do projeto.</p>

        <h3 className={styles.sectionTitle}>📋 Pré-requisitos</h3>
        <p className={styles.description}>Pré-requisitos para execução do projeto.</p>

        <h3 className={styles.sectionTitle}>📜 Manual de Instruções</h3>
        <p className={styles.description}>Manual de instruções do projeto.</p>

        <h3 className={styles.sectionTitle}>🗃 Histórico de lançamentos</h3>
        <ul className={styles.list}>
          <li>0.5.0 - 11/04/2025</li>
          <li>0.4.0 - 28/03/2025</li>
          <li>0.3.0 - 14/03/2025</li>
          <li>0.2.0 - 28/02/2025</li>
          <li>0.1.0 - 14/02/2025</li>
        </ul>

        <h3 className={styles.sectionTitle}>📋 Licença/License</h3>
        <p className={styles.description}>
          <img style={{ height: '22px', marginLeft: '3px', verticalAlign: 'text-bottom' }} src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" />
          <img style={{ height: '22px', marginLeft: '3px', verticalAlign: 'text-bottom' }} src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" />
          <a href="https://www.inteli.edu.br/">Inteli</a> &mdash;
          Desenvolvido por os membros do projeto.
        </p>
      </div>
    </Layout>
  );
}
