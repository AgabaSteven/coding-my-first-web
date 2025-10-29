import { useEffect, useRef, useState } from 'react';
import { Texture, TextureLoader } from 'three';

const textureLoader = new TextureLoader();

export const useOptionalTexture = (url?: string): Texture | null => {
  const [texture, setTexture] = useState<Texture | null>(null);
  const currentUrlRef = useRef<string | undefined>();

  useEffect(() => {
    if (currentUrlRef.current === url) {
      return undefined;
    }

    currentUrlRef.current = url;

    let disposed = false;

    setTexture((existing) => {
      existing?.dispose();
      return null;
    });

    if (!url) {
      return () => {
        disposed = true;
      };
    }

    let isActive = true;

    textureLoader.load(
      url,
      (loaded) => {
        if (!isActive) {
          loaded.dispose();
          return;
        }

        loaded.flipY = false;
        loaded.needsUpdate = true;
        setTexture((previous) => {
          if (disposed) {
            loaded.dispose();
            previous?.dispose();
            return null;
          }
          previous?.dispose();
          return loaded;
        });
      },
      undefined,
      () => {
        if (!isActive) {
          return;
        }
        setTexture((previous) => {
          previous?.dispose();
          return null;
        });
      }
    );

    return () => {
      isActive = false;
      disposed = true;
    };
  }, [url]);

  return texture;
};
