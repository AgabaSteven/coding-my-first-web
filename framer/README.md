# Framer Workspace

This workspace contains custom Framer code components built with React, Three.js, and React Three Fiber for creating immersive 3D experiences.

## Directory Structure

```
framer/
├── code/                    # Component source code
│   ├── components/          # React components
│   └── index.ts            # Main entry point
├── public/                  # Static assets
│   └── models/             # 3D model files (.glb)
├── types/                   # TypeScript type definitions
├── dist/                    # Build output (gitignored)
└── node_modules/           # Dependencies (gitignored)
```

## Setup

Install dependencies:

```bash
cd framer
npm install
```

## Development Scripts

- `npm run lint` - Lint TypeScript files
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run typecheck` - Run TypeScript type checking
- `npm run build` - Build with TypeScript compiler

## Components

### Placeholder3DComponent

A basic 3D component that loads and displays a GLB model with orbit controls.

**Props:**
- `width` - Canvas width in pixels (default: 800)
- `height` - Canvas height in pixels (default: 600)
- `modelPath` - Path to GLB model (default: `/models/placeholder.glb`)

**Usage in Framer:**
```tsx
import { Placeholder3DComponent } from './code';

<Placeholder3DComponent 
  width={800} 
  height={600} 
  modelPath="/models/placeholder.glb" 
/>
```

## Assets

### 3D Models

Place GLB model files in `public/models/`. The placeholder model is a simple triangle for testing.

For production, replace with proper models from:
- [Poly Pizza](https://poly.pizza) - CC0 licensed models
- [Quaternius](https://quaternius.com) - CC0 low-poly assets
- [Kenney](https://kenney.nl/assets) - CC0 game assets

All assets must have permissive licenses allowing commercial use and redistribution.

## Path Aliases

TypeScript path aliases are configured:
- `@code/*` → `code/*`
- `@types/*` → `types/*`
- `@public/*` → `public/*`

## Technology Stack

- **React 18** - UI framework
- **TypeScript 5** - Type safety
- **Three.js** - 3D rendering engine
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers and abstractions
- **Framer** - Framer integration
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Notes

- Build artifacts stay within `framer/dist/` and are ignored by Jekyll
- The workspace is isolated from the root Jekyll site
- All dependencies are scoped to this workspace
