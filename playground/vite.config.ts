import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ mode }) => {
  return {
    // base: BASE_URL,
    publicDir: 'public',
    define: {
      'process.env': {
        NODE_ENV: mode,
      },
    },
    build: {
      rollupOptions: {
        input: {
          ol: fileURLToPath(new URL('ol.html', import.meta.url)),
        },
      },
    },
    plugins: [
      createHtmlPlugin({
        minify: true,
        pages: [
          {
            entry: 'src/index.ts',
            filename: 'index.html',
            template: 'index.html',
            injectOptions: {
              data: {
                title: 'src - v6',
                // injectScript: `<script src="./inject.js"></script>`,
              },
            },
          },
    //       // {
    //       //   public: 'src/other-main.ts',
    //       //   filename: 'other.html',
    //       //   template: 'public/other.html',
    //       //   injectOptions: {
    //       //     data: {
    //       //       title: 'other page',
    //       //       injectScript: `<script src="./inject.js"></script>`,
    //       //     }
    //       //   },
    //       // },
        ],
      }),
    ],
  }
})
