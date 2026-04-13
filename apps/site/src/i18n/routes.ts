export type Lang = 'pt-br' | 'en';

const BASE_EN = '/en';

export const routes = {
  'pt-br': {
    home:          '/',
    sobre:         '/sobre',
    changelog:     '/changelog',
    comoFunciona:  '/#como-funciona',
    paraQuem:      '/#para-quem',
    docs:          'https://docs.aplica.me',
    docsN1:        'https://docs.aplica.me/tutorials/n1-product-designer/N1-01',
    docsN2:        'https://docs.aplica.me/tutorials/n2-system-designer/N2-01',
    docsN3:        'https://docs.aplica.me/tutorials/n3-design-engineer/N3-01',
    docsEngine:    'https://docs.aplica.me/theme-engine/what-is-theme-engine',
    docsHistory:   'https://docs.aplica.me/06-history/01-aplica-ds-alpha',
    docsV1V2:      'https://docs.aplica.me/06-history/04-v1-to-v2-rationals-mapping',
    docsEngineWhat:'https://docs.aplica.me/04-theme-engine/01-what-is-theme-engine',
    docsEngineConf:'https://docs.aplica.me/04-theme-engine/03-configuration-guide',
    docsN2_03:     'https://docs.aplica.me/08-tutorials/n2-system-designer/03-paradigma-config-first',
    langSwitch:    BASE_EN,
  },
  en: {
    home:          `${BASE_EN}/`,
    sobre:         `${BASE_EN}/sobre`,
    changelog:     `${BASE_EN}/changelog`,
    comoFunciona:  `${BASE_EN}/#como-funciona`,
    paraQuem:      `${BASE_EN}/#para-quem`,
    docs:          'https://docs.aplica.me/en-US',
    docsN1:        'https://docs.aplica.me/en-US/tutorials/n1-product-designer/N1-01',
    docsN2:        'https://docs.aplica.me/en-US/tutorials/n2-system-designer/N2-01',
    docsN3:        'https://docs.aplica.me/en-US/tutorials/n3-design-engineer/N3-01',
    docsEngine:    'https://docs.aplica.me/en-US/theme-engine/what-is-theme-engine',
    docsHistory:   'https://docs.aplica.me/en-US/history/aplica-ds-alpha',
    docsV1V2:      'https://docs.aplica.me/en-US/history/v1-to-v2-rationals-mapping',
    docsEngineWhat:'https://docs.aplica.me/en-US/04-theme-engine/01-what-is-theme-engine',
    docsEngineConf:'https://docs.aplica.me/en-US/04-theme-engine/03-configuration-guide',
    docsN2_03:     'https://docs.aplica.me/en-US/08-tutorials/n2-system-designer/03-paradigma-config-first',
    langSwitch:    '/',
  },
} as const satisfies Record<Lang, Record<string, string>>;
