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
  private isVisible: boolean;

  constructor(options: Partial<IOptions> = {}) {
    this.options = {
      ...defaultOptions,
      ...options,
    };

    this.animate = this.animate.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
  }

  public reset() {
    this.animating = false;
    this.isVisible = true;
    if (this.raf !== undefined) {
      cancelAnimationFrame(this.raf);
    }
  }

  public start() {
    if (this.animating) {
      return;
    }
    this.animating = true;
    document.addEventListener(
      'visibilitychange',
      this.onVisibilityChange,
      false,
    );
    this.raf = requestAnimationFrame(this.animate);
  }

  public stop() {
    this.reset();
    document.removeEventListener(
      'visibilitychange',
      this.onVisibilityChange,
      false,
    );
  }

  private animate() {
    if (!this.animating || !this.isVisible) {
      return;
    }
    this.options.callback((performance || Date).now());
    this.raf = requestAnimationFrame(this.animate);
  }

  private onVisibilityChange() {
    this.isVisible = !document.hidden;

    if (this.isVisible) {
      this.reset();
      this.start();
    }
  }
}
