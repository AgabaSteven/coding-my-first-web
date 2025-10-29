import { CameraPreset } from '../types';

export const getCameraPresetPosition = (
  preset: CameraPreset
): [number, number, number] | null => {
  switch (preset) {
    case CameraPreset.Custom:
      return null;
    case CameraPreset.Front:
      return [0, 0, 5];
    case CameraPreset.Back:
      return [0, 0, -5];
    case CameraPreset.Top:
      return [0, 5, 0];
    case CameraPreset.Bottom:
      return [0, -5, 0];
    case CameraPreset.Left:
      return [-5, 0, 0];
    case CameraPreset.Right:
      return [5, 0, 0];
    case CameraPreset.Isometric:
      return [3.5, 3.5, 3.5];
    default:
      return [0, 0, 5];
  }
};
