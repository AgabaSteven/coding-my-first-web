import { FC, useMemo } from 'react';
import { LightConfig } from '../types';
import { normalizeVector3 } from '../utils/vector3';

interface LightingRigProps {
  config: LightConfig;
}

export const LightingRig: FC<LightingRigProps> = ({ config }) => {
  const {
    ambientIntensity,
    ambientColor,
    directionalEnabled,
    directionalIntensity,
    directionalColor,
    directionalPosition,
    pointEnabled,
    pointIntensity,
    pointColor,
    pointPosition,
    spotEnabled,
    spotIntensity,
    spotColor,
    spotPosition,
    shadowsEnabled,
    shadowMapSize,
    shadowBias,
  } = config;

  const normalizedDirectionalPos = useMemo(
    () => normalizeVector3(directionalPosition),
    [directionalPosition]
  );
  const normalizedPointPos = useMemo(
    () => normalizeVector3(pointPosition),
    [pointPosition]
  );
  const normalizedSpotPos = useMemo(
    () => normalizeVector3(spotPosition),
    [spotPosition]
  );

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      {directionalEnabled && (
        <directionalLight
          intensity={directionalIntensity}
          color={directionalColor}
          position={normalizedDirectionalPos}
          castShadow={shadowsEnabled}
          shadow-mapSize-width={shadowMapSize}
          shadow-mapSize-height={shadowMapSize}
          shadow-bias={shadowBias}
        />
      )}
      {pointEnabled && (
        <pointLight
          intensity={pointIntensity}
          color={pointColor}
          position={normalizedPointPos}
          castShadow={shadowsEnabled}
          shadow-mapSize-width={shadowMapSize}
          shadow-mapSize-height={shadowMapSize}
          shadow-bias={shadowBias}
        />
      )}
      {spotEnabled && (
        <spotLight
          intensity={spotIntensity}
          color={spotColor}
          position={normalizedSpotPos}
          castShadow={shadowsEnabled}
          shadow-mapSize-width={shadowMapSize}
          shadow-mapSize-height={shadowMapSize}
          shadow-bias={shadowBias}
        />
      )}
    </>
  );
};
