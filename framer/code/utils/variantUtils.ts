import { ModelVariant } from '../types';

export const sanitizeVariants = (variants?: ModelVariant[]): ModelVariant[] => {
  if (!variants) {
    return [];
  }

  return variants
    .filter((variant): variant is ModelVariant => {
      if (!variant) return false;
      const { label, url } = variant;
      return Boolean(label && url);
    })
    .map((variant) => ({
      label: variant.label.trim(),
      url: variant.url.trim(),
    }));
};

export const resolveModelUrl = (
  modelUrl: string,
  variants?: ModelVariant[],
  selectedVariant?: number
): string => {
  const safeModelUrl = modelUrl.trim();
  const cleanVariants = sanitizeVariants(variants);

  if (!cleanVariants.length) {
    return safeModelUrl;
  }

  if (selectedVariant == null) {
    return cleanVariants[0]?.url || safeModelUrl;
  }

  const index = Math.max(0, Math.min(selectedVariant, cleanVariants.length - 1));
  return cleanVariants[index]?.url || safeModelUrl;
};
