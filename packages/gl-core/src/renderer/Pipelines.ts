import { Renderer } from '@sakitam-gis/vis-engine';

export default class Pipelines {
  #passes: any[] = [];

  public enabled: boolean;
  public renderer: Renderer;

  constructor(renderer) {
    this.enabled = true;
    this.renderer = renderer;
  }

  get passes() {
    return this.#passes;
  }

  get length() {
    return this.passes.length;
  }

  resize(width: number, height: number) {
    const len = this.#passes.length;
    for (let i = 0; i < len; i++) {
      const pass = this.#passes[i];
      pass.resize?.(width, height);
    }
  }

  addPass(pass) {
    this.#passes.push(pass);
  }

  removePass(pass) {
    const idx = this.#passes.indexOf(pass);
    if (idx > -1) {
      this.#passes.splice(pass, 1);
      pass.destroy();
    }
  }

  removePasses() {
    this.#passes.forEach((pass) => pass.destroy());
    this.#passes = [];
  }

  getPass(id) {
    return this.#passes.find((pass) => pass.id === id);
  }

  prerender(rendererParams, rendererState) {
    const passes = this.#passes.filter((p) => p.enabled && p.prerender === true);
    if (passes.length > 0) {
      const len = passes.length;
      for (let i = 0; i < len; i++) {
        const pass = passes[i];
        pass.render(rendererParams, rendererState);
      }
      this.renderer.resetState();
    }
  }

  render(rendererParams, rendererState) {
    const passes = this.#passes.filter((p) => p.enabled && p.prerender !== true);
    if (passes.length > 0) {
      const len = passes.length;
      for (let i = 0; i < len; i++) {
        const pass = passes[i];
        pass.render(rendererParams, rendererState);
      }
      this.renderer.resetState();
    }
  }

  destroy() {
    this.#passes.forEach((pass) => pass.destroy());
  }
}
