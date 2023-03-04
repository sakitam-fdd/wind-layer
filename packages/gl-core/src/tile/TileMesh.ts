import { Program, Mesh, Geometry } from '@sakitam-gis/vis-engine';

let geom;

function getPlaneGeometry(renderer) {
  if (!geom) {
    geom = new Geometry(renderer, {
      position: {
        size: 2,
        data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
      },
      uv: {
        size: 2,
        data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
      },
      index: {
        size: 1,
        data: new Uint16Array([0, 1, 2, 2, 1, 3]),
      },
    });
  }

  return geom;
}

export default class TileMesh {
  public id: string;
  public program: Program;

  /**
   * 用于地图投影下的 Mesh
   */
  public mesh: Mesh;

  /**
   * 用于平面绘制的 Mesh，常用于瓦片合并 Pass
   */
  public planeMesh: Mesh;

  constructor(id, renderer, program, geometry) {
    this.id = id;
    this.program = program;

    this.mesh = new Mesh(renderer, {
      program,
      geometry,
    });

    this.planeMesh = new Mesh(renderer, {
      program,
      geometry: getPlaneGeometry(renderer),
    });
  }

  setCenter(center: number[]) {
    this.mesh.position.set(center[0], center[1], center[2] || 0);
  }

  getMesh() {
    return this.mesh;
  }
}
