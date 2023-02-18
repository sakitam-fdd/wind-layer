import wgw from 'wind-gl-worker';
import ScalarFill, { defaultOptions } from './renderer';
import TileID from './tile/TileID';
import type { ScalarFillOptions } from './renderer';

export * from './utils/common';

const configDeps = wgw.configDeps;

export { ScalarFill, ScalarFillOptions, TileID, defaultOptions, configDeps };

export * from './source';

export * from './type';
