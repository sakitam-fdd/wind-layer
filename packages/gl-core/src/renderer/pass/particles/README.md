## 粒子图层

共计四个 pass，关系如下：

- compose：瓦片数据合并
- update：更新 GPU 粒子位置，并编码到 rbga
- particles：绘制粒子
- screen：绘制到 canvas buffer
