(function (global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    // eslint-disable-next-line no-param-reassign
    global.dataFormatter = factory();
  }
})(typeof window !== 'undefined' ? window : this, function dataFormatterFactory() {
  const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  function toKey(value) {
    if (value === undefined || value === null) {
      return '';
    }

    return String(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  function parseNumber(value) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    const sanitized = String(value).replace(/[^0-9+\-.,]/g, '').replace(/,/g, '');
    if (!sanitized) {
      return null;
    }

    const parsed = Number.parseFloat(sanitized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function parsePercentage(value) {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        return null;
      }
      return value > 1 ? value / 100 : value;
    }

    const stringValue = String(value).trim();
    if (!stringValue) {
      return null;
    }

    const containsPercent = stringValue.includes('%');
    const numeric = parseNumber(stringValue.replace('%', ''));

    if (numeric === null) {
      return null;
    }

    if (containsPercent || numeric > 1) {
      return numeric / 100;
    }

    return numeric;
  }

  function parseDateLike(value) {
    if (value === null || value === undefined) {
      return Number.NaN;
    }

    const stringValue = String(value).trim();
    if (!stringValue) {
      return Number.NaN;
    }

    const directTimestamp = Date.parse(stringValue);
    if (!Number.isNaN(directTimestamp)) {
      return directTimestamp;
    }

    const isoMonthMatch = stringValue.match(/^([0-9]{4})[-/]?(0?[1-9]|1[0-2])([-/_]([0-2]?[0-9]|3[01]))?$/);
    if (isoMonthMatch) {
      const year = Number.parseInt(isoMonthMatch[1], 10);
      const month = Number.parseInt(isoMonthMatch[2], 10) - 1;
      if (!Number.isNaN(year) && !Number.isNaN(month)) {
        return Date.UTC(year, month, 1);
      }
    }

    const quarterMatch = stringValue.match(/^(?:Q([1-4])\s*([0-9]{4})|([0-9]{4})\s*[-/]?\s*Q([1-4]))$/i);
    if (quarterMatch) {
      const quarter = Number.parseInt(quarterMatch[1] || quarterMatch[4], 10);
      const year = Number.parseInt(quarterMatch[2] || quarterMatch[3], 10);
      if (!Number.isNaN(year) && !Number.isNaN(quarter)) {
        return Date.UTC(year, (quarter - 1) * 3, 1);
      }
    }

    const monthYearMatch = stringValue.match(/^([a-zA-Z]+)\s+([0-9]{4})$/);
    if (monthYearMatch) {
      const monthName = monthYearMatch[1].toLowerCase();
      const monthIndex = MONTH_NAMES.findIndex((name) => name.toLowerCase() === monthName);
      const year = Number.parseInt(monthYearMatch[2], 10);
      if (monthIndex >= 0 && !Number.isNaN(year)) {
        return Date.UTC(year, monthIndex, 1);
      }
    }

    const yearOnlyMatch = stringValue.match(/^([0-9]{4})$/);
    if (yearOnlyMatch) {
      const year = Number.parseInt(yearOnlyMatch[1], 10);
      if (!Number.isNaN(year)) {
        return Date.UTC(year, 0, 1);
      }
    }

    return Number.NaN;
  }

  function createQuarterLabel(value) {
    const match = String(value)
      .toUpperCase()
      .match(/^(?:Q([1-4])\s*([0-9]{4})|([0-9]{4})\s*[-/]?\s*Q([1-4]))$/);

    if (!match) {
      return null;
    }

    const quarterFromQn = match[1] || match[4];
    const yearFromQn = match[2] || match[3];
    if (quarterFromQn && yearFromQn) {
      return `Q${Number.parseInt(quarterFromQn, 10)} ${yearFromQn}`;
    }

    return null;
  }

  function createPeriodLabel(value) {
    if (value === undefined || value === null) {
      return '';
    }

    const stringValue = String(value).trim();
    if (!stringValue) {
      return '';
    }

    const quarterLabel = createQuarterLabel(stringValue);
    if (quarterLabel) {
      return quarterLabel;
    }

    const isoMonthMatch = stringValue.match(/^([0-9]{4})[-/]?(0?[1-9]|1[0-2])([-/_]([0-2]?[0-9]|3[01]))?$/);
    if (isoMonthMatch) {
      const year = Number.parseInt(isoMonthMatch[1], 10);
      const monthIndex = Number.parseInt(isoMonthMatch[2], 10) - 1;
      if (!Number.isNaN(year) && monthIndex >= 0 && monthIndex < MONTH_NAMES.length) {
        return `${MONTH_NAMES[monthIndex]} ${year}`;
      }
    }

    const monthYearMatch = stringValue.match(/^([a-zA-Z]+)\s+([0-9]{4})$/);
    if (monthYearMatch) {
      const monthName = monthYearMatch[1];
      const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
      return `${capitalized} ${monthYearMatch[2]}`;
    }

    return stringValue;
  }

  function computeSortKey(row, label, fallbackIndex) {
    if (row.sort_key !== undefined) {
      const sortValue = parseNumber(row.sort_key);
      if (sortValue !== null) {
        return sortValue;
      }
    }

    const explicitDate = parseDateLike(row.date);
    if (!Number.isNaN(explicitDate)) {
      return explicitDate;
    }

    const periodDate = parseDateLike(row.period || label);
    if (!Number.isNaN(periodDate)) {
      return periodDate;
    }

    const labelDate = parseDateLike(label);
    if (!Number.isNaN(labelDate)) {
      return labelDate;
    }

    return fallbackIndex;
  }

  function normalizeSheetValues(values) {
    if (!Array.isArray(values) || values.length < 2) {
      return [];
    }

    const [headerRow, ...dataRows] = values;
    if (!Array.isArray(headerRow)) {
      return [];
    }

    const headers = headerRow.map((header) => toKey(header));

    return dataRows
      .map((row) => {
        if (!Array.isArray(row)) {
          return null;
        }

        const objectRow = {};
        headers.forEach((headerKey, index) => {
          if (!headerKey) {
            return;
          }
          objectRow[headerKey] = row[index];
        });
        return objectRow;
      })
      .filter(Boolean);
  }

  function formatSheetRows(rows) {
    if (!Array.isArray(rows)) {
      return [];
    }

    const formatted = [];

    rows.forEach((originalRow, index) => {
      if (!originalRow || typeof originalRow !== 'object') {
        return;
      }

      const normalizedRow = {};
      Object.keys(originalRow).forEach((key) => {
        const normalizedKey = toKey(key);
        if (normalizedKey) {
          normalizedRow[normalizedKey] = originalRow[key];
        }
      });

      const periodSource =
        normalizedRow.period ||
        normalizedRow.label ||
        normalizedRow.date ||
        normalizedRow.week ||
        normalizedRow.month;

      if (!periodSource) {
        return;
      }

      const periodLabel = createPeriodLabel(periodSource);
      const sortKey = computeSortKey(normalizedRow, periodLabel, index);

      const activeUsers = parseNumber(
        normalizedRow.active_users || normalizedRow.users || normalizedRow.active_users_total
      );
      const conversionRate = parsePercentage(
        normalizedRow.conversion_rate || normalizedRow.conversion || normalizedRow.signup_conversion
      );
      const retentionRate = parsePercentage(
        normalizedRow.retention_rate || normalizedRow.retention || normalizedRow.churn_rate
      );
      const netPromoterScore = parseNumber(
        normalizedRow.net_promoter_score || normalizedRow.nps || normalizedRow.satisfaction_score
      );

      formatted.push({
        id:
          normalizedRow.id ||
          periodLabel
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') ||
          `period-${index + 1}`,
        period: periodLabel,
        sortKey,
        activeUsers: activeUsers === null ? null : Math.round(activeUsers),
        conversionRate: conversionRate === null ? null : conversionRate,
        retentionRate: retentionRate === null ? null : retentionRate,
        netPromoterScore: netPromoterScore === null ? null : Math.round(netPromoterScore)
      });
    });

    return formatted.sort((a, b) => a.sortKey - b.sortKey);
  }

  function calculateDelta(current, previous) {
    if (current === null || current === undefined) {
      return null;
    }

    if (previous === null || previous === undefined || previous === 0) {
      return null;
    }

    return (current - previous) / Math.abs(previous);
  }

  function buildDeltas(data) {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((row, index) => {
      if (index === 0) {
        return {
          ...row,
          deltas: {
            activeUsers: null,
            conversionRate: null,
            retentionRate: null,
            netPromoterScore: null
          }
        };
      }

      const previous = data[index - 1];

      return {
        ...row,
        deltas: {
          activeUsers: calculateDelta(row.activeUsers, previous.activeUsers),
          conversionRate: calculateDelta(row.conversionRate, previous.conversionRate),
          retentionRate: calculateDelta(row.retentionRate, previous.retentionRate),
          netPromoterScore: calculateDelta(row.netPromoterScore, previous.netPromoterScore)
        }
      };
    });
  }

  return {
    parseNumber,
    parsePercentage,
    normalizeSheetValues,
    formatSheetRows,
    buildDeltas,
    createPeriodLabel
  };
});
