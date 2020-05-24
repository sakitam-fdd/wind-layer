import { calcMinMax } from '../utils/common';

const ctx: Worker = self as any;

ctx.addEventListener('message', async ({ data: payload }) => {
  const renderForm = payload[0];
  if (renderForm === 'rg') {
    const uData = payload[1];
    const vData = payload[2];
    const [uMin, uMax] = calcMinMax(uData);
    const [vMin, vMax] = calcMinMax(vData);
    const velocityData = new Uint8Array(uData.length * 4);
    for (let i = 0; i < uData.data.length; i++) {
      const r = Math.floor(255 * (uData.data[i] - uMin) / (uMax - uMin));
      const g = Math.floor(255 * (vData.data[i] - vMin) / (vMax - vMin));
      velocityData.set([r, g, 0, 255], i);
    }

    ctx.postMessage([uMin, uMax, vMin, vMax, velocityData], [velocityData]);
  } else {
    const singleData = payload[1];
    const [min, max] = calcMinMax(singleData);
    const velocityData = new Uint8Array(singleData.length * 4);
    for (let i = 0; i < singleData.data.length; i++) {
      const r = Math.floor(255 * (singleData.data[i] - min) / (max - min));
      velocityData.set([r, 0, 0, 255], i);
    }

    ctx.postMessage([min, max, velocityData], [velocityData]);
  }
});
