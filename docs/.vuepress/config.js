const mdContainer = require('markdown-it-container');
// const alias = require('../../build/alias');

module.exports = {
  title: 'wind-layer',
  description: 'wind layer for webgis',
  // theme: 'api',
  base: '/wind-layer/',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'wind-layer',
      description: 'wind layer for webgis'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'wind-layer',
      description: '一个面向webgis的风场插件'
    }
  },
  head: [
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/openlayers/dist/ol.css' }],
    ['link', { rel: 'stylesheet', href: 'https://cache.amap.com/lbs/static/main1119.css' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    // ['link', { rel: 'stylesheet', href: '//at.alicdn.com/t/font_1125947_cnbcy1q7tzm.css' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/proj4@2.6.0/dist/proj4.js' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/openlayers/dist/ol.js' }],
    ['script', { src: 'https://api.map.baidu.com/api?v=3.0&ak=bxFuXXDt1oKdlgu6mXCCnK51cDgDGBLp' }],
  ],
  themeConfig: {
    editLinks: true,
    // docsDir: 'packages/docs/docs',
    // algolia: ctx.isProd ? ({
    //   apiKey: '',
    //   indexName: 'wind-layer'
    // }) : null,
    smoothScroll: true,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        ariaLabel: 'Select language',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          {
            text: "use",
            link: "/start/"
          },
          {
            text: "api",
            link: "/api/"
          },
          {
            text: "repositories",
            link: "https://github.com/sakitam-fdd/wind-layer"
          },
        ],
        sidebar: {
          '/start/': [
            {
              title: 'Introduction',
              collapsable: false,
              children: [
                '',
                'data',
              ],
            },
            {
              title: 'examples',
              collapsable: false,
              children: [
                'ol',
                'ol5',
                'openlayers',
                'maptalks',
                'amap',
                'bmap',
                'leaflet',
                'mapbox-gl',
              ],
            }
          ],
          '/api/': [
            {
              title: 'detail',
              collapsable: false,
              children: [
                '',
                'Color',
              ],
            }
          ]
        },
      },
      '/zh/': {
        label: '简体中文',
        nav: [
          {
            text: "使用",
            link: "/zh/start/"
          },
          {
            text: "API",
            link: "/zh/api/"
          },
          {
            text: "仓库",
            link: "https://github.com/sakitam-fdd/wind-layer"
          },
        ],
        sidebar: {
          '/zh/start/': [
            {
              title: '简介',
              collapsable: false,
              children: [
                '',
                'data',
              ],
            },
            {
              title: '使用示例',
              collapsable: false,
              children: [
                'ol',
                'ol5',
                'openlayers',
                'maptalks',
                'amap',
                'bmap',
                'leaflet',
                'mapbox-gl',
              ],
            }
          ],
          '/zh/api/': [
            {
              title: '详细文档',
              collapsable: false,
              children: [
                '',
                'Color',
              ],
            }
          ]
        },
        search: true,
        selectText: '选择语言',
        ariaLabel: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        sidebarDepth: 2,
        lastUpdated: '上次更新', // string | boolean
      }
    },
  },
  configureWebpack: {
    resolve: {
      // alias: alias,
    },
  },
  plugins: [
    '@vuepress/nprogress',
    '@vuepress/back-to-top',
    '@vuepress/last-updated',
    '@vuepress/active-header-links',
  ],
  markdown: {
    extendMarkdown: md => {
      const defaultRender = md.renderer.rules.fence;
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        // 判断该 fence 是否在 :::demo 内
        const prevToken = tokens[idx - 1];
        const isInDemoContainer = prevToken
          && prevToken.nesting === 1
          && prevToken.info.trim().match(/^demo\s*(.*)$/);
        if (token.info === 'html') {
          return `<template slot="highlight">
            <pre v-pre><code class="html">${md.utils.escapeHtml(token.content)}</code></pre>
          </template>`;
        } else if (token.info === 'demo') { // 自定义
          return `<div slot="source" class="source-content">${token.content}</div>`
        }
        return defaultRender(tokens, idx, options, env, self);
      };

      md.use(mdContainer, 'demo', {
        validate(params) {
          return params.trim().match(/^demo\s*(.*)$/);
        },
        render(tokens, idx) {
          const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
          if (tokens[idx].nesting === 1) {
            const description = m && m.length > 1 ? m[1] : '';
            const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : '';
            return `<Common-DemoBlock>
              ${description ? `<div>${md.render(description).html}</div>` : ''}
              <!--element-demo: ${content}:element-demo-->
            `;
          } else {
            return '</Common-DemoBlock>';
          }
        }
      });
    },
    plugins: []
  }
};
