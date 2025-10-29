import { FC, useEffect, useMemo } from 'react';
import { MeshStandardMaterial } from 'three';

export const PlaceholderModel: FC = () => {
  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#cccccc',
        metalness: 0.1,
        roughness: 0.9,
      }),
    []
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh material={material} castShadow receiveShadow>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
    </mesh>
  );
};
