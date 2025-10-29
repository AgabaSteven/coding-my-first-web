import { sanitizeVariants, resolveModelUrl } from './variantUtils';
import { ModelVariant } from '../types';

describe('variantUtils', () => {
  describe('sanitizeVariants', () => {
    it('should return empty array when variants is undefined', () => {
      expect(sanitizeVariants(undefined)).toEqual([]);
    });

    it('should filter out invalid variants', () => {
      const variants = [
        { label: 'Valid', url: 'https://example.com/model.glb' },
        null as unknown as ModelVariant,
        { label: '', url: 'https://example.com/model2.glb' },
        { label: 'Valid2', url: '' },
        { label: 'Valid3', url: 'https://example.com/model3.glb' },
      ];

      const result = sanitizeVariants(variants);
      expect(result).toEqual([
        { label: 'Valid', url: 'https://example.com/model.glb' },
        { label: 'Valid3', url: 'https://example.com/model3.glb' },
      ]);
    });

    it('should trim label and url strings', () => {
      const variants = [
        { label: '  Spaced  ', url: '  https://example.com/model.glb  ' },
      ];

      const result = sanitizeVariants(variants);
      expect(result).toEqual([
        { label: 'Spaced', url: 'https://example.com/model.glb' },
      ]);
    });
  });

  describe('resolveModelUrl', () => {
    it('should return modelUrl when no variants are provided', () => {
      const modelUrl = 'https://example.com/default.glb';
      expect(resolveModelUrl(modelUrl, undefined, undefined)).toBe(modelUrl);
      expect(resolveModelUrl(modelUrl, [], undefined)).toBe(modelUrl);
    });

    it('should return first variant url when selectedVariant is undefined', () => {
      const modelUrl = 'https://example.com/default.glb';
      const variants = [
        { label: 'Variant 1', url: 'https://example.com/variant1.glb' },
        { label: 'Variant 2', url: 'https://example.com/variant2.glb' },
      ];

      expect(resolveModelUrl(modelUrl, variants, undefined)).toBe(
        'https://example.com/variant1.glb'
      );
    });

    it('should return selected variant url', () => {
      const modelUrl = 'https://example.com/default.glb';
      const variants = [
        { label: 'Variant 1', url: 'https://example.com/variant1.glb' },
        { label: 'Variant 2', url: 'https://example.com/variant2.glb' },
        { label: 'Variant 3', url: 'https://example.com/variant3.glb' },
      ];

      expect(resolveModelUrl(modelUrl, variants, 1)).toBe(
        'https://example.com/variant2.glb'
      );
    });

    it('should clamp selectedVariant to valid range', () => {
      const modelUrl = 'https://example.com/default.glb';
      const variants = [
        { label: 'Variant 1', url: 'https://example.com/variant1.glb' },
        { label: 'Variant 2', url: 'https://example.com/variant2.glb' },
      ];

      expect(resolveModelUrl(modelUrl, variants, -1)).toBe(
        'https://example.com/variant1.glb'
      );
      expect(resolveModelUrl(modelUrl, variants, 10)).toBe(
        'https://example.com/variant2.glb'
      );
    });

    it('should trim modelUrl', () => {
      const modelUrl = '  https://example.com/default.glb  ';
      expect(resolveModelUrl(modelUrl, undefined, undefined)).toBe(
        'https://example.com/default.glb'
      );
    });
  });
});
