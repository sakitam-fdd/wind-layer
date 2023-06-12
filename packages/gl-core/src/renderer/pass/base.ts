import { Renderer } from '@sakitam-gis/vis-engine';

const ERR_PASS_METHOD_UNDEFINED = 'Pass subclass must define virtual methods';

export default class Pass<T> {
  public id: string;

  public readonly renderer: Renderer;

  public options: T;

  #enabled = true;

  constructor(id: string, renderer: Renderer, options: T = {} as T) {
    this.id = id;
    this.renderer = renderer;
    this.options = options;
  }

  get enabled() {
    return this.#enabled;
  }

  set enabled(state) {
    this.#enabled = state;
  }

  render(rendererParams, rendererState, cb) {
    throw new Error(ERR_PASS_METHOD_UNDEFINED);
  }

  destroy() {
    throw new Error(ERR_PASS_METHOD_UNDEFINED);
  }
}
