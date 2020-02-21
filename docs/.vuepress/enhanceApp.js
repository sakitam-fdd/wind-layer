import './styles/index.less';
// import datGUI from '../../examples/dat-gui';
import Highlight from './utils/highlight';

function setPrototype(Vue) {
  // Vue.prototype.$log = log;
}

export default ({
    Vue, // VuePress 正在使用的 Vue 构造函数
    options, // 附加到根实例的一些选项
    router, // 当前应用的路由实例
    siteData // 站点元数据
  }) => {
  Vue.use(Highlight);
  // Vue.use(datGUI);
  setPrototype(Vue);
}
