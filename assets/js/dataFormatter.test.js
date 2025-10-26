const { formatSheetRows, normalizeSheetValues, buildDeltas, parseNumber, parsePercentage } =
  require('./dataFormatter');

describe('dataFormatter', () => {
  describe('parseNumber', () => {
    test('parses valid integers', () => {
      expect(parseNumber('12345')).toBe(12345);
      expect(parseNumber(12345)).toBe(12345);
    });

    test('parses valid decimals', () => {
      expect(parseNumber('123.45')).toBe(123.45);
      expect(parseNumber(123.45)).toBe(123.45);
    });

    test('handles comma separators', () => {
      expect(parseNumber('1,234.56')).toBe(1234.56);
    });

    test('returns null for invalid input', () => {
      expect(parseNumber(null)).toBeNull();
      expect(parseNumber(undefined)).toBeNull();
      expect(parseNumber('')).toBeNull();
      expect(parseNumber('abc')).toBeNull();
    });

    test('handles negative numbers', () => {
      expect(parseNumber('-123.45')).toBe(-123.45);
    });
  });

  describe('parsePercentage', () => {
    test('parses percentage strings', () => {
      expect(parsePercentage('45%')).toBeCloseTo(0.45);
      expect(parsePercentage('3.5%')).toBeCloseTo(0.035);
    });

    test('parses decimal percentages', () => {
      expect(parsePercentage('0.45')).toBeCloseTo(0.45);
      expect(parsePercentage(0.45)).toBeCloseTo(0.45);
    });

    test('converts whole numbers over 1 to percentages', () => {
      expect(parsePercentage('45')).toBeCloseTo(0.45);
      expect(parsePercentage(45)).toBeCloseTo(0.45);
    });

    test('returns null for invalid input', () => {
      expect(parsePercentage(null)).toBeNull();
      expect(parsePercentage(undefined)).toBeNull();
      expect(parsePercentage('')).toBeNull();
    });
  });

  describe('normalizeSheetValues', () => {
    test('converts 2D array to array of objects', () => {
      const input = [
        ['Period', 'Active Users', 'Conversion Rate'],
        ['2024-Q1', '10000', '3.5%'],
        ['2024-Q2', '12000', '4.2%']
      ];

      const result = normalizeSheetValues(input);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('period');
      expect(result[0]).toHaveProperty('active_users');
      expect(result[0]).toHaveProperty('conversion_rate');
    });

    test('handles empty input', () => {
      expect(normalizeSheetValues([])).toEqual([]);
      expect(normalizeSheetValues([['Header']])).toEqual([]);
    });

    test('filters out invalid rows', () => {
      const input = [['Period', 'Value'], ['2024-Q1', '100'], null, ['2024-Q2', '200']];

      const result = normalizeSheetValues(input);

      expect(result).toHaveLength(2);
    });
  });

  describe('formatSheetRows', () => {
    test('formats rows with period labels', () => {
      const input = [
        {
          period: '2024-Q1',
          active_users: '10000',
          conversion_rate: '3.5%',
          retention_rate: '72%',
          net_promoter_score: '45'
        },
        {
          period: '2024-Q2',
          active_users: '12000',
          conversion_rate: '4.2%',
          retention_rate: '75%',
          net_promoter_score: '48'
        }
      ];

      const result = formatSheetRows(input);

      expect(result).toHaveLength(2);
      expect(result[0].period).toBe('Q1 2024');
      expect(result[0].activeUsers).toBe(10000);
      expect(result[0].conversionRate).toBeCloseTo(0.035);
      expect(result[0].retentionRate).toBeCloseTo(0.72);
      expect(result[0].netPromoterScore).toBe(45);
    });

    test('handles missing values', () => {
      const input = [
        {
          period: '2024-Q1',
          active_users: '10000'
        }
      ];

      const result = formatSheetRows(input);

      expect(result).toHaveLength(1);
      expect(result[0].activeUsers).toBe(10000);
      expect(result[0].conversionRate).toBeNull();
      expect(result[0].retentionRate).toBeNull();
      expect(result[0].netPromoterScore).toBeNull();
    });

    test('sorts rows by period', () => {
      const input = [
        { period: '2024-03', active_users: '1000' },
        { period: '2024-01', active_users: '1200' },
        { period: '2024-02', active_users: '1100' }
      ];

      const result = formatSheetRows(input);

      expect(result[0].period).toBe('January 2024');
      expect(result[1].period).toBe('February 2024');
      expect(result[2].period).toBe('March 2024');
    });
  });

  describe('buildDeltas', () => {
    test('calculates period-over-period deltas', () => {
      const input = [
        {
          period: 'Q1 2024',
          activeUsers: 10000,
          conversionRate: 0.04,
          retentionRate: 0.7,
          netPromoterScore: 40
        },
        {
          period: 'Q2 2024',
          activeUsers: 12000,
          conversionRate: 0.05,
          retentionRate: 0.75,
          netPromoterScore: 45
        }
      ];

      const result = buildDeltas(input);

      expect(result).toHaveLength(2);
      expect(result[0].deltas.activeUsers).toBeNull();
      expect(result[1].deltas.activeUsers).toBeCloseTo(0.2);
      expect(result[1].deltas.conversionRate).toBeCloseTo(0.25);
      expect(result[1].deltas.retentionRate).toBeCloseTo(0.0714, 3);
      expect(result[1].deltas.netPromoterScore).toBeCloseTo(0.125);
    });

    test('handles null values in delta calculation', () => {
      const input = [
        {
          period: 'Q1 2024',
          activeUsers: 10000,
          conversionRate: null,
          retentionRate: 0.7,
          netPromoterScore: 40
        },
        {
          period: 'Q2 2024',
          activeUsers: 12000,
          conversionRate: 0.05,
          retentionRate: null,
          netPromoterScore: 45
        }
      ];

      const result = buildDeltas(input);

      expect(result[1].deltas.conversionRate).toBeNull();
      expect(result[1].deltas.retentionRate).toBeNull();
    });

    test('returns empty array for empty input', () => {
      expect(buildDeltas([])).toEqual([]);
    });
  });

  describe('integration test', () => {
    test('full pipeline from sheet values to formatted data with deltas', () => {
      const sheetValues = [
        ['Period', 'Active Users', 'Conversion Rate', 'Retention Rate', 'NPS'],
        ['2024-Q1', '10000', '3.5%', '70%', '40'],
        ['2024-Q2', '12000', '4.0%', '72%', '42'],
        ['2024-Q3', '14500', '4.5%', '75%', '45']
      ];

      const normalized = normalizeSheetValues(sheetValues);
      const formatted = formatSheetRows(normalized);
      const withDeltas = buildDeltas(formatted);

      expect(withDeltas).toHaveLength(3);

      expect(withDeltas[0].period).toBe('Q1 2024');
      expect(withDeltas[0].deltas.activeUsers).toBeNull();

      expect(withDeltas[1].period).toBe('Q2 2024');
      expect(withDeltas[1].activeUsers).toBe(12000);
      expect(withDeltas[1].deltas.activeUsers).toBeCloseTo(0.2);

      expect(withDeltas[2].period).toBe('Q3 2024');
      expect(withDeltas[2].activeUsers).toBe(14500);
      expect(withDeltas[2].deltas.activeUsers).toBeCloseTo(0.2083, 3);
    });
  });
});
