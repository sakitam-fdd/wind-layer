module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV === 'development');
  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            browsers: 'Last 2 Chrome versions, Firefox ESR',
            node: 'current',
          },
          loose: true,
          modules: false,
        },
      ],
      // [
      //   '@babel/preset-react',
      //   {
      //     development: process.env.BABEL_ENV !== 'build',
      //   },
      // ],
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        }
      ],
      [
        '@babel/plugin-proposal-class-properties', // 兼容class内的箭头函数
        {
          loose: true,
        }
      ],
      // '@babel/plugin-transform-modules-commonjs',
      [
        'babel-plugin-inline-import',
        {
          extensions: [
            '.glsl',
          ]
        }
      ],
    ],
    env: {},
    ignore: [
      '_site',
      'node_modules'
    ],
    comments: false,
  };
};
