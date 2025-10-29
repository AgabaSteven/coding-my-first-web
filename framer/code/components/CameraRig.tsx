import { FC, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';
import { CameraControls } from '../types';
import { getCameraPresetPosition } from '../utils/cameraPresets';
import { normalizeVector3 } from '../utils/vector3';

interface CameraRigProps {
  controls: CameraControls;
}

const updateCamera = (camera: PerspectiveCamera, controls: CameraControls) => {
  const { preset, position, fov } = controls;
  const presetPosition = getCameraPresetPosition(preset);
  const normalizedPosition = normalizeVector3(position);
  const [x, y, z] = presetPosition ?? normalizedPosition;

  camera.position.set(x, y, z);
  camera.fov = fov;
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
};

export const CameraRig: FC<CameraRigProps> = ({ controls }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      updateCamera(camera, controls);
    }
  }, [camera, controls]);

  return null;
};
