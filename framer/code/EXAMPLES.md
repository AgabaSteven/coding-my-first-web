# Product 3D Viewer - Usage Examples

## Basic Setup

```tsx
import { Product3DViewer } from './Product3DViewer';

// Minimal setup
<Product3DViewer 
  modelUrl="https://example.com/model.glb"
/>
```

## Multiple Variants

```tsx
<Product3DViewer 
  modelUrl="https://example.com/default.glb"
  variants={[
    { label: "Red", url: "https://example.com/red.glb" },
    { label: "Blue", url: "https://example.com/blue.glb" },
    { label: "Green", url: "https://example.com/green.glb" }
  ]}
  selectedVariant={0}
/>
```

## Custom Camera

```tsx
<Product3DViewer 
  modelUrl="https://example.com/model.glb"
  camera={{
    preset: CameraPreset.Custom,
    position: { x: 5, y: 3, z: 5 },
    fov: 60
  }}
/>
```

## Camera Presets

```tsx
<Product3DViewer 
  modelUrl="https://example.com/model.glb"
  camera={{
    preset: CameraPreset.Isometric,
    fov: 50
  }}
/>
```

## Auto-Rotating Model

```tsx
<Product3DViewer 
  modelUrl="https://example.com/model.glb"
  orbitControls={{
    enabled: true,
    autoRotate: true,
    autoRotateSpeed: 2,
    enablePan: true,
    enableZoom: true,
    enableDamping: true,
    dampingFactor: 0.05,
    minDistance: 2,
    maxDistance: 20
  }}
/>
```

## Custom Material

```tsx
<Product3DViewer 
  modelUrl="https://example.com/model.glb"
  material={{
    type: MaterialType.Physical,
    color: "#ff6b6b",
    metalness: 0.8,
    roughness: 0.2,
    textureUrl: "https://example.com/texture.jpg"
  }}
/>
```

## Advanced Lighting

```tsx
<Product3DViewer 
  modelUrl="https://example.com/model.glb"
  lighting={{
    ambientIntensity: 0.3,
    ambientColor: "#ffffff",
    directionalEnabled: true,
    directionalIntensity: 1.5,
    directionalColor: "#ffffff",
    directionalPosition: { x: 10, y: 10, z: 10 },
    pointEnabled: true,
    pointIntensity: 0.5,
    pointColor: "#4dabf7",
    pointPosition: { x: -5, y: 5, z: -5 },
    shadowsEnabled: true,
    shadowMapSize: 4096,
    shadowBias: -0.0001
  }}
/>
```

## HDRI Environment

```tsx
<Product3DViewer 
  modelUrl="https://example.com/model.glb"
  environment={{
    backgroundColor: "#000000",
    backgroundTransparent: false,
    hdriUrl: "https://example.com/studio.hdr",
    groundPlane: true
  }}
/>
```

## Transparent Background

```tsx
<Product3DViewer 
  modelUrl="https://example.com/model.glb"
  environment={{
    backgroundColor: "#ffffff",
    backgroundTransparent: true,
    groundPlane: false
  }}
/>
```

## Complete Configuration

```tsx
<Product3DViewer 
  width={1200}
  height={800}
  modelUrl="https://example.com/default.glb"
  variants={[
    { label: "Variant 1", url: "https://example.com/v1.glb" },
    { label: "Variant 2", url: "https://example.com/v2.glb" }
  ]}
  selectedVariant={0}
  camera={{
    preset: CameraPreset.Custom,
    position: { x: 3, y: 2, z: 5 },
    fov: 55
  }}
  orbitControls={{
    enabled: true,
    autoRotate: true,
    autoRotateSpeed: 1.5,
    enablePan: true,
    enableZoom: true,
    enableDamping: true,
    dampingFactor: 0.1,
    minDistance: 2,
    maxDistance: 30
  }}
  material={{
    type: MaterialType.Physical,
    color: "#ffffff",
    metalness: 0.5,
    roughness: 0.3,
    textureUrl: "https://example.com/texture.jpg"
  }}
  lighting={{
    ambientIntensity: 0.4,
    ambientColor: "#ffffff",
    directionalEnabled: true,
    directionalIntensity: 1.2,
    directionalColor: "#ffffff",
    directionalPosition: { x: 5, y: 8, z: 5 },
    pointEnabled: true,
    pointIntensity: 0.7,
    pointColor: "#ffd43b",
    pointPosition: { x: -5, y: 3, z: -3 },
    spotEnabled: false,
    shadowsEnabled: true,
    shadowMapSize: 2048,
    shadowBias: -0.0001
  }}
  environment={{
    backgroundColor: "#1a1a1a",
    backgroundTransparent: false,
    hdriUrl: "https://example.com/studio.hdr",
    groundPlane: true
  }}
/>
```
