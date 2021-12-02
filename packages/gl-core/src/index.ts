import {
  default as ScalarFill,
  defaultOptions,
} from './ScalarFill';

import type {
  IGFSItem,
  IJsonArrayData,
  IOptions,
} from './ScalarFill';

import { default as WindParticles } from './WindParticles';
import type { IWindOptions } from './WindParticles';

export * from './utils/gl-utils';
export * from './utils/common';

export {
  ScalarFill,
  WindParticles,
  defaultOptions,
  IOptions,
  IGFSItem,
  IJsonArrayData,
  IWindOptions,
};
