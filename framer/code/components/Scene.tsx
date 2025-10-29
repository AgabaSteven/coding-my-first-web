import { FC, Suspense, useEffect } from 'react';
import { OrbitControls, Environment } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Model } from './Model';
import { PlaceholderModel } from './PlaceholderModel';
import { LightingRig } from './LightingRig';
import { CameraRig } from './CameraRig';
import {
  OrbitControlsConfig,
  MaterialConfig,
  LightConfig,
  EnvironmentConfig,
  CameraControls,
} from '../types';

interface SceneProps {
  modelUrl: string;
  orbitControls: OrbitControlsConfig;
  materialConfig: MaterialConfig;
  lightingConfig: LightConfig;
  environmentConfig: EnvironmentConfig;
  cameraControls: CameraControls;
}

export const Scene: FC<SceneProps> = ({
  modelUrl,
  orbitControls,
  materialConfig,
  lightingConfig,
  environmentConfig,
  cameraControls,
}) => {
  const {
    enabled,
    autoRotate,
    autoRotateSpeed,
    enablePan,
    enableZoom,
    enableDamping,
    dampingFactor,
    minDistance,
    maxDistance,
  } = orbitControls;

  const { backgroundColor, backgroundTransparent, hdriUrl, groundPlane } =
    environmentConfig;

  const { gl } = useThree();

  useEffect(() => {
    gl.setClearAlpha(backgroundTransparent ? 0 : 1);
  }, [gl, backgroundTransparent]);

  return (
    <>
      <CameraRig controls={cameraControls} />
      <OrbitControls
        enabled={enabled}
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
        enablePan={enablePan}
        enableZoom={enableZoom}
        enableDamping={enableDamping}
        dampingFactor={dampingFactor}
        minDistance={minDistance}
        maxDistance={maxDistance}
        makeDefault
      />
      {!backgroundTransparent && <color attach="background" args={[backgroundColor]} />}
      <LightingRig config={lightingConfig} />
      {hdriUrl && <Environment files={hdriUrl} />}
      {groundPlane && (
        <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, -1.5, 0]}>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      )}
      <Suspense fallback={<PlaceholderModel />}>
        <Model url={modelUrl} materialConfig={materialConfig} />
      </Suspense>
    </>
  );
};
