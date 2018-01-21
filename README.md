# wind-layer

> a openlayers extension to windjs

[![Build Status](https://travis-ci.org/sakitam-fdd/wind-layer.svg?branch=master)](https://www.travis-ci.org/sakitam-fdd/wind-layer)
[![NPM downloads](https://img.shields.io/npm/dm/wind-layer.svg)](https://npmjs.org/package/wind-layer)
[![](https://data.jsdelivr.com/v1/package/npm/wind-layer/badge)](https://www.jsdelivr.com/package/npm/wind-layer)
![JS gzip size](http://img.badgesize.io/https://unpkg.com/wind-layer/dist/windLayer.js?compression=gzip&label=gzip%20size:%20JS)
[![Npm package](https://img.shields.io/npm/v/wind-layer.svg)](https://www.npmjs.org/package/wind-layer)
[![GitHub stars](https://img.shields.io/github/stars/sakitam-fdd/wind-layer.svg)](https://github.com/sakitam-fdd/wind-layer/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/sakitam-fdd/wind-layer/master/LICENSE)

## 下载


```bash
git clone https://github.com/sakitam-fdd/wind-layer.git
npm install
npm run dev
npm run build
```

### 安装

#### npm安装

```bash
npm install wind-layer --save
import WindLayer from 'wind-layer'
```

#### cdn

目前可通过 [unpkg.com](https://unpkg.com/wind-layer/dist/windLayer.js) / [jsdelivr](https://cdn.jsdelivr.net/npm/wind-layer@0.0.1/dist/windLayer.js) 获取最新版本的资源。

```bash
// npm
https://unpkg.com/wind-layer/dist/windLayer.js
https://unpkg.com/wind-layer/dist/windLayer.min.js
// jsdelivr (jsdelivr由于缓存原因最好锁定版本号，否则可能会出现意料之外的问题)
https://cdn.jsdelivr.net/npm/wind-layer@0.0.2/dist/windLayer.js
https://cdn.jsdelivr.net/npm/wind-layer@0.0.2/dist/windLayer.min.js
```

#### [![示例](//sakitam-fdd.github.io/wind-layer/windy.jpg)](//jsfiddle.net/sakitamfdd/hgvdu76j/?utm_source=website&utm_medium=embed&utm_campaign=hgvdu76j)

#### [文档](//sakitam-fdd.github.io/wind-layer/)

## 如何获取数据

天气数据由[全球预报系统](http://en.wikipedia.org/wiki/Global_Forecast_System)（GFS）生成，
由美国国家气象局管理。 预测每天产生四次，并可用于
从[NOMADS](http://nomads.ncep.noaa.gov/)下载。 这些文件位于[GRIB2](http://en.wikipedia.org/wiki/GRIB)
格式并包含超过[300条记录](http://www.nco.ncep.noaa.gov/pmb/products/gfs/gfs.t00z.pgrbf00.grib2.shtml)。
我们只需要这些记录中的一小部分就可以在特定的等压线上可视化风资料。 下面的命令下载
1000 hPa风向量，并使用[grib2json](https://github.com/cambecc/grib2json)将它们转换为JSON格式。

```bash
YYYYMMDD=<a date, for example: 20140101>
curl "http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs.pl?file=gfs.t00z.pgrb2.1p00.f000&lev_10_m_above_ground=on&var_UGRD=on&var_VGRD=on&dir=%2Fgfs.${YYYYMMDD}00" -o gfs.t00z.pgrb2.1p00.f000
grib2json -d -n -o current-wind-surface-level-gfs-1.0.json gfs.t00z.pgrb2.1p00.f000
cp current-wind-surface-level-gfs-1.0.json <earth-git-repository>/public/data/weather/current
```

## Resources

* https://github.com/cambecc/earth
* http://earth.nullschool.net
* https://github.com/Esri/wind-js
* https://github.com/danwild/wind-js-leaflet
