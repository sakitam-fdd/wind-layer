// import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    // base: BASE_URL,
    publicDir: 'public',
    define: {
      'process.env': {
        NODE_ENV: mode,
      },
    },
    // build: {
    //   rollupOptions: {
    //     input: {
    //       ol: fileURLToPath(new URL('ol.html', import.meta.url)),
    //     },
    //   },
    // },
    // plugins: [
    //   createHtmlPlugin({
    //     minify: true,
    //     pages: [
    //       {
    //         entry: 'src/ol.ts',
    //         filename: 'ol.html',
    //         template: 'ol.html',
    //         injectOptions: {
    //           data: {
    //             title: 'src - v6',
    //             // injectScript: `<script src="./inject.js"></script>`,
    //           },
    //         },
    //       },
    //     ],
    //   }),
    // ],
  }
})
