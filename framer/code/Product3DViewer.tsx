import { FC, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { addPropertyControls, ControlType } from 'framer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Scene } from './components/Scene';
import { resolveModelUrl } from './utils/variantUtils';
import { normalizeVector3 } from './utils/vector3';
import {
  CameraPreset,
  MaterialType,
  Product3DViewerProps,
  Vector3Input,
} from './types';

const DEFAULT_CAMERA = {
  position: { x: 0, y: 0, z: 5 } as Vector3Input,
  preset: CameraPreset.Custom,
  fov: 50,
};

const DEFAULT_ORBIT = {
  enabled: true,
  autoRotate: false,
  autoRotateSpeed: 2,
  enablePan: true,
  enableZoom: true,
  enableDamping: true,
  dampingFactor: 0.05,
  minDistance: 1,
  maxDistance: 50,
};

const DEFAULT_MATERIAL = {
  type: MaterialType.Standard,
  color: '#ffffff',
  metalness: 0.5,
  roughness: 0.5,
  textureUrl: undefined as string | undefined,
};

const DEFAULT_LIGHTING = {
  ambientIntensity: 0.5,
  ambientColor: '#ffffff',
  directionalEnabled: true,
  directionalIntensity: 1,
  directionalColor: '#ffffff',
  directionalPosition: { x: 5, y: 5, z: 5 } as Vector3Input,
  pointEnabled: false,
  pointIntensity: 1,
  pointColor: '#ffffff',
  pointPosition: { x: -5, y: 5, z: -5 } as Vector3Input,
  spotEnabled: false,
  spotIntensity: 1,
  spotColor: '#ffffff',
  spotPosition: { x: 0, y: 10, z: 0 } as Vector3Input,
  shadowsEnabled: true,
  shadowMapSize: 2048,
  shadowBias: -0.0001,
};

const DEFAULT_ENVIRONMENT = {
  backgroundColor: '#f0f0f0',
  backgroundTransparent: false,
  hdriUrl: undefined as string | undefined,
  groundPlane: false,
};

const ErrorFallback: FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      color: '#666',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '14px',
    }}
  >
    Failed to load 3D model
  </div>
);

export const Product3DViewer: FC<Partial<Product3DViewerProps>> = ({
  width = 800,
  height = 600,
  modelUrl = '',
  variants = [],
  selectedVariant,
  camera,
  orbitControls,
  material,
  lighting,
  environment,
}) => {
  const finalModelUrl = useMemo(
    () => resolveModelUrl(modelUrl, variants, selectedVariant),
    [modelUrl, variants, selectedVariant]
  );

  const resolvedCamera = useMemo(() => {
    const merged = {
      ...DEFAULT_CAMERA,
      ...(camera ?? {}),
    };
    return {
      ...merged,
      position: (camera?.position as Vector3Input) ?? DEFAULT_CAMERA.position,
      preset: camera?.preset ?? DEFAULT_CAMERA.preset,
      fov: camera?.fov ?? DEFAULT_CAMERA.fov,
    };
  }, [camera]);

  const orbitConfig = useMemo(() => {
    const merged = {
      ...DEFAULT_ORBIT,
      ...(orbitControls ?? {}),
    };
    return {
      ...merged,
      enabled: orbitControls?.enabled ?? DEFAULT_ORBIT.enabled,
      autoRotate: orbitControls?.autoRotate ?? DEFAULT_ORBIT.autoRotate,
      autoRotateSpeed:
        orbitControls?.autoRotateSpeed ?? DEFAULT_ORBIT.autoRotateSpeed,
      enablePan: orbitControls?.enablePan ?? DEFAULT_ORBIT.enablePan,
      enableZoom: orbitControls?.enableZoom ?? DEFAULT_ORBIT.enableZoom,
      enableDamping:
        orbitControls?.enableDamping ?? DEFAULT_ORBIT.enableDamping,
      dampingFactor:
        orbitControls?.dampingFactor ?? DEFAULT_ORBIT.dampingFactor,
      minDistance: orbitControls?.minDistance ?? DEFAULT_ORBIT.minDistance,
      maxDistance: orbitControls?.maxDistance ?? DEFAULT_ORBIT.maxDistance,
    };
  }, [orbitControls]);

  const materialConfig = useMemo(() => {
    const merged = {
      ...DEFAULT_MATERIAL,
      ...(material ?? {}),
    };
    return {
      ...merged,
      type: material?.type ?? DEFAULT_MATERIAL.type,
      color: material?.color ?? DEFAULT_MATERIAL.color,
      metalness: material?.metalness ?? DEFAULT_MATERIAL.metalness,
      roughness: material?.roughness ?? DEFAULT_MATERIAL.roughness,
      textureUrl: material?.textureUrl?.trim() || undefined,
    };
  }, [material]);

  const lightingConfig = useMemo(() => {
    const merged = {
      ...DEFAULT_LIGHTING,
      ...(lighting ?? {}),
    };
    return {
      ...merged,
      ambientIntensity:
        lighting?.ambientIntensity ?? DEFAULT_LIGHTING.ambientIntensity,
      ambientColor: lighting?.ambientColor ?? DEFAULT_LIGHTING.ambientColor,
      directionalEnabled:
        lighting?.directionalEnabled ?? DEFAULT_LIGHTING.directionalEnabled,
      directionalIntensity:
        lighting?.directionalIntensity ??
        DEFAULT_LIGHTING.directionalIntensity,
      directionalColor:
        lighting?.directionalColor ?? DEFAULT_LIGHTING.directionalColor,
      directionalPosition:
        (lighting?.directionalPosition as Vector3Input) ??
        DEFAULT_LIGHTING.directionalPosition,
      pointEnabled: lighting?.pointEnabled ?? DEFAULT_LIGHTING.pointEnabled,
      pointIntensity:
        lighting?.pointIntensity ?? DEFAULT_LIGHTING.pointIntensity,
      pointColor: lighting?.pointColor ?? DEFAULT_LIGHTING.pointColor,
      pointPosition:
        (lighting?.pointPosition as Vector3Input) ??
        DEFAULT_LIGHTING.pointPosition,
      spotEnabled: lighting?.spotEnabled ?? DEFAULT_LIGHTING.spotEnabled,
      spotIntensity:
        lighting?.spotIntensity ?? DEFAULT_LIGHTING.spotIntensity,
      spotColor: lighting?.spotColor ?? DEFAULT_LIGHTING.spotColor,
      spotPosition:
        (lighting?.spotPosition as Vector3Input) ??
        DEFAULT_LIGHTING.spotPosition,
      shadowsEnabled:
        lighting?.shadowsEnabled ?? DEFAULT_LIGHTING.shadowsEnabled,
      shadowMapSize:
        lighting?.shadowMapSize ?? DEFAULT_LIGHTING.shadowMapSize,
      shadowBias: lighting?.shadowBias ?? DEFAULT_LIGHTING.shadowBias,
    };
  }, [lighting]);

  const environmentConfig = useMemo(() => {
    const merged = {
      ...DEFAULT_ENVIRONMENT,
      ...(environment ?? {}),
    };
    return {
      ...merged,
      backgroundColor:
        environment?.backgroundColor ?? DEFAULT_ENVIRONMENT.backgroundColor,
      backgroundTransparent:
        environment?.backgroundTransparent ??
        DEFAULT_ENVIRONMENT.backgroundTransparent,
      hdriUrl: environment?.hdriUrl?.trim() || undefined,
      groundPlane: environment?.groundPlane ?? DEFAULT_ENVIRONMENT.groundPlane,
    };
  }, [environment]);

  const initialCameraPosition = useMemo(
    () => normalizeVector3(resolvedCamera.position),
    [resolvedCamera.position]
  );

  if (!finalModelUrl) {
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          color: '#666',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px',
        }}
      >
        Please provide a model URL
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div style={{ width, height }}>
        <Canvas
          style={{ width: '100%', height: '100%' }}
          shadows={lightingConfig.shadowsEnabled}
          camera={{ fov: resolvedCamera.fov, position: initialCameraPosition }}
        >
          <Scene
            modelUrl={finalModelUrl}
            orbitControls={orbitConfig}
            materialConfig={materialConfig}
            lightingConfig={lightingConfig}
            environmentConfig={environmentConfig}
            cameraControls={resolvedCamera}
          />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
};

Product3DViewer.defaultProps = {
  width: 800,
  height: 600,
  modelUrl: '',
  variants: [],
  camera: DEFAULT_CAMERA,
  orbitControls: DEFAULT_ORBIT,
  material: DEFAULT_MATERIAL,
  lighting: DEFAULT_LIGHTING,
  environment: DEFAULT_ENVIRONMENT,
};

addPropertyControls(Product3DViewer, {
  modelUrl: {
    type: ControlType.String,
    title: 'Model URL',
    defaultValue: '',
    displayTextArea: true,
  },
  variants: {
    type: ControlType.Array,
    title: 'Variants',
    control: {
      type: ControlType.Object,
      controls: {
        label: {
          type: ControlType.String,
          title: 'Label',
          defaultValue: 'Variant',
        },
        url: {
          type: ControlType.String,
          title: 'URL',
          defaultValue: '',
          displayTextArea: true,
        },
      },
    },
  },
  selectedVariant: {
    type: ControlType.Number,
    title: 'Selected Variant',
    min: 0,
    step: 1,
    displayStepper: true,
    hidden: (props) => !props.variants || props.variants.length === 0,
  },
  camera: {
    type: ControlType.Object,
    title: 'Camera',
    controls: {
      preset: {
        type: ControlType.Enum,
        title: 'Preset',
        options: [
          CameraPreset.Custom,
          CameraPreset.Front,
          CameraPreset.Back,
          CameraPreset.Top,
          CameraPreset.Bottom,
          CameraPreset.Left,
          CameraPreset.Right,
          CameraPreset.Isometric,
        ],
        optionTitles: [
          'Custom',
          'Front',
          'Back',
          'Top',
          'Bottom',
          'Left',
          'Right',
          'Isometric',
        ],
        defaultValue: CameraPreset.Custom,
      },
      position: {
        type: ControlType.Object,
        title: 'Position',
        controls: {
          x: { type: ControlType.Number, title: 'X', defaultValue: 0, step: 0.1 },
          y: { type: ControlType.Number, title: 'Y', defaultValue: 0, step: 0.1 },
          z: { type: ControlType.Number, title: 'Z', defaultValue: 5, step: 0.1 },
        },
        hidden: (props) => props.camera?.preset !== CameraPreset.Custom,
      },
      fov: {
        type: ControlType.Number,
        title: 'FOV',
        min: 20,
        max: 120,
        step: 1,
        defaultValue: 50,
      },
    },
  },
  orbitControls: {
    type: ControlType.Object,
    title: 'Orbit Controls',
    controls: {
      enabled: {
        type: ControlType.Boolean,
        title: 'Enabled',
        defaultValue: true,
      },
      autoRotate: {
        type: ControlType.Boolean,
        title: 'Auto Rotate',
        defaultValue: false,
      },
      autoRotateSpeed: {
        type: ControlType.Number,
        title: 'Rotate Speed',
        min: -10,
        max: 10,
        step: 0.1,
        defaultValue: 2,
        hidden: (props) => !props.orbitControls?.autoRotate,
      },
      enablePan: {
        type: ControlType.Boolean,
        title: 'Enable Pan',
        defaultValue: true,
      },
      enableZoom: {
        type: ControlType.Boolean,
        title: 'Enable Zoom',
        defaultValue: true,
      },
      enableDamping: {
        type: ControlType.Boolean,
        title: 'Enable Damping',
        defaultValue: true,
      },
      dampingFactor: {
        type: ControlType.Number,
        title: 'Damping Factor',
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.05,
        hidden: (props) => !props.orbitControls?.enableDamping,
      },
      minDistance: {
        type: ControlType.Number,
        title: 'Min Distance',
        min: 0.1,
        max: 100,
        step: 0.1,
        defaultValue: 1,
      },
      maxDistance: {
        type: ControlType.Number,
        title: 'Max Distance',
        min: 1,
        max: 200,
        step: 1,
        defaultValue: 50,
      },
    },
  },
  material: {
    type: ControlType.Object,
    title: 'Material',
    controls: {
      type: {
        type: ControlType.Enum,
        title: 'Type',
        options: [MaterialType.Standard, MaterialType.Physical, MaterialType.Basic],
        optionTitles: ['Standard', 'Physical', 'Basic'],
        defaultValue: MaterialType.Standard,
      },
      color: {
        type: ControlType.Color,
        title: 'Color',
        defaultValue: '#ffffff',
      },
      metalness: {
        type: ControlType.Number,
        title: 'Metalness',
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.5,
        hidden: (props) => props.material?.type === MaterialType.Basic,
      },
      roughness: {
        type: ControlType.Number,
        title: 'Roughness',
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.5,
        hidden: (props) => props.material?.type === MaterialType.Basic,
      },
      textureUrl: {
        type: ControlType.String,
        title: 'Texture URL',
        defaultValue: '',
        displayTextArea: true,
      },
    },
  },
  lighting: {
    type: ControlType.Object,
    title: 'Lighting',
    controls: {
      ambientIntensity: {
        type: ControlType.Number,
        title: 'Ambient Intensity',
        min: 0,
        max: 5,
        step: 0.1,
        defaultValue: 0.5,
      },
      ambientColor: {
        type: ControlType.Color,
        title: 'Ambient Color',
        defaultValue: '#ffffff',
      },
      directionalEnabled: {
        type: ControlType.Boolean,
        title: 'Directional Light',
        defaultValue: true,
      },
      directionalIntensity: {
        type: ControlType.Number,
        title: 'Dir. Intensity',
        min: 0,
        max: 5,
        step: 0.1,
        defaultValue: 1,
        hidden: (props) => !props.lighting?.directionalEnabled,
      },
      directionalColor: {
        type: ControlType.Color,
        title: 'Dir. Color',
        defaultValue: '#ffffff',
        hidden: (props) => !props.lighting?.directionalEnabled,
      },
      directionalPosition: {
        type: ControlType.Object,
        title: 'Dir. Position',
        controls: {
          x: { type: ControlType.Number, title: 'X', defaultValue: 5, step: 0.1 },
          y: { type: ControlType.Number, title: 'Y', defaultValue: 5, step: 0.1 },
          z: { type: ControlType.Number, title: 'Z', defaultValue: 5, step: 0.1 },
        },
        hidden: (props) => !props.lighting?.directionalEnabled,
      },
      pointEnabled: {
        type: ControlType.Boolean,
        title: 'Point Light',
        defaultValue: false,
      },
      pointIntensity: {
        type: ControlType.Number,
        title: 'Point Intensity',
        min: 0,
        max: 5,
        step: 0.1,
        defaultValue: 1,
        hidden: (props) => !props.lighting?.pointEnabled,
      },
      pointColor: {
        type: ControlType.Color,
        title: 'Point Color',
        defaultValue: '#ffffff',
        hidden: (props) => !props.lighting?.pointEnabled,
      },
      pointPosition: {
        type: ControlType.Object,
        title: 'Point Position',
        controls: {
          x: { type: ControlType.Number, title: 'X', defaultValue: -5, step: 0.1 },
          y: { type: ControlType.Number, title: 'Y', defaultValue: 5, step: 0.1 },
          z: { type: ControlType.Number, title: 'Z', defaultValue: -5, step: 0.1 },
        },
        hidden: (props) => !props.lighting?.pointEnabled,
      },
      spotEnabled: {
        type: ControlType.Boolean,
        title: 'Spot Light',
        defaultValue: false,
      },
      spotIntensity: {
        type: ControlType.Number,
        title: 'Spot Intensity',
        min: 0,
        max: 5,
        step: 0.1,
        defaultValue: 1,
        hidden: (props) => !props.lighting?.spotEnabled,
      },
      spotColor: {
        type: ControlType.Color,
        title: 'Spot Color',
        defaultValue: '#ffffff',
        hidden: (props) => !props.lighting?.spotEnabled,
      },
      spotPosition: {
        type: ControlType.Object,
        title: 'Spot Position',
        controls: {
          x: { type: ControlType.Number, title: 'X', defaultValue: 0, step: 0.1 },
          y: { type: ControlType.Number, title: 'Y', defaultValue: 10, step: 0.1 },
          z: { type: ControlType.Number, title: 'Z', defaultValue: 0, step: 0.1 },
        },
        hidden: (props) => !props.lighting?.spotEnabled,
      },
      shadowsEnabled: {
        type: ControlType.Boolean,
        title: 'Shadows',
        defaultValue: true,
      },
      shadowMapSize: {
        type: ControlType.Enum,
        title: 'Shadow Quality',
        options: [512, 1024, 2048, 4096],
        optionTitles: ['Low', 'Medium', 'High', 'Ultra'],
        defaultValue: 2048,
        hidden: (props) => !props.lighting?.shadowsEnabled,
      },
      shadowBias: {
        type: ControlType.Number,
        title: 'Shadow Bias',
        min: -0.01,
        max: 0.01,
        step: 0.0001,
        defaultValue: -0.0001,
        hidden: (props) => !props.lighting?.shadowsEnabled,
      },
    },
  },
  environment: {
    type: ControlType.Object,
    title: 'Environment',
    controls: {
      backgroundColor: {
        type: ControlType.Color,
        title: 'Background Color',
        defaultValue: '#f0f0f0',
      },
      backgroundTransparent: {
        type: ControlType.Boolean,
        title: 'Transparent Background',
        defaultValue: false,
      },
      hdriUrl: {
        type: ControlType.String,
        title: 'HDRI URL',
        defaultValue: '',
        displayTextArea: true,
      },
      groundPlane: {
        type: ControlType.Boolean,
        title: 'Ground Plane',
        defaultValue: false,
      },
    },
  },
});

Product3DViewer.displayName = 'Product3DViewer';

export default Product3DViewer;
