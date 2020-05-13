## 渲染流程

### Field

1. 根据格点数据 `row` 和 `col` 按照给定的粒子数量随机生成 `particles`：
   ```js
   let i = (Math.random() * this.cols) | 0;
   let j = (Math.random() * this.rows) | 0;

   o.x = this.longitudeAtX(i); // x 为对应位置的经度
   o.y = this.latitudeAtY(j); // y 为对应位置的纬度
   ```
   
2. 移动粒子：
   ```js
    let i = 0;
    let len = particles.length;
    for (; i < len; i++) {
      const particle = particles[i];

      if (particle.age > maxAge) {
        particle.age = 0;
        // restart, on a random x,y
        this.field.randomize(particle, width, height);
      }

      const x = particle.x;
      const y = particle.y;
       
      // 查找对应位置是否存在格点值（此处采用了双线性插值）
      const vector = this.field.interpolatedValueAt(x, y);

      if (vector === null) {
       // 当未查询到对应格点值时，将其年龄设为最大值（在绘制时会过滤掉，不会进行绘制）
        particle.age = maxAge;
      } else {
        // 当此坐标点存在格点值时，计算其下一位置的坐标
        const xt = x + vector.u * velocityScale;
        const yt = y + vector.v * velocityScale;

        if (this.field.hasValueAt(xt, yt)) {
          // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
          particle.xt = xt;
          particle.yt = yt;
          particle.m = vector.m;
        } else {
          // Particle isn't visible, but it still moves through the field.
          particle.x = xt;
          particle.y = yt;
          particle.age = maxAge;
        }
      }

      particle.age++; // 步长加一
    }
   ```

3. 绘制生成的路径：

   ```js
    // canvas draw
   ```
