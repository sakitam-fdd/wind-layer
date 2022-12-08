import { Program, Mesh } from '@sakitam-gis/vis-engine';

export default class TileMesh {
  public id: string;
  public program: Program;

  public mesh: Mesh;

  constructor(id, renderer, program, geometry) {
    this.id = id;
    this.program = program;

    this.mesh = new Mesh(renderer, {
      program,
      geometry,
    });
  }
}
