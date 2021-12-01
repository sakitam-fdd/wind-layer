const path = require('path');
const fs = require('fs');

const parserOptions = {
  babelOptions: {
    presets: ['@babel/preset-env', '@babel/preset-typescript'],
    plugins: [
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      [
        '@babel/plugin-proposal-private-methods',
        {
          loose: true,
        },
      ],
      [
        '@babel/plugin-proposal-private-property-in-object',
        {
          loose: true,
        },
      ],
    ],
  },
  requireConfigFile: false,
  project: './tsconfig.json',
};

const isTsProject = fs.existsSync(path.join(process.cwd() || '.', './tsconfig.json'));

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'prettier',
  ],
  parser: '@babel/eslint-parser',
  plugins: ['prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'max-len': ['warn', 150, 2], // 一行的字符不能超过150
    strict: ['error', 'never'],
    'generator-star-spacing': 0,
    'func-names': 0,
    'function-paren-newline': 0,
    quotes: ['error', 'single'], // 引号配置
    'jsx-quotes': ['error', 'prefer-double'],
    'sort-imports': 0,
    semi: ['error', 'always'],
    indent: 0, // 禁止缩进错误
    'no-tabs': 'off', // 关闭不允许使用 no-tabs
    'no-console': 0,
    'no-underscore-dangle': 0, // 设置不冲突 underscore 库
    'no-return-assign': 0, // 函数可以没有返回值
    'arrow-body-style': [2, 'as-needed'], // 箭头函数直接返回的时候不需要 大括号 {}
    'no-alert': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0, // 允许使用 for in
    'guard-for-in': 0,
    'consistent-return': 0, // 不需要每次都有返回
    'prefer-rest-params': 0, // 允许使用 arguments
    'no-return-await': 0, // 允许返回 await
    'no-use-before-define': 0, // 不必在使用前定义 函数
    'no-trailing-spaces': 0, // 允许代码后面空白
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/no-static-element-interactions': 0, // 有一些 event 的时候，不需要 role 属性，不需要其他解释
    'jsx-a11y/click-events-have-key-events': 0,
    'lines-between-class-members': 0, // 类成员之间空行问题
    'import/no-extraneous-dependencies': 0, // 不区分是否在 despendencies
    'import/no-unresolved': 0, // 确保导入指向可以解析的文件/模块 by eslint-plugin-import
    'import/no-import-module-exports': 0,
    // 不区分是否是 无状态组件
    'import/extensions': [
      'off',
      'always',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
        vue: 'never',
      },
    ],

    'class-methods-use-this': 0,
    'no-confusing-arrow': 0,
    'linebreak-style': 0,
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'off',
    'unicorn/prevent-abbreviations': 'off',
    // Conflict with prettier
    'arrow-parens': 0,
    'object-curly-newline': 0,
    'implicit-arrow-linebreak': 0,
    'operator-linebreak': 0,
    'no-param-reassign': 2, // 设置是否可以重新改变参数的值
    'space-before-function-paren': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: isTsProject ? ['.js', '.jsx', '.ts', '.tsx', '.d.ts'] : ['.js', '.jsx'],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
    },
    'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.d.ts'],
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    polyfills: ['fetch', 'Promise', 'URL', 'object-assign'],
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        ecmaVersion: 11,
        sourceType: 'module',
        project: ['./tsconfig.eslint.json'],
      },
      rules: {
        // https://github.com/typescript-eslint/typescript-eslint/issues/2540#issuecomment-692866111
        '@typescript-eslint/no-use-before-define': 2,
        'no-shadow': 0,
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn', // 忽略未使用的变量
        '@typescript-eslint/no-shadow': [2, { ignoreTypeValueShadow: true }],
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0, // 不强制要求定义边界类型
        '@typescript-eslint/adjacent-overload-signatures': 'off',

        // @link https://stackoverflow.com/questions/64740337/definition-for-rule-typescript-eslint-no-redeclare-was-not-found
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': ['error'],

        '@typescript-eslint/camelcase': 'off', // 使用驼峰命名
        '@typescript-eslint/explicit-function-return-type': 'off', // 在函数和类方法上须声明返回类型
        '@typescript-eslint/ban-ts-comment': ['warn', {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
          'ts-check': 'allow-with-description',
        }],
        // @link https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/linting/TROUBLESHOOTING.md
        'no-undef': 'off',
        'prettier/prettier': 'warn', // 不符合prettier规范的进行警告
      },
      extends: ['prettier', 'plugin:@typescript-eslint/recommended'],
    },
  ],
  parserOptions,
};
