import type { vec3, vec4 } from 'gl-matrix';
import { quat, mat4 } from 'gl-matrix';
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

const { degToRad, radToDeg } = utils;

highPrecision(true);

const transform = mat4.identity([] as any);

export interface ViewState {
  width: number;
  height: number;
  maxPitch: number;
  fov: number;
  worldSize: number;
  elevation: any;
  _horizonShift: number;
  getCenter: () => any;
  getPitch: () => number;
  getBearing: () => number;
  getFovRad: () => number;
  getCameraPosition: () => number[];

  centerOffset: () => any;

  project: (coordinates: number[]) => any;
}

export function getColumn(matrix: mat4, col: number): vec4 {
  return [matrix[col * 4], matrix[col * 4 + 1], matrix[col * 4 + 2], matrix[col * 4 + 3]];
}

export function setColumn(matrix: mat4, col: number, values: vec4) {
  matrix[col * 4 + 0] = values[0];
  matrix[col * 4 + 1] = values[1];
  matrix[col * 4 + 2] = values[2];
  matrix[col * 4 + 3] = values[3];
}

function updateTransformOrientation(matrix: mat4, orientation: quat) {
  // Take temporary copy of position to prevent it from being overwritten
  const position: vec4 = getColumn(matrix, 3);

  // Convert quaternion to rotation matrix
  mat4.fromQuat(matrix, orientation);
  setColumn(matrix, 3, position);
}

export function updateTransformPosition(matrix: mat4, position: vec3) {
  setColumn(matrix, 3, [position[0], position[1], position[2], 1.0]);
}

function orientationFromPitchBearing(pitch: number, bearing: number): quat {
  // Both angles are considered to define CW rotation around their respective axes.
  // Values have to be negated to achieve the proper quaternion in left handed coordinate space
  const orientation = quat.identity([] as any);
  quat.rotateZ(orientation, orientation, -bearing);
  quat.rotateX(orientation, orientation, -pitch);
  return orientation;
}

export function getCameraPosition(pitch: number, bearing: number) {
  const orientation = orientationFromPitchBearing(pitch, bearing);
  updateTransformOrientation(transform, orientation);
}

export default class CameraSync {
  public worldMatrix: Matrix4;
  public mercatorMatrix: Matrix4;
  public labelPlaneMatrix: Matrix4;
  public glCoordMatrix: Matrix4;
  public viewState: ViewState;
  public scene: Scene;
  public camera: OrthographicCamera | PerspectiveCamera;

  public halfFov: number;
  public cameraToCenterDistance: number;
  public acuteAngle: number;
  public cameraTranslateZ: number;
  constructor(viewState: ViewState, cameraType, scene) {
    this.worldMatrix = new Matrix4();
    this.mercatorMatrix = new Matrix4();
    this.labelPlaneMatrix = new Matrix4();
    this.glCoordMatrix = new Matrix4();
    const { width, height } = viewState;
    const fov = radToDeg(Math.atan(3 / 4));
    const nearZ = 0.1;

    const farZ = 1e21;
    this.viewState = viewState;
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
    const { width, height, fov } = this.viewState;
    const maxPitch = degToRad(this.viewState.maxPitch);
    this.camera.aspect = width / height;
    this.halfFov = fov / 2;
    this.cameraToCenterDistance = (0.5 / Math.tan(this.halfFov)) * height;
    this.acuteAngle = Math.PI / 2 - maxPitch;
    this.update();
  }

  update() {
    const { width, height, elevation, _horizonShift, worldSize } = this.viewState;
    const center = this.viewState.getCenter();
    const pitch = this.viewState.getPitch();
    const pitchRad = degToRad(pitch);
    const bearing = this.viewState.getBearing();
    const fovRad = this.viewState.getFovRad();
    const cameraPosition = this.viewState.getCameraPosition();
    const halfFov = fovRad / 2;
    const pitchAngle = Math.cos(Math.PI / 2 - pitchRad);
    const groundAngle = Math.PI / 2 + pitchRad;
    this.cameraToCenterDistance = (0.5 / Math.tan(halfFov)) * height;
    const point = this.viewState.project(center);
    const rotateMap = new Matrix4().fromRotationZ(Math.PI);
    const scale = new Matrix4().fromScale(new Vector3(-worldSize, worldSize, worldSize));
    const translateMap = new Matrix4().fromTranslation(new Vector3(-point.x, point.y, 0));
    const nz = height / 50;
    const nearZ = Math.max(nz * pitchAngle, nz);
    const fovAboveCenter = fovRad * (0.5 + this.viewState.centerOffset().y / height);
    const pixelsPerMeter = mercatorZfromAltitude(1, center.lat) * worldSize || 1;
    // Adjust distance to MSL by the minimum possible elevation visible on screen,
    // this way the far plane is pushed further in the case of negative elevation.
    const minElevationInPixels = elevation ? elevation.getMinElevationBelowMSL() * pixelsPerMeter : 0;
    const cameraToSeaLevelDistance = (cameraPosition[2] * worldSize - minElevationInPixels) / Math.cos(pitchRad);
    // eslint-disable-next-line max-len
    const topHalfSurfaceDistance =
      (Math.sin(fovAboveCenter) * cameraToSeaLevelDistance) /
      Math.sin(utils.clamp(Math.PI - groundAngle - fovAboveCenter, 0.01, Math.PI - 0.01));

    // Calculate z distance of the farthest fragment that should be rendered.
    const furthestDistance = pitchAngle * topHalfSurfaceDistance + cameraToSeaLevelDistance;

    // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
    const horizonDistance = cameraToSeaLevelDistance * (1 / _horizonShift);
    const farZ = Math.min(furthestDistance * 1.01, horizonDistance);

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

    if (elevation) cameraWorldMatrix.elements[14] = cameraPosition[2] * worldSize;

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
