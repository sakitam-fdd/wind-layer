// @ts-nocheck
import DefaultTheme from 'vitepress/theme';
import { SfcPlayground } from '@sakitam-gis/vitepress-playground';
import '@sakitam-gis/vitepress-playground/dist/style.css';
import './custom.less';

// 示例组件
const playgroundModules: Record<string, { default: string }> = import.meta.glob('../../playgrounds/**/*.vue', {
  eager: true,
});

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component('SfcPlayground', SfcPlayground);

    Object.values(playgroundModules).forEach((module) => {
      const component = module.default;
      app.component(component.name, component);
    });
  }
};
