export interface ModelVariant {
  label: string;
  url: string;
}

export enum CameraPreset {
  Custom = 'custom',
  Front = 'front',
  Back = 'back',
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
  Isometric = 'isometric',
}

export enum MaterialType {
  Standard = 'standard',
  Physical = 'physical',
  Basic = 'basic',
}

export type Vector3Tuple = [number, number, number];

export type Vector3Input =
  | Vector3Tuple
  | {
      x: number;
      y: number;
      z: number;
    };

export interface CameraControls {
  position: Vector3Input;
  preset: CameraPreset;
  fov: number;
}

export interface OrbitControlsConfig {
  enabled: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  enablePan: boolean;
  enableZoom: boolean;
  enableDamping: boolean;
  dampingFactor: number;
  minDistance: number;
  maxDistance: number;
}

export interface MaterialConfig {
  type: MaterialType;
  color: string;
  metalness: number;
  roughness: number;
  textureUrl?: string;
}

export interface LightConfig {
  ambientIntensity: number;
  ambientColor: string;
  directionalEnabled: boolean;
  directionalIntensity: number;
  directionalColor: string;
  directionalPosition: Vector3Input;
  pointEnabled: boolean;
  pointIntensity: number;
  pointColor: string;
  pointPosition: Vector3Input;
  spotEnabled: boolean;
  spotIntensity: number;
  spotColor: string;
  spotPosition: Vector3Input;
  shadowsEnabled: boolean;
  shadowMapSize: number;
  shadowBias: number;
}

export interface EnvironmentConfig {
  backgroundColor: string;
  backgroundTransparent: boolean;
  hdriUrl?: string;
  groundPlane: boolean;
}

export interface Product3DViewerProps {
  width: number;
  height: number;
  modelUrl: string;
  variants?: ModelVariant[];
  selectedVariant?: number;
  camera: CameraControls;
  orbitControls: OrbitControlsConfig;
  material: MaterialConfig;
  lighting: LightConfig;
  environment: EnvironmentConfig;
}
