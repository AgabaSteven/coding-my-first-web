import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import type { Group } from 'three';

interface Model3DProps {
  modelPath?: string;
}

function Model3D({ modelPath = '/models/placeholder.glb' }: Model3DProps) {
  const groupRef = useRef<Group>(null);
  const gltf = useGLTF(modelPath);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return <primitive ref={groupRef} object={gltf.scene} scale={1} />;
}

export interface Placeholder3DComponentProps {
  width?: number;
  height?: number;
  modelPath?: string;
}

export default function Placeholder3DComponent({
  width = 800,
  height = 600,
  modelPath,
}: Placeholder3DComponentProps) {
  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={[0x0d0f1a]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model3D modelPath={modelPath} />
        </Suspense>
        <OrbitControls enableZoom enablePan />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/placeholder.glb');
