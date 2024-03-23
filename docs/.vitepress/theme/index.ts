// @ts-nocheck
// import { defineClientComponent } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { SfcPlayground } from '@sakitam-gis/vitepress-playground';
import '@sakitam-gis/vitepress-playground/dist/style.css';
import './custom.less';

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component('SfcPlayground', SfcPlayground);
  },
} as any;
