const defaultParams = {

};

class Wind2D {
  constructor (ctx, params = {}) {
    this.ctx = ctx;

    this.params = Object.assign({}, defaultParams, params);
  }
}

export default Wind2D;
