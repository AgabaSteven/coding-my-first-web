# Product 3D Viewer - Framer Component

A feature-rich 3D model viewer component built with React Three Fiber, Drei, and Three.js, designed for Framer.

## Features

- **GLB Model Loading**: Dynamic URL-based loading with Suspense and error handling
- **Variant Support**: Load multiple model variants with easy switching
- **Orbit Controls**: Fully configurable camera controls with auto-rotate, pan, zoom, and damping
- **Camera Presets**: Pre-configured camera positions (Front, Back, Top, Bottom, Left, Right, Isometric) or custom positioning
- **Material Controls**: Switch between Standard, Physical, and Basic materials with color, metalness, roughness, and texture support
- **Advanced Lighting**: Ambient, directional, point, and spot lights with independent controls
- **Shadow System**: Configurable shadow mapping with quality and bias controls
- **Environment**: Background color, transparency, HDRI environment maps, and ground plane shadow catcher
- **Performance Optimized**: Memoized materials, suspense boundaries, and efficient rendering
- **Error Handling**: Graceful fallbacks for loading errors

## Usage

Import the component in Framer and configure it using the property controls:

### Model Setup
1. Set the `Model URL` to your GLB file
2. Optionally add variants with labels and URLs
3. Select the active variant using the variant selector

### Camera Controls
- Choose a preset camera position or use custom positioning
- Adjust FOV (20-120)
- Fine-tune custom position with X, Y, Z coordinates

### Orbit Controls
- Enable/disable user interaction
- Toggle auto-rotate with adjustable speed
- Enable/disable pan and zoom
- Configure damping for smooth camera motion
- Set min/max distance limits

### Material
- Select material type (Standard/Physical/Basic)
- Set base color
- Adjust metalness and roughness (for Standard/Physical)
- Apply texture maps via URL

### Lighting
- Ambient: Base illumination with color and intensity
- Directional: Key light with position, color, and intensity
- Point: Omnidirectional light with position controls
- Spot: Focused light with position controls
- Shadow controls: Quality, bias, and toggle

### Environment
- Background color
- Transparent background option
- HDRI environment map support
- Ground plane shadow catcher

## File Structure

```
framer/code/
├── Product3DViewer.tsx       # Main component with Framer controls
├── types.ts                   # TypeScript type definitions
├── index.ts                   # Export file
├── components/
│   ├── CameraRig.tsx         # Camera management
│   ├── LightingRig.tsx       # Light setup
│   ├── Model.tsx             # GLB model loader with materials
│   ├── PlaceholderModel.tsx  # Fallback loading state
│   ├── Scene.tsx             # Main scene composition
│   └── ErrorBoundary.tsx     # Error handling
├── hooks/
│   └── useOptionalTexture.ts # Texture loading hook
└── utils/
    ├── variantUtils.ts       # Variant parsing and resolution
    ├── cameraPresets.ts      # Camera preset positions
    └── vector3.ts            # Vector3 normalization helpers
```

## Performance Tips

- Use optimized GLB models (compressed, low poly when possible)
- Enable shadows only when needed
- Use lower shadow map sizes for better performance
- HDRI environment maps can be large - use compressed formats
- Texture maps should be power-of-two dimensions

## Browser Support

Requires WebGL 2.0 support. Works in all modern browsers:
- Chrome 56+
- Firefox 51+
- Safari 15+
- Edge 79+
