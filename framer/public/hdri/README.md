# HDRI Environment Maps

This directory is reserved for HDRI environment maps for realistic lighting and reflections.

## Suggested Sources

All suggested sources offer CC0 or permissive licenses suitable for commercial use:

- [Poly Haven](https://polyhaven.com/hdris) — CC0 HDRI library (highly recommended)
- [HDRI Haven](https://hdrihaven.com/) — CC0 environment maps

## Recommended File Formats

- **HDR** — Full dynamic range, larger file sizes
- **EXR** — Industry-standard, supports multi-channel data

## Usage Example

```tsx
import { Environment } from '@react-three/drei';

<Environment files="/hdri/studio_small_08_1k.hdr" />
```

When adding HDRIs:
- Name files descriptively (e.g., `studio-light-1k.hdr`)
- Include any required attribution in `ATTRIBUTION.md`
- Consider using 1k or 2k resolutions for web performance
