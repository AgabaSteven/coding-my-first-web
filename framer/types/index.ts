export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface ModelProps {
  modelPath: string;
  scale?: number;
  position?: Vector3;
  rotation?: Vector3;
}

export interface Scene3DProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  cameraPosition?: Vector3;
  cameraFov?: number;
}

export interface AnimationConfig {
  enabled?: boolean;
  speed?: number;
  autoRotate?: boolean;
}

export interface LightingConfig {
  ambientIntensity?: number;
  directionalIntensity?: number;
  directionalPosition?: Vector3;
}
