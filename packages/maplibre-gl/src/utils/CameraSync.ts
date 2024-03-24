import type { Scene } from '@sakitam-gis/vis-engine';
import {
  Matrix4,
  Vector3,
  ProjectionMatrix,
  OrthographicCamera,
  PerspectiveCamera,
  utils,
  highPrecision,
} from '@sakitam-gis/vis-engine';
import { mercatorZfromAltitude } from './mercatorCoordinate';

const { degToRad, radToDeg, clamp } = utils;

highPrecision(true);

export default class CameraSync {
  public worldMatrix: Matrix4;
  public mercatorMatrix: Matrix4;
  public labelPlaneMatrix: Matrix4;
  public glCoordMatrix: Matrix4;
  public map: any;
  public scene: Scene;
  public camera: OrthographicCamera | PerspectiveCamera;

  public halfFov: number;
  public cameraToCenterDistance: number;
  public acuteAngle: number;
  public cameraTranslateZ: number;
  constructor(map, cameraType, scene) {
    this.worldMatrix = new Matrix4();
    this.mercatorMatrix = new Matrix4();
    this.labelPlaneMatrix = new Matrix4();
    this.glCoordMatrix = new Matrix4();
    const { width, height } = map.transform;
    // eslint-disable-next-line no-mixed-operators
    const fov = radToDeg(Math.atan(3 / 4));
    const nearZ = 0.1;

    const farZ = 1e21;
    this.map = map;
    this.scene = scene;
    this.scene.matrixAutoUpdate = false;
    this.scene.worldMatrixNeedsUpdate = true;
    this.camera =
      cameraType === 'orthographic'
        ? new OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, nearZ, farZ)
        : new PerspectiveCamera(fov, width / height, nearZ, farZ);
    this.camera.matrixAutoUpdate = false;
    this.camera.position.z = 600;
    this.setup();
  }

  setup() {
    const { width, height } = this.map.transform;
    const maxPitch = degToRad(this.map.transform.maxPitch);
    this.camera.aspect = width / height;
    this.halfFov = this.map.transform.fov / 2;
    this.cameraToCenterDistance = (0.5 / Math.tan(this.halfFov)) * height;
    this.acuteAngle = Math.PI / 2 - maxPitch;
    this.update();
  }

  update() {
    const { width, height, worldSize, elevation, _camera } = this.map.transform;
    const center = this.map.getCenter();
    const pitch = this.map.getPitch();
    const pitchRad = degToRad(pitch);
    const bearing = this.map.getBearing();
    const fovRad = this.map.transform._fov;
    const halfFov = fovRad / 2;
    const pitchAngle = Math.cos(Math.PI / 2 - pitchRad);
    const groundAngle = Math.PI / 2 + pitchRad;
    this.cameraToCenterDistance = (0.5 / Math.tan(halfFov)) * height;
    const point = this.map.transform.project(center);
    const rotateMap = new Matrix4().fromRotationZ(Math.PI);
    const scale = new Matrix4().fromScale(new Vector3(-worldSize, worldSize, worldSize));
    const translateMap = new Matrix4().fromTranslation(new Vector3(-point.x, point.y, 0));
    const nz = height / 50;
    const nearZ = Math.max(nz * pitchAngle, nz);
    // const farZ = 1e21;
    const fovAboveCenter = fovRad * (0.5 + this.map.transform.centerOffset.y / height);
    // eslint-disable-next-line max-len
    const topHalfSurfaceDistance =
      (Math.sin(fovAboveCenter) * this.cameraToCenterDistance) /
      Math.sin(clamp(Math.PI - groundAngle - fovAboveCenter, 0.01, Math.PI - 0.01));
    const pixelsPerMeter = mercatorZfromAltitude(1, center.lat) * worldSize || 1;
    const furthestDistance = pitchAngle * topHalfSurfaceDistance + this.cameraToCenterDistance;
    const farZ = furthestDistance * 1.01;

    this.mercatorMatrix = new Matrix4().scale(new Vector3(worldSize, worldSize, worldSize / pixelsPerMeter));

    const may = new Matrix4().fromTranslation(new Vector3(0, 0, this.cameraToCenterDistance));

    this.labelPlaneMatrix = new Matrix4();

    const m = new Matrix4();
    m.scale(new Vector3(1, -1, 1));
    m.translate(new Vector3(-1, -1, 0));
    m.scale(new Vector3(2 / width, 2 / height, 1));
    this.glCoordMatrix = m;

    this.camera.aspect = width / height;

    this.cameraTranslateZ = this.cameraToCenterDistance;

    if (this.camera instanceof OrthographicCamera) {
      this.camera.projectionMatrix.orthographic(-width / 2, width / 2, height / 2, -height / 2, nearZ, farZ);
    } else {
      this.camera.projectionMatrix.perspective(fovRad, width / height, nearZ, farZ);
    }

    const cameraWorldMatrix = new Matrix4()
      .premultiply(may)
      .premultiply(new Matrix4().fromRotationX(pitchRad))
      .premultiply(new Matrix4().fromRotationZ(-degToRad(bearing)));

    if (elevation) cameraWorldMatrix.elements[14] = _camera.position[2] * worldSize;

    this.camera.worldMatrix.copy(cameraWorldMatrix);
    this.camera.updateMatrixWorld();
    if (this.scene) {
      this.scene.localMatrix = new ProjectionMatrix()
        .premultiply(rotateMap)
        .premultiply(scale)
        .premultiply(translateMap);
    }
  }
}
