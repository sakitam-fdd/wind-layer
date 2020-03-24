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
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/external-helpers',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-object-rest-spread',
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
    ],
    env: {},
    ignore: [
      'dist/*.js',
      'node_modules'
    ],
    comments: false,
  };
};
