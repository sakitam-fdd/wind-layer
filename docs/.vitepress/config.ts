import { defineConfig } from 'vitepress'

function nav() {
  return [
    { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
    { text: 'Api', link: '/api/index', activeMatch: '/api/' },
    {
      text: 'v1.0.0',
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/sakitam-gis/vis-engine/blob/main/CHANGELOG.md'
        },
        {
          text: 'Contributing',
          link: 'https://github.com/sakitam-gis/vis-engine/blob/main/.github/contributing.md'
        }
      ]
    }
  ]
}

function sidebarGuide() {
  return [
    {
      text: 'Introduction',
      collapsible: true,
      items: [
        { text: 'Getting Started', link: '/guide/getting-started' },
      ]
    },
  ]
}

function sidebarConfig() {
  return [
  ]
}

export default defineConfig({
  base: '/vis-engine/',
  lang: 'en-US',
  title: 'vis-engine',
  description: 'vis-engine & vis grib data webgl engine.',

  lastUpdated: true,
  cleanUrls: 'without-subfolders',

  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'vis-engine',
      selectText: '选择语言',
      description: 'vis-engine & 是一个用于气象渲染的 webgl 引擎。',
    },
    '/en/': {
      lang: 'en-US',
      title: 'vis-engine',
      selectText: 'Languages',
      description: 'vis-engine & vis grib data webgl engine.',
    },
  },

  head: [['meta', { name: 'theme-color', content: '#3c8772' }]],

  markdown: {
    headers: {
      level: [0, 0]
    }
  },

  themeConfig: {
    editLink: {
      pattern: 'https://github.com/sakitam-fdd/wind-layer/edit/master/docs/:path',
      text: '在 Github 编辑此页'
    },
    docsBranch: 'v2',
    nav: nav(),
    sidebar: {
      '/guide/': sidebarGuide(),
      '/config/': sidebarConfig()
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present sakitam-fdd'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sakitam-fdd/wind-layer' }
    ],

    algolia: {
      appId: '',
      apiKey: '',
      indexName: 'vis-engine'
    },
  }
})
