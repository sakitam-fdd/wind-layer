import wgw from 'wind-gl-worker';
import ScalarFill, { defaultOptions } from './renderer';
import type { ScalarFillOptions } from './renderer';

export * from './utils/common';

const configDeps = wgw.configDeps;

export { ScalarFill, ScalarFillOptions, defaultOptions, configDeps };

export * from './type';
