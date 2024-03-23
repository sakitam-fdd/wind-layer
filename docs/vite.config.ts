// import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
// import vitePluginExternal from 'vite-plugin-external';

export default defineConfig(({ mode }) => ({
  plugins: [
    // vitePluginExternal({
    //   // nodeBuiltins: true,
    //   // externalizeDeps: [
    //   //
    //   // ],
    //   interop: 'auto',
    //   externals: {
    //     maptalks: 'maptalks',
    //   },
    // }),
  ],
  // resolve: {
  //   alias: [
  //     {
  //       find: '@sakitam-gis/mapbox-wind',
  //       replacement: '@sakitam-gis/mapbox-wind/dist/mapbox-wind.esm.js' // 解决构建报错
  //     }
  //   ],
  //   // dedupe: ['vue'] // 将所有相同的依赖置为同一版本，常用在多仓库中（https://cn.vitejs.dev/config/shared-options.html#resolve-dedupe）
  // },
  optimizeDeps: {
    exclude: ['@sakitam-gis/mapbox-wind'],
  },
}));
