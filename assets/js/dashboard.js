(function setupDashboard() {

  const FALLBACK_ROWS = Object.freeze([
    {
      period: '2023-Q1',
      active_users: '11800',
      conversion_rate: '3.4%',
      retention_rate: '72%',
      net_promoter_score: '34'
    },
    {
      period: '2023-Q2',
      active_users: '12760',
      conversion_rate: '3.6%',
      retention_rate: '74%',
      net_promoter_score: '36'
    },
    {
      period: '2023-Q3',
      active_users: '13940',
      conversion_rate: '3.9%',
      retention_rate: '76%',
      net_promoter_score: '39'
    },
    {
      period: '2023-Q4',
      active_users: '15230',
      conversion_rate: '4.2%',
      retention_rate: '79%',
      net_promoter_score: '43'
    },
    {
      period: '2024-Q1',
      active_users: '16680',
      conversion_rate: '4.6%',
      retention_rate: '82%',
      net_promoter_score: '46'
    },
    {
      period: '2024-Q2',
      active_users: '18120',
      conversion_rate: '4.9%',
      retention_rate: '84%',
      net_promoter_score: '49'
    }
  ]);

  const ELEMENT_IDS = {
    chartCanvas: 'main-chart',
    chartContainer: 'chart-container',
    exportPng: 'export-png-btn',
    exportPdf: 'export-pdf-btn',
    exportStatus: 'export-status',
    playPause: 'play-pause-btn',
    playPauseIcon: 'play-pause-icon',
    playPauseText: 'play-pause-text',
    playStatus: 'playback-status',
    prevButton: 'prev-btn',
    nextButton: 'next-btn',
    range: 'timeline-range',
    period: 'timeline-period',
    announcer: 'timeline-announcer',
    metricUsersValue: 'metric-users-value',
    metricUsersDelta: 'metric-users-delta',
    metricConversionValue: 'metric-conversion-value',
    metricConversionDelta: 'metric-conversion-delta',
    metricRetentionValue: 'metric-retention-value',
    metricRetentionDelta: 'metric-retention-delta',
    metricNpsValue: 'metric-nps-value',
    metricNpsDelta: 'metric-nps-delta'
  };

  const state = {
    data: [],
    currentIndex: 0,
    isPlaying: false,
    timer: null,
    playbackInterval: 2500,
    chart: null
  };

  const elements = {};

  function cacheElements() {
    Object.entries(ELEMENT_IDS).forEach(([key, id]) => {
      elements[key] = document.getElementById(id);
    });
  }

  function getFormatter() {
    return typeof window !== 'undefined' ? window.dataFormatter : undefined;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function formatNumber(value, { decimals = 0 } = {}) {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '—';
    }

    return Number(value).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function formatPercentDecimal(value, { decimals = 1, includePlus = false } = {}) {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return '—';
    }

    const percentage = value * 100;
    const prefix = includePlus && percentage > 0 ? '+' : '';
    return `${prefix}${percentage.toFixed(decimals)}%`;
  }

  function setTrend(element, delta) {
    if (!element) {
      return;
    }

    if (delta === null || delta === undefined || Number.isNaN(delta)) {
      element.textContent = '';
      element.dataset.trend = 'neutral';
      element.setAttribute('aria-label', 'No change');
      return;
    }

    let trend = 'neutral';
    if (delta > 0) {
      trend = 'up';
    } else if (delta < 0) {
      trend = 'down';
    }

    element.dataset.trend = trend;
    element.textContent = formatPercentDecimal(delta, { decimals: 1, includePlus: true });

    let labelPrefix = 'Stable';
    if (trend === 'up') {
      labelPrefix = 'Increase';
    } else if (trend === 'down') {
      labelPrefix = 'Decrease';
    }

    element.setAttribute(
      'aria-label',
      `${labelPrefix} ${formatPercentDecimal(delta, { decimals: 1 })}`
    );
  }

  function setExportStatus(message, { persist = false } = {}) {
    if (!elements.exportStatus) {
      return;
    }

    elements.exportStatus.textContent = message;

    if (!persist && message) {
      window.setTimeout(() => {
        elements.exportStatus.textContent = '';
      }, 3200);
    }
  }

  function setBusy(button, isBusy) {
    if (!button) {
      return;
    }
    button.disabled = isBusy;
    button.setAttribute('aria-busy', isBusy ? 'true' : 'false');
  }

  function renderChart(data) {
    if (!elements.chartCanvas || typeof window.Chart === 'undefined') {
      return;
    }

    if (state.chart) {
      state.chart.destroy();
      state.chart = null;
    }

    const ctx = elements.chartCanvas.getContext('2d');
    const labels = data.map((entry) => entry.period);
    const activeUsers = data.map((entry) => entry.activeUsers ?? null);
    const conversion = data.map((entry) =>
      entry.conversionRate === null || entry.conversionRate === undefined
        ? null
        : entry.conversionRate * 100
    );

    state.chart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Active users',
            data: activeUsers,
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.18)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7,
            yAxisID: 'y'
          },
          {
            label: 'Conversion rate (%)',
            data: conversion,
            borderColor: '#34d399',
            backgroundColor: 'rgba(52, 211, 153, 0.18)',
            tension: 0.35,
            fill: false,
            pointRadius: 5,
            pointHoverRadius: 7,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2.45,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            labels: {
              color: '#e2e8f0',
              font: {
                family: 'Inter, sans-serif',
                size: 13
              },
              padding: 16
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(148, 163, 184, 0.28)',
            borderWidth: 1,
            titleColor: '#f8fafc',
            bodyColor: '#e2e8f0',
            padding: 12,
            displayColors: true
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#cbd5f5'
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.12)'
            }
          },
          y: {
            beginAtZero: false,
            ticks: {
              color: '#cbd5f5',
              callback(value) {
                return Number(value).toLocaleString('en-US');
              }
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.12)'
            },
            title: {
              display: true,
              text: 'Active users',
              color: '#e2e8f0'
            }
          },
          y1: {
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              color: '#cbd5f5',
              callback(value) {
                return `${value.toFixed(1)}%`;
              }
            },
            title: {
              display: true,
              text: 'Conversion rate (%)',
              color: '#e2e8f0'
            }
          }
        }
      }
    });

    highlightSelectedPoint(state.currentIndex);
  }

  function highlightSelectedPoint(index) {
    if (!state.chart) {
      return;
    }

    const dataset = state.chart.data.datasets[0];
    if (!dataset) {
      return;
    }

    const length = state.data.length;
    const highlightColors = Array.from({ length }, (_, dataIndex) =>
      dataIndex === index ? '#2563eb' : '#60a5fa'
    );
    const radius = Array.from({ length }, (_, dataIndex) => (dataIndex === index ? 7 : 5));

    dataset.pointBackgroundColor = highlightColors;
    dataset.pointBorderColor = highlightColors;
    dataset.pointRadius = radius;
    dataset.pointHoverRadius = radius.map((value) => value + 1.5);

    state.chart.update('none');
  }

  function updateSliderAttributes() {
    if (!elements.range) {
      return;
    }

    const maxIndex = Math.max(state.data.length - 1, 0);

    elements.range.min = '0';
    elements.range.max = String(maxIndex);
    elements.range.step = '1';
    elements.range.value = String(state.currentIndex);
    elements.range.setAttribute('aria-valuemin', '0');
    elements.range.setAttribute('aria-valuemax', String(maxIndex));

    const currentEntry = state.data[state.currentIndex];
    if (currentEntry) {
      elements.range.setAttribute('aria-valuetext', currentEntry.period);
      elements.range.setAttribute('aria-valuenow', String(state.currentIndex));
    }
  }

  function updatePlaybackControls() {
    if (elements.playPause) {
      elements.playPause.setAttribute('aria-pressed', state.isPlaying ? 'true' : 'false');
      elements.playPause.setAttribute(
        'aria-label',
        state.isPlaying ? 'Pause timeline' : 'Play timeline'
      );
      elements.playPause.title = state.isPlaying ? 'Pause timeline' : 'Play timeline';
    }

    if (elements.playPauseIcon) {
      elements.playPauseIcon.textContent = state.isPlaying ? '⏸️' : '▶️';
    }

    if (elements.playPauseText) {
      elements.playPauseText.textContent = state.isPlaying ? 'Pause timeline' : 'Play timeline';
    }

    if (elements.playStatus) {
      const currentEntry = state.data[state.currentIndex];
      const statusPrefix = state.isPlaying ? 'Playing' : 'Paused';
      elements.playStatus.textContent = currentEntry
        ? `${statusPrefix} — ${currentEntry.period}`
        : statusPrefix;
    }
  }

  function updateAnnouncement() {
    if (!elements.announcer) {
      return;
    }

    const currentEntry = state.data[state.currentIndex];
    if (!currentEntry) {
      elements.announcer.textContent = '';
      return;
    }

    const pieces = [`Viewing ${currentEntry.period}`];

    if (currentEntry.activeUsers !== null && currentEntry.activeUsers !== undefined) {
      pieces.push(`${formatNumber(currentEntry.activeUsers)} active users`);
    }

    if (currentEntry.conversionRate !== null && currentEntry.conversionRate !== undefined) {
      pieces.push(`conversion ${formatPercentDecimal(currentEntry.conversionRate, { decimals: 1 })}`);
    }

    elements.announcer.textContent = pieces.join(', ');
  }

  function updateMetrics() {
    const entry = state.data[state.currentIndex];
    if (!entry) {
      return;
    }

    if (elements.metricUsersValue) {
      elements.metricUsersValue.textContent = formatNumber(entry.activeUsers);
    }
    setTrend(elements.metricUsersDelta, entry.deltas?.activeUsers ?? null);

    if (elements.metricConversionValue) {
      elements.metricConversionValue.textContent = formatPercentDecimal(entry.conversionRate, {
        decimals: 1
      });
    }
    setTrend(elements.metricConversionDelta, entry.deltas?.conversionRate ?? null);

    if (elements.metricRetentionValue) {
      elements.metricRetentionValue.textContent = formatPercentDecimal(entry.retentionRate, {
        decimals: 1
      });
    }
    setTrend(elements.metricRetentionDelta, entry.deltas?.retentionRate ?? null);

    if (elements.metricNpsValue) {
      elements.metricNpsValue.textContent = formatNumber(entry.netPromoterScore);
    }
    setTrend(elements.metricNpsDelta, entry.deltas?.netPromoterScore ?? null);

    if (elements.period) {
      elements.period.textContent = entry.period;
    }

    updateSliderAttributes();
    highlightSelectedPoint(state.currentIndex);
    updatePlaybackControls();
    updateAnnouncement();
  }

  function clearTimer() {
    if (state.timer) {
      window.clearInterval(state.timer);
      state.timer = null;
    }
  }

  function stopPlayback() {
    clearTimer();
    state.isPlaying = false;
    updatePlaybackControls();
  }

  function startPlayback() {
    if (!state.data.length) {
      return;
    }

    clearTimer();
    state.isPlaying = true;
    updatePlaybackControls();

    state.timer = window.setInterval(() => {
      const nextIndex = (state.currentIndex + 1) % state.data.length;
      moveToIndex(nextIndex, { fromPlayback: true });
    }, state.playbackInterval);
  }

  function togglePlayback() {
    if (state.isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }

  function moveToIndex(index, { fromPlayback = false } = {}) {
    if (!fromPlayback) {
      stopPlayback();
    }

    const target = clamp(index, 0, state.data.length - 1);
    if (target === state.currentIndex && fromPlayback) {
      return;
    }

    state.currentIndex = target;
    updateMetrics();
  }

  function moveToPrevious() {
    moveToIndex(state.currentIndex - 1);
  }

  function moveToNext() {
    moveToIndex(state.currentIndex + 1);
  }

  function handleKeyboardControls(event) {
    if (!state.data.length) {
      return;
    }

    const targetTag = event.target.tagName.toLowerCase();
    if (targetTag === 'input' || targetTag === 'textarea') {
      return;
    }

    if (event.code === 'Space') {
      event.preventDefault();
      togglePlayback();
    }

    if (event.code === 'ArrowLeft') {
      event.preventDefault();
      moveToPrevious();
    }

    if (event.code === 'ArrowRight') {
      event.preventDefault();
      moveToNext();
    }
  }

  async function fetchSheetRows(url) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      const formatter = getFormatter();

      if (!formatter) {
        return Array.isArray(payload) ? payload : [];
      }

      if (Array.isArray(payload)) {
        if (payload.length && Array.isArray(payload[0])) {
          return formatter.normalizeSheetValues(payload);
        }
        return payload;
      }

      if (payload && Array.isArray(payload.values)) {
        return formatter.normalizeSheetValues(payload.values);
      }

      return [];
    } catch (error) {
      console.warn('Unable to load Google Sheets data:', error);
      return [];
    }
  }

  function prepareData(rows) {
    const formatter = getFormatter();

    if (!formatter) {
      return rows.map((row, index) => ({
        period: row.period || row.label || `Period ${index + 1}`,
        sortKey: index,
        activeUsers: Number(row.activeUsers ?? row.active_users ?? 0),
        conversionRate: Number(row.conversionRate ?? row.conversion_rate ?? 0),
        retentionRate: Number(row.retentionRate ?? row.retention_rate ?? 0),
        netPromoterScore: Number(row.netPromoterScore ?? row.net_promoter_score ?? 0),
        deltas: {
          activeUsers: index === 0 ? null : 0,
          conversionRate: index === 0 ? null : 0,
          retentionRate: index === 0 ? null : 0,
          netPromoterScore: index === 0 ? null : 0
        }
      }));
    }

    const formatted = formatter.formatSheetRows(rows);
    return formatter.buildDeltas(formatted);
  }

  async function loadData() {
    const meta = document.querySelector('meta[name="dashboard-google-sheet-url"]');
    const sheetUrl = meta && meta.content ? meta.content.trim() : '';

    let rawRows = [];
    if (sheetUrl) {
      rawRows = await fetchSheetRows(sheetUrl);
    }

    if (!rawRows.length) {
      rawRows = FALLBACK_ROWS;
      setExportStatus('Demo data loaded. Add GOOGLE_SHEETS_URL to use live data.');
    }

    state.data = prepareData(rawRows);
    state.currentIndex = 0;

    renderChart(state.data);
    updateMetrics();
  }

  async function exportToPng() {
    if (!elements.chartContainer || typeof window.htmlToImage === 'undefined') {
      setExportStatus('PNG export not supported in this browser.');
      return;
    }

    setBusy(elements.exportPng, true);
    setExportStatus('Preparing PNG export…', { persist: true });

    try {
      const dataUrl = await window.htmlToImage.toPng(elements.chartContainer, {
        cacheBust: true,
        backgroundColor: '#0f172a',
        pixelRatio: 2
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `insight-dashboard-${Date.now()}.png`;
      link.click();

      setExportStatus('PNG downloaded successfully!');
    } catch (error) {
      console.error('Failed to export PNG:', error);
      setExportStatus('PNG export failed. Try again.');
    } finally {
      setBusy(elements.exportPng, false);
    }
  }

  async function exportToPdf() {
    if (
      !elements.chartContainer ||
      typeof window.htmlToImage === 'undefined' ||
      !window.jspdf ||
      typeof window.jspdf.jsPDF !== 'function'
    ) {
      setExportStatus('PDF export not supported in this browser.');
      return;
    }

    setBusy(elements.exportPdf, true);
    setExportStatus('Preparing PDF export…', { persist: true });

    try {
      const canvas = await window.htmlToImage.toCanvas(elements.chartContainer, {
        cacheBust: true,
        backgroundColor: '#0f172a',
        pixelRatio: 2
      });

      const imgData = canvas.toDataURL('image/png');
      const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait';
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation,
        unit: 'pt',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`insight-dashboard-${Date.now()}.pdf`);

      setExportStatus('PDF downloaded successfully!');
    } catch (error) {
      console.error('Failed to export PDF:', error);
      setExportStatus('PDF export failed. Try again.');
    } finally {
      setBusy(elements.exportPdf, false);
    }
  }

  function configureExportButtons() {
    const htmlToImageAvailable = typeof window.htmlToImage !== 'undefined';
    const pdfAvailable =
      htmlToImageAvailable &&
      window.jspdf &&
      typeof window.jspdf.jsPDF === 'function';

    if (elements.exportPng) {
      elements.exportPng.disabled = !htmlToImageAvailable;
      elements.exportPng.title = htmlToImageAvailable
        ? 'Export current view as PNG'
        : 'PNG export requires html-to-image library';
      if (htmlToImageAvailable) {
        elements.exportPng.addEventListener('click', exportToPng);
      }
    }

    if (elements.exportPdf) {
      elements.exportPdf.disabled = !pdfAvailable;
      elements.exportPdf.title = pdfAvailable
        ? 'Export current view as PDF'
        : 'PDF export requires html-to-image and jsPDF';
      if (pdfAvailable) {
        elements.exportPdf.addEventListener('click', exportToPdf);
      }
    }
  }

  function attachEventListeners() {
    if (elements.playPause) {
      elements.playPause.addEventListener('click', togglePlayback);
      elements.playPause.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
          event.preventDefault();
          togglePlayback();
        }
      });
    }

    if (elements.prevButton) {
      elements.prevButton.addEventListener('click', moveToPrevious);
    }

    if (elements.nextButton) {
      elements.nextButton.addEventListener('click', moveToNext);
    }

    if (elements.range) {
      elements.range.addEventListener('input', (event) => {
        const newIndex = Number.parseInt(event.target.value, 10);
        if (!Number.isNaN(newIndex)) {
          moveToIndex(newIndex);
        }
      });
    }

    document.addEventListener('keydown', handleKeyboardControls);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopPlayback();
      }
    });
  }

  function initialize() {
    cacheElements();
    configureExportButtons();
    attachEventListeners();
    loadData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
