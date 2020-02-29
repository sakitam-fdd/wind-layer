// 是例demo组件列表，主要用于向vuepress的md文件注入组件，减少重复代码

import OlWindBase from './ol'; // 基础地图加载

const components = [
  OlWindBase,
];

const install = function (Vue) {
  components.forEach(component => {
    // TIP: 注意对所有markdown内展示的组件添加前缀避免冲突
    Vue.component(`demo-${component.name}`, component);
  });
};

export default {
  install,
};
