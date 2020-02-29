<template>
  <div class="demo-content">
    <div class="demo-content-datgui">
      <!--<dat-gui closeText="关闭面板" openText="打开面板">
        <dat-boolean v-model="layerVisible">是否显示</dat-boolean>
        <dat-boolean v-model="repeatWorld">是否重复绘制</dat-boolean>
        <dat-select
          v-model="url"
          :value-key="'value'"
          :label-key="'label'"
          :items="layers">请选择图层服务: </dat-select>
      </dat-gui>-->
    </div>
    <div></div>
  </div>
</template>
<script>
  export default {
    name: 'ol-wind-base',
    data() {
      return {
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        zoom: 3,
      };
    },
    watch: {},
    methods: {},
    mounted() {
      console.log(this);
    },
  };
</script>

<style lang="less">
  .demo-content {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #cbe0ff;
    &-datgui {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 1;
      pointer-events: auto;
    }
  }
</style>
