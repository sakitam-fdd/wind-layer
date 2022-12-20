import { Renderer } from '@sakitam-gis/vis-engine';

export default class Pass {
  public id: string;

  public readonly renderer: Renderer;

  public options: any;

  constructor(id: string, renderer: Renderer, options = {}) {
    this.id = id;
    this.renderer = renderer;
    this.options = options;
  }

  render(rendererParams, rendererState) {
    throw new Error('');
  }

  destroy() {
    throw new Error('');
  }
}
