// 是例demo组件列表，主要用于向vuepress的md文件注入组件，减少重复代码

import OlWindBase from './ol/base'; // 基础地图加载
import OlWindEPSG4326 from './ol/epsg4326'; // epsg:4326
import OlWindEPSG3413 from './ol/epsg3413'; // epsg:3413
import OlWindMoll from './ol/moll'; // moll

import Ol5WindBase from './ol5/base'; // 基础地图加载
import Ol5WindEPSG4326 from './ol5/epsg4326'; // epsg:4326
import Ol5WindEPSG3413 from './ol5/epsg3413'; // epsg:3413
import Ol5WindMoll from './ol5/moll'; // moll

import MaptalksWindBase from './maptalks/base'; // 基础地图加载

import AMapWindBase from './amap/base';
import BMapWindBase from './bmap/base';

const components = [
  OlWindBase,
  OlWindEPSG4326,
  OlWindEPSG3413,
  OlWindMoll,
  Ol5WindBase,
  Ol5WindEPSG4326,
  Ol5WindEPSG3413,
  Ol5WindMoll,
  MaptalksWindBase,
  AMapWindBase,
  BMapWindBase,
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
