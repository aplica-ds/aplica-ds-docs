import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Aplica DS',
  tagline: 'Design tokens que escalam com o produto.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.aplica.design',
  baseUrl: '/',

  organizationName: 'aplica-ds',
  projectName: 'aplica-ds-docs',

  onBrokenLinks: 'warn',

  // Treat .md files as standard Markdown (not MDX).
  // Our KB content uses { } in code examples and error messages — MDX would
  // try to parse those as JSX expressions, causing build failures.
  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en-US'],
    localeConfigs: {
      'pt-BR':  { label: 'Português (BR)', direction: 'ltr', htmlLang: 'pt-BR' },
      'en-US':  { label: 'English',        direction: 'ltr', htmlLang: 'en-US' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          // Serve docs at root — /00-overview/01-aplica-ds-vision instead of /docs/...
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/aplica-ds/aplica-ds/edit/main/apps/docs/',
        },
        // Blog disabled — changelog lives on the marketing site
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/aplica-ds-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Aplica DS',
      logo: {
        alt: 'Aplica DS',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Documentação',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://aplica.design',
          label: 'aplica.design',
          position: 'right',
        },
        {
          href: 'https://github.com/aplica-ds/aplica-ds',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Fundamentos',
          items: [
            { label: 'Visão geral',          to: '/' },
            { label: 'Trilha de aprendizado', to: '/overview/learning-path' },
            { label: 'Glossário',             to: '/overview/glossary' },
          ],
        },
        {
          title: 'Tutoriais',
          items: [
            { label: 'N1 · Product Designer',  to: '/tutorials/n1-product-designer/N1-01' },
            { label: 'N2 · System Designer',   to: '/tutorials/n2-system-designer/N2-01' },
            { label: 'N3 · Design Engineer',   to: '/tutorials/n3-design-engineer/N3-01' },
          ],
        },
        {
          title: 'Projeto',
          items: [
            { label: 'Site',   href: 'https://aplica.design' },
            { label: 'GitHub', href: 'https://github.com/aplica-ds/aplica-ds' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Aplica DS. Open source sob licença MIT.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'css', 'scss'],
    },
    // Algolia DocSearch — solicitar em docsearch.algolia.com (gratuito para OSS)
    // Descomente após aprovação:
    // algolia: {
    //   appId: 'YOUR_APP_ID',
    //   apiKey: 'YOUR_SEARCH_API_KEY',
    //   indexName: 'aplica-ds',
    //   contextualSearch: true,
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
