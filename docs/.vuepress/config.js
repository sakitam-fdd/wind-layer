const mdContainer = require('markdown-it-container');
// const alias = require('../../build/alias');

module.exports = {
  title: 'wind-layer',
  description: 'wind layer for webgis',
  // theme: 'api',
  base: '/',
  head: [
    ['script', { src: '' }]
  ],
  themeConfig: {
    nav: [
      {
        text: "使用",
        link: "/start/"
      },
      {
        text: "API",
        link: "/api/"
      },
      {
        text: "仓库",
        link: "https://github.com/sakitam-fdd/wind-layer"
      },
    ],
    sidebar: [
      {
        title: "快速开始",
        collapsable: false,
        children: [
          ["/start/", "快速开始"],
        ]
      },
    ],
    search: true,
    sidebarDepth: 2,
    lastUpdated: '上次更新', // string | boolean
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
