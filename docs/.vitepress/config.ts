import { defineConfig } from 'vitepress';
import path from 'path';
import { readFileSync, readdirSync, statSync } from 'fs';
import { applyPlugins } from './plugins/md';

type SidebarItem = {
  text: string;
  collapsible?: boolean;
  collapsed?: boolean;
  items: {
    text: string;
    link: string;
    items?: { text: string; link: string }[];
  }[];
}[];

const pkgs = [
  { text: 'wind-core', link: '/api/wind-core/' },
  { text: 'wind-gl-core', link: '/api/wind-gl-core/' },
  { text: '@sakitam-gis/mapbox-wind', link: '/api/mapbox-wind/' },
  { text: '@sakitam-gis/maplibre-wind', link: '/api/maplibre-wind/' },
  { text: '@sakitam-gis/maptalks-wind', link: '/api/maptalks-wind/' },
  { text: 'ol-wind', link: '/api/ol-wind/' },
  { text: 'ol5-wind', link: '/api/ol5-wind/' },
  { text: 'openlayers-wind', link: '/api/openlayers-wind/' },
  { text: 'leaflet-wind', link: '/api/leaflet-wind/' },
  { text: 'wind-gl-worker', link: '/api/wind-gl-worker/' },
  { text: 'amap-wind', link: '/api/amap-wind/' },
  { text: 'bmap-wind', link: '/api/bmap-wind/' },
  { text: '@sakitam-gis/rbush', link: '/api/rbush/' },
  { text: 'particles-poc', link: '/api/particles-poc/' },
];

function nav() {
  return [
    { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
    {
      text: 'Playgrounds',
      link: '/playgrounds/mapbox-gl/raster',
      target: '',
      activeMatch: '/playgrounds/',
    },
    {
      text: 'Api',
      items: [
        {
          text: 'wind-layer',
          items: pkgs,
        },
      ],
    },
    {
      text: 'v2.x',
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/sakitam-fdd/wind-layer/releases'
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
        { text: 'config', link: '/guide/index' },
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

function getSidebarItems(dir: string[], currentRoot: string | undefined, root: string | undefined): any[] {
  return dir
    .filter((e) => e.endsWith('.md') || statSync(path.resolve(currentRoot ?? '/', e)).isDirectory())
    .map((e: string) => {
      const childDir = path.resolve(currentRoot ?? '/', e);
      if (statSync(childDir).isDirectory()) {
        const items = getSidebarItems(readdirSync(childDir), childDir, root);
        const fileName = e.split('/').pop() ?? '';
        return items.length
          ? {
            text: (fileName.charAt(0).toUpperCase() + fileName.slice(1)).replaceAll('-', ' '),
            collapsible: true,
            collapsed: true,
            items,
          }
          : null!;
      }
      if (e.endsWith('.md') && e[0] !== '_') {
        return {
          text: (e.charAt(0).toUpperCase() + e.slice(1)).slice(0, -3).replaceAll('-', ' '),
          link: childDir.replace(root ?? '', ''),
        };
      }
      return null!;
    })
    .filter((i) => !!i);
}

function autoSidebar(dirs: string[]): SidebarItem[] {
  const root = path.join(process.cwd(), '/');

  return getSidebarItems(dirs, root, root);
}

function sidebar(root = '', packagesPath: string) {
  const index: { [key: string]: { text: string; link: string }[] } = {};
  const mds = readFileSync(`${__dirname}/../${packagesPath}/index.md`, 'utf-8').match(/.*.(\n|\r)/g) as string[];
  let lastTitle = '';
  for (const line of mds) {
    if (line.match(/# @/)) continue;
    else if (line.match(/##\s\w+/)) {
      lastTitle = line.slice(3, -1).trim();
      index[lastTitle] = [];
    } else {
      const text = line.match(/\w+/);
      const md = line.match(/\w+\/\w+\.md/);
      if (md && text) {
        index[lastTitle].push({
          text: text[0],
          link: `${root}/${packagesPath}/${md[0]}`,
        });
      }
    }
  }

  const s: SidebarItem = [
    {
      text: 'Packages',
      // items: pkgs.filter(p => p.link === `/${packagesPath}/`),
      items: pkgs,
    },
  ];

  for (const i in index) {
    s.push({
      text: i,
      collapsible: true,
      collapsed: false,
      items: index[i],
    });
  }

  return s;
}

export default defineConfig({
  lang: 'zh',
  title: 'wind-layer',
  description: 'wind-layer & vis grib data library.',
  lastUpdated: true,
  ignoreDeadLinks: true,
  appearance: 'dark',
  head: [
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
      },
    ],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['link', { rel: 'apple-touch-icon', href: '/images/icons/icon-512.png' }],
    ['meta', { name: 'theme-color', content: '#242424' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
  ],
  locales: {
    root: { label: '简体中文' },
    en: { label: 'English', link: '' },
  },
  markdown: {
    config: (md) => {
      applyPlugins(md);
    },
    lineNumbers: true,
    anchor: {
      permalink: renderPermalink,
    },
    theme: {
      light: 'github-light',
      dark: 'one-dark-pro',
    },
  },

  themeConfig: {
    editLink: {
      pattern: 'https://github.com/sakitam-fdd/wind-layer/edit/master/docs/:path',
      text: '在 Github 编辑此页'
    },
    nav: nav(),
    sidebar: {
      '/guide/': sidebarGuide(),
      '/playgrounds/': autoSidebar(['playgrounds'])[0],
      '/api/wind-core/': sidebar('', 'api/wind-core'),
      '/api/wind-gl-core/': sidebar('', 'api/wind-gl-core'),
      '/api/mapbox-wind/': sidebar('', 'api/mapbox-wind'),
      '/api/maplibre-wind/': sidebar('', 'api/maplibre-wind'),
      '/api/maptalks-wind/': sidebar('', 'api/maptalks-wind'),
      '/api/ol-wind/': sidebar('', 'api/ol-wind'),
      '/api/ol5-wind/': sidebar('', 'api/ol5-wind'),
      '/api/openlayers-wind/': sidebar('', 'api/openlayers-wind'),
      '/api/leaflet-wind/': sidebar('', 'api/leaflet-wind'),
      '/api/wind-gl-worker/': sidebar('', 'api/wind-gl-worker'),
      '/api/amap-wind/': sidebar('', 'api/amap-wind'),
      '/api/bmap-wind/': sidebar('', 'api/bmap-wind'),
      '/api/rbush/': sidebar('', 'api/rbush'),
      '/api/particles-poc/': sidebar('', 'api/particles-poc'),
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-Present <a href="mailto:smilefdd@gmail.com">sakitam-fdd</a>'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sakitam-fdd/wind-layer' },
      {
        icon: {
          svg: '',
        },
        link: 'mailto:smilefdd@gmail.com',
      },
    ],
    search: {
      provider: 'algolia',
      options: {
        appId: '7HSJME72X5',
        apiKey: 'b7a68c2706d9d2053ce96743b17c829b',
        indexName: 'wind-layer',
        searchParameters: {
          facetFilters: ['tags:latest'],
        },
        placeholder: '搜索文档',
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            searchBox: {
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消',
            },
            startScreen: {
              recentSearchesTitle: '搜索历史',
              noRecentSearchesText: '没有搜索历史',
              saveRecentSearchButtonTitle: '保存至搜索历史',
              removeRecentSearchButtonTitle: '从搜索历史中移除',
              favoriteSearchesTitle: '收藏',
              removeFavoriteSearchButtonTitle: '从收藏中移除',
            },
            errorScreen: {
              titleText: '无法获取结果',
              helpText: '你可能需要检查你的网络连接',
            },
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
              searchByText: '搜索提供者',
            },
            noResultsScreen: {
              noResultsText: '无法找到相关结果',
              suggestedQueryText: '你可以尝试查询',
              reportMissingResultsText: '你认为该查询应该有结果？',
              reportMissingResultsLinkText: '点击反馈',
            },
          },
        },
      },
    },
    lastUpdated: {
      text: '最后更新',
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  }
})
