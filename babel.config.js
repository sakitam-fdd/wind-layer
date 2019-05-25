module.exports = {
  'presets': [
    ['@babel/env', {
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
      },
      loose: true,
      modules: false,
    }],
  ],
  'plugins': [
    '@babel/external-helpers',
  ],
  'ignore': [
    'dist/*.js'
  ],
  'comments': false
};
