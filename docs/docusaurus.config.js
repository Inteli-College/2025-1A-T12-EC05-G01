// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Dose Certa',
  tagline: 'Documentação do projeto Dose Certa',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://inteli-college.github.io/2025-1A-T12-EC05-G01',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/2025-1A-T12-EC05-G01/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Inteli.College', // Usually your GitHub org/user name.
  projectName: '2025-1A-T12-EC05-G01', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Dose Certa',
        logo: {
          alt: 'Dose Certa - Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentação',
          },
          {
            href: 'https://github.com/Inteli-College/2025-1A-T12-EC05-G01',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introdução',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Links externos',
            items: [
              {
                label: 'Inteli',
                href: 'https://www.inteli.edu.br/',
              },
              {
                label: 'HC - Unicamp',
                href: 'https://hc.unicamp.br/',
              },
            ],
          },
          {
            title: 'Outros',
            items: [ 
              {
                label: 'GitHub Inteli',
                href: 'https://github.com/Inteli-College',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} - Dose Certa`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
