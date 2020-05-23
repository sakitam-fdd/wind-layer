import * as utils from '../gl-utils';

const ctx: Worker = self as any;

ctx.addEventListener('message', async ({ data: payload }) => {
  const datas: never[] = [];

  const type = payload[0];
  const renderForm = payload[1];

  let pos;
  if (type === 'jsonArray') {
    const gridData = data.data;
    if (renderForm === 'rg') {
      const uData = gridData[0];
      const vData = gridData[1];
      const uMin = Math.min.apply(null, uData.data);
      const uMax = Math.max.apply(null, uData.data);
      const vMin = Math.min.apply(null, vData.data);
      const vMax = Math.max.apply(null, vData.data);
      // const velocityData = new Uint8Array(uData.length * 4);
      // for (let i = 0; i < uData.data.length; i++) {
      //   const r = Math.floor(255 * (uData.data[i] - uMin) / (uMax - uMin));
      //   const g = Math.floor(255 * (vData.data[i] - vMin) / (vMax - vMin));
      //   velocityData.set([r, g, 0, 255], i);
      // }

      const velocityData = [];
      for (let i = 0; i < uData.data.length; i++) {
        const r = Math.floor(255 * (uData.data[i] - uMin) / (uMax - uMin));
        velocityData.push(r);
        const g = Math.floor(255 * (vData.data[i] - vMin) / (vMax - vMin));
        velocityData.push(g);
        velocityData.push(0);
        velocityData.push(255);
      }

      pos = [
        ...this.getMercatorCoordinate([uData.header.lo1, uData.header.la1]),
        ...this.getMercatorCoordinate([uData.header.lo1, uData.header.la2]),
        ...this.getMercatorCoordinate([uData.header.lo2, uData.header.la1]),

        ...this.getMercatorCoordinate([uData.header.lo2, uData.header.la1]),
        ...this.getMercatorCoordinate([uData.header.lo1, uData.header.la2]),
        ...this.getMercatorCoordinate([uData.header.lo2, uData.header.la2]),
      ];

      // this.quadBuffer = this.regl.buffer({
      //   data: new Float32Array(pos),
      //   length: 2,
      //   type: 'float',
      // });

      this.quadBuffer = utils.createBuffer(
        this.gl,
        new Float32Array(pos),
      );

      return {
        width: uData.header.nx,
        height: uData.header.ny,
        uMin,
        uMax,
        vMin,
        vMax,
        texture: utils.createTexture(this.gl, this.gl.LINEAR, new Uint8Array(velocityData), uData.header.nx, uData.header.ny),
      };
    } else {
      const singleData = gridData[0];
      const min = Math.min.apply(null, singleData.data);
      const max = Math.max.apply(null, singleData.data);
      const velocityData = [];
      for (let i = 0; i < singleData.data.length; i++) {
        const r = Math.floor(255 * (singleData.data[i] - min) / (max - min));
        velocityData.push(r);
        velocityData.push(0);
        velocityData.push(0);
        velocityData.push(255);
      }

      pos = [
        ...this.getMercatorCoordinate([singleData.header.lo1, singleData.header.la1]),
        ...this.getMercatorCoordinate([singleData.header.lo1, singleData.header.la2]),
        ...this.getMercatorCoordinate([singleData.header.lo2, singleData.header.la1]),

        ...this.getMercatorCoordinate([singleData.header.lo2, singleData.header.la1]),
        ...this.getMercatorCoordinate([singleData.header.lo1, singleData.header.la2]),
        ...this.getMercatorCoordinate([singleData.header.lo2, singleData.header.la2]),
      ];

      this.quadBuffer = utils.createBuffer(
        this.gl,
        new Float32Array(pos),
      );

      return {
        width: singleData.header.nx,
        height: singleData.header.ny,
        min,
        max,
        texture: utils.createTexture(this.gl, this.gl.LINEAR, new Uint8Array(velocityData), uData.header.nx, uData.header.ny),
      };
    }
  } else if (type === 'image') {
    // const image = loadImage(data.url);
    const image = data.image;
    pos = [
      ...this.getMercatorCoordinate(...data.extent[0]),
      ...this.getMercatorCoordinate(...data.extent[1]),
      ...this.getMercatorCoordinate(...data.extent[2]),

      ...this.getMercatorCoordinate(...data.extent[2]),
      ...this.getMercatorCoordinate(...data.extent[1]),
      ...this.getMercatorCoordinate(...data.extent[3]),
    ];

    this.quadBuffer = utils.createBuffer(
      this.gl,
      new Float32Array(pos),
    );

    return {
      width: data.width,
      height: data.height,
      uMin: data.uMin,
      uMax: data.uMax,
      vMin: data.vMin,
      vMax: data.vMax,
      texture: utils.createTexture(this.gl, this.gl.LINEAR, image, image.width, image.height),
      // texture: this.regl.texture({
      //   mag: 'linear',
      //   min: 'linear',
      //   data: new Uint8Array(velocityData),
      //   width: uData.header.nx,
      //   height: uData.header.ny,
      //   wrapS: 'clamp',
      //   wrapT: 'clamp',
      //   format: 'rgba',
      //   type: 'uint8',
      // }),
    };
  }

  ctx.postMessage({
    data: datas,
    status: 'success',
  });
});
