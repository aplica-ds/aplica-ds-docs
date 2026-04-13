// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://aplica.me',

  i18n: {
    defaultLocale: 'pt-br',
    locales: ['pt-br', 'en'],
    routing: {
      prefixDefaultLocale: false, // pt-br at root, /en/ for English
    },
  },

  integrations: [react()],
});