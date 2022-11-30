import {
  Matrix4,
  Vector3,
  ProjectionMatrix,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  utils,
} from '@sakitam-gis/vis-engine';
import { mercatorZfromAltitude } from './mercatorCoordinate';

const { degToRad, radToDeg, clamp } = utils;

export function compareVersion(v1, v2) {
  // eslint-disable-next-line no-param-reassign
  v1 = v1.split('.');
  // eslint-disable-next-line no-param-reassign
  v2 = v2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

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
    const { width, height, worldSize, elevation, _camera, _horizonShift } = this.map.transform;
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
    let topHalfSurfaceDistance =
      (Math.sin(fovAboveCenter) * this.cameraToCenterDistance) /
      Math.sin(clamp(Math.PI - groundAngle - fovAboveCenter, 0.01, Math.PI - 0.01));
    let farZ;
    const pixelsPerMeter = mercatorZfromAltitude(1, center.lat) * worldSize || 1;
    if (compareVersion(this.map.version, '2.0.0') >= 0) {
      // Adjust distance to MSL by the minimum possible elevation visible on screen,
      // this way the far plane is pushed further in the case of negative elevation.
      const minElevationInPixels = elevation
        ? elevation.getMinElevationBelowMSL() * pixelsPerMeter
        : 0;
      const cameraToSeaLevelDistance =
        (_camera.position[2] * worldSize - minElevationInPixels) / Math.cos(pitchRad);
      // eslint-disable-next-line max-len
      topHalfSurfaceDistance =
        (Math.sin(fovAboveCenter) * cameraToSeaLevelDistance) /
        Math.sin(utils.clamp(Math.PI - groundAngle - fovAboveCenter, 0.01, Math.PI - 0.01));

      // Calculate z distance of the farthest fragment that should be rendered.
      const furthestDistance = pitchAngle * topHalfSurfaceDistance + cameraToSeaLevelDistance;

      // Add a bit extra to avoid precision problems when a fragment's distance is exactly `furthestDistance`
      const horizonDistance = cameraToSeaLevelDistance * (1 / _horizonShift);
      farZ = Math.min(furthestDistance * 1.01, horizonDistance);
    } else {
      // const topHalfSurfaceDistance = Math.sin(halfFov) * this.cameraToCenterDistance / Math.sin(Math.PI - groundAngle - halfFov);
      // Calculate z distance of the farthest fragment that should be rendered.
      const furthestDistance = pitchAngle * topHalfSurfaceDistance + this.cameraToCenterDistance;
      farZ = furthestDistance * 1.01;
    }

    this.mercatorMatrix = new Matrix4().scale(
      new Vector3(worldSize, worldSize, worldSize / pixelsPerMeter),
    );

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
      this.camera.projectionMatrix.orthographic(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        nearZ,
        farZ,
      );
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
