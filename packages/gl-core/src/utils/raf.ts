export interface IOptions {
  callback: (time: number) => void;
}

const defaultOptions = {
  callback: () => void 0,
};

export class Raf {
  public options: IOptions;
  private raf: number;
  private animating: boolean;

  constructor(options: Partial<IOptions> = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.animate = this.animate.bind(this);
  }

  public reset() {
    this.animating = false;
    if (this.raf !== undefined) {
      cancelAnimationFrame(this.raf);
    }
  }

  public start() {
    if (this.animating) {
      return;
    }
    this.animating = true;
    this.raf = requestAnimationFrame(this.animate);
  }

  public stop() {
    this.reset();
  }

  private animate() {
    if (!this.animating) {
      return;
    }
    this.options.callback((performance || Date).now());
    this.raf = requestAnimationFrame(this.animate);
  }
}
