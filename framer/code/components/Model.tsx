import { FC, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import {
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from 'three';
import { MaterialConfig, MaterialType } from '../types';
import { useOptionalTexture } from '../hooks/useOptionalTexture';

interface ModelProps {
  url: string;
  materialConfig: MaterialConfig;
}

export const Model: FC<ModelProps> = ({ url, materialConfig }) => {
  const gltf = useGLTF(url);
  const texture = useOptionalTexture(materialConfig.textureUrl);
  const { type, color, metalness, roughness } = materialConfig;

  const material = useMemo(() => {
    const baseParams = {
      color,
      map: texture ?? undefined,
    };

    switch (type) {
      case MaterialType.Basic:
        return new MeshBasicMaterial(baseParams);
      case MaterialType.Physical:
        return new MeshPhysicalMaterial({
          ...baseParams,
          metalness,
          roughness,
        });
      case MaterialType.Standard:
      default:
        return new MeshStandardMaterial({
          ...baseParams,
          metalness,
          roughness,
        });
    }
  }, [type, color, metalness, roughness, texture]);

  useEffect(() => () => material.dispose(), [material]);

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((child) => {
      const mesh = child as Mesh;
      if (mesh.isMesh) {
        mesh.material = material;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return cloned;
  }, [gltf.scene, material]);

  return <primitive object={scene} />;
};
