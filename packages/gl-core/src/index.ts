import wgw from 'wind-gl-worker';
import Layer, { defaultOptions } from './renderer';
import TileID from './tile/TileID';
import type { LayerOptions } from './renderer';

export * from './utils/common';

const configDeps = wgw.configDeps;

export { Layer, LayerOptions, TileID, defaultOptions, configDeps };

export * from './source';

export * from './type';
