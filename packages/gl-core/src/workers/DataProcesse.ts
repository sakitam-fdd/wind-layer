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
    for (let i = 0; i < uData.length; i++) {
      const r = Math.floor(255 * (uData[i] - uMin) / (uMax - uMin));
      const g = Math.floor(255 * (vData[i] - vMin) / (vMax - vMin));
      velocityData.set([r, g, 0, 255], i);
    }

    ctx.postMessage([velocityData, uMin, uMax, vMin, vMax]);
  } else {
    const singleData = payload[1];
    const [min, max] = calcMinMax(singleData);
    const velocityData = new Uint8Array(singleData.length * 4);
    for (let i = 0; i < singleData.length; i++) {
      const r = Math.floor(255 * (singleData[i] - min) / (max - min));
      velocityData.set([r, 0, 0, 255], i);
    }

    ctx.postMessage([velocityData, min, max]);
  }
});
