import { defineConfig } from 'vitepress';
// import container from 'markdown-it-container';

function nav() {
  return [
    { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
    { text: 'Api', link: '/api/index', activeMatch: '/api/' },
    {
      text: 'v1.0.0',
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/sakitam-fdd/wind-layer/blob/master/CHANGELOG.md'
        },
        {
          text: 'Contributing',
          link: 'https://github.com/sakitam-fdd/wind-layer/blob/master/.github/contributing.md'
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
    {
      text: 'Cookbook',
      collapsible: true,
      items: [
        { text: 'color', link: '/guide/color' },
        { text: 'data', link: '/guide/data' },
        { text: 'maptalks', link: '/guide/maptalks' },
        { text: 'mapbox-gl', link: '/guide/mapbox-gl' },
        { text: 'leaflet', link: '/guide/leaflet' },
        { text: 'ol', link: '/guide/ol' },
        { text: 'ol5', link: '/guide/ol5' },
        { text: 'ol3-4', link: '/guide/openlayers' },
        { text: 'amap', link: '/guide/amap' },
        { text: 'bmap', link: '/guide/bmap' }
      ]
    },
  ]
}

function sidebarConfig() {
  return [
  ]
}

const position = {
  false: 'push',
  true: 'unshift',
}

const renderPermalink = (slug, opts, state, permalink) => {
  try {
    const tokens = state.tokens
    const token = tokens[permalink]
    const title = tokens[permalink + 1].children
      .filter((token) => token.type === 'text' || token.type === 'code_inline')
      .reduce((acc, t) => acc + t.content, '')
    const match = /^.+(\s*\{#([a-z0-9\-_]+?)\}\s*)$/.exec(title)
    slug = match ? match[2] : slug
    token.attrSet('id', slug)
    const space = () =>
      Object.assign(new state.Token('text', '', 0), { content: ' ' })

    const linkTokens = [
      Object.assign(new state.Token('link_open', 'a', 1), {
        attrs: [
          ...(opts.permalinkClass ? [['class', opts.permalinkClass]] : []),
          ['href', opts.permalinkHref(slug, state)],
          ...Object.entries(opts.permalinkAttrs(slug, state)),
        ],
      }),
      Object.assign(new state.Token('html_block', '', 0), {
        content: opts.permalinkSymbol,
      }),
      new state.Token('link_close', 'a', -1),
    ]
    if (opts.permalinkSpace) {
      // @ts-ignore
      linkTokens[position[!opts.permalinkBefore]](space())
    }
    state.tokens[permalink + 1].children[position[opts.permalinkBefore]](
      ...linkTokens
    )
  } catch (e) {}
}

// const markDownPlugin = function (md) {
//   md.use(container, 'demo', {
//     validate(params) {
//       return params.trim().match(/^demo\s*(.*)$/);
//     },
//     render(tokens, idx) {
//       const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
//       if (tokens[idx].nesting === 1) {
//         const description = m && m.length > 1 ? m[1] : '';
//         const content = tokens[idx + 1].type === "fence" ? tokens[idx + 1].content : '';
//
//         return `
//         <clientOnly>
//           <Common-DemoBlock>
//             ${description ? `<div>${md.render(description).html}</div>` : ''}
//             <!--demo-block: ${md.utils.escapeHtml(content)} :demo-block-->
//         `;
//       }
//       return `</Common-DemoBlock></clientOnly>`;
//     },
//   });
// };

export default defineConfig({
  base: '/wind-layer/',
  lang: 'en-US',
  title: 'wind-layer',
  description: 'wind-layer & vis grib data library.',

  lastUpdated: true,
  cleanUrls: 'without-subfolders',

  head: [['meta', { name: 'theme-color', content: '#3c8772' }]],

  markdown: {
    anchor: {
      permalink: renderPermalink,
    },
  },

  // markdown: {
  //   headers: {
  //     level: [0, 0]
  //   },
  //   config: (md) => {
  //     md.use(markDownPlugin, {})
  //   }
  // },

  themeConfig: {
    editLink: {
      pattern: 'https://github.com/sakitam-fdd/wind-layer/edit/master/docs/:path',
      text: '在 Github 编辑此页'
    },
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
      appId: '7HSJME72X5',
      apiKey: 'b7a68c2706d9d2053ce96743b17c829b',
      indexName: 'wind-layer',
    },
  }
})
