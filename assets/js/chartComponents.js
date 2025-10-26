(function (global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    // eslint-disable-next-line no-param-reassign
    global.chartComponents = factory();
  }
})(typeof window !== 'undefined' ? window : this, function chartComponentsFactory() {
  const UGANDAN_COLORS = {
    black: '#000000',
    yellow: '#FCDC04',
    red: '#D90000',
    yellowDeep: '#E5C603',
    redDeep: '#B80000',
    slate: '#2A2A2A',
    ember: '#871111'
  };

  const CANDIDATE_COLORS = [
    UGANDAN_COLORS.yellow,
    UGANDAN_COLORS.red,
    UGANDAN_COLORS.black,
    UGANDAN_COLORS.yellowDeep,
    UGANDAN_COLORS.redDeep,
    UGANDAN_COLORS.ember,
    UGANDAN_COLORS.slate
  ];

  const ANIMATION_DURATION = 820;

  function getCandidateColor(index) {
    return CANDIDATE_COLORS[index % CANDIDATE_COLORS.length];
  }

  function normalizeHex(color) {
    if (!color) {
      return '#000000';
    }

    if (color.startsWith('#')) {
      return color.length === 7 ? color : color.slice(0, 7);
    }

    return `#${color.slice(0, 6)}`;
  }

  function withAlpha(color, alphaHex = '77') {
    const base = normalizeHex(color);
    return `${base}${alphaHex}`;
  }

  function resolveColor(item, fallbackIndex) {
    if (item && item.color) {
      return normalizeHex(item.color);
    }

    if (item && typeof item.colorIndex === 'number') {
      return normalizeHex(getCandidateColor(item.colorIndex));
    }

    return normalizeHex(getCandidateColor(fallbackIndex));
  }

  function getTicksFormatter(isPercentage) {
    return function ticksFormatter(value) {
      if (isPercentage) {
        return `${value.toFixed(1)}%`;
      }
      return Number(value).toLocaleString('en-US');
    };
  }

  function buildBarDatasetConfig(data, isPercentage, selectedCandidateIndex) {
    const baseColors = data.map((item, index) => resolveColor(item, index));
    const backgroundColor = baseColors.map((color, index) =>
      selectedCandidateIndex !== null && selectedCandidateIndex === index ? color : withAlpha(color)
    );

    return {
      label: isPercentage ? 'Vote Share (%)' : 'Vote Count',
      data: data.map((item) => item.value),
      backgroundColor,
      baseColors,
      borderColor: baseColors,
      borderWidth: data.map((_, index) => (selectedCandidateIndex === index ? 3 : 2)),
      borderRadius: 8,
      hoverBackgroundColor: baseColors,
      hoverBorderWidth: 3
    };
  }

  function buildPieDatasetConfig(data) {
    const baseColors = data.map((item, index) => resolveColor(item, index));

    return {
      label: 'Vote Share',
      data: data.map((item) => item.value),
      backgroundColor: baseColors,
      baseColors,
      borderColor: '#0f172a',
      borderWidth: 3,
      hoverOffset: 18,
      offset: data.map((item) => (item.isHighlighted ? 18 : 0))
    };
  }

  function buildLineDatasetsConfig(data, isPercentage, selectedCandidateIndex) {
    return data.map((candidate, index) => {
      const baseColor = resolveColor(candidate, index);
      const isHighlighted = selectedCandidateIndex !== null && selectedCandidateIndex === index;

      return {
        label: candidate.name,
        data: candidate.values.map((value) => value.value),
        borderColor: baseColor,
        backgroundColor: withAlpha(baseColor, '33'),
        baseColor,
        borderWidth: isHighlighted ? 3 : 2,
        tension: 0.38,
        fill: false,
        pointRadius: isHighlighted ? 6 : 4,
        pointHoverRadius: 8,
        pointBackgroundColor: baseColor,
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
        spanGaps: false,
        hidden: candidate.values.every((value) => value.value === null)
      };
    });
  }

  function createBarChart(canvas, config) {
    if (!canvas || typeof window.Chart === 'undefined') {
      return null;
    }

    const { data, isPercentage = false, onHover = null, selectedCandidateIndex = null } = config;

    const labels = data.map((item) => item.label);
    const datasetConfig = buildBarDatasetConfig(data, isPercentage, selectedCandidateIndex);

    const ctx = canvas.getContext('2d');
    const chart = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [datasetConfig]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.75,
        animation: {
          duration: ANIMATION_DURATION,
          easing: 'easeInOutQuart'
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(148, 163, 184, 0.28)',
            borderWidth: 1,
            titleColor: '#f8fafc',
            bodyColor: '#e2e8f0',
            padding: 12,
            displayColors: true,
            callbacks: {
              label(context) {
                const value = context.parsed.y;
                if (isPercentage) {
                  return `${context.dataset.label}: ${value.toFixed(2)}%`;
                }
                return `${context.dataset.label}: ${value.toLocaleString('en-US')}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#cbd5f5',
              font: {
                size: 12
              }
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.12)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#cbd5f5',
              callback: getTicksFormatter(isPercentage)
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.12)'
            },
            title: {
              display: true,
              text: isPercentage ? 'Percentage (%)' : 'Votes',
              color: '#e2e8f0'
            }
          }
        },
        onHover: (event, activeElements) => {
          if (onHover && activeElements.length > 0) {
            onHover(activeElements[0].index);
          } else if (onHover) {
            onHover(null);
          }
        }
      }
    });

    return chart;
  }

  function createPieChart(canvas, config) {
    if (!canvas || typeof window.Chart === 'undefined') {
      return null;
    }

    const { data, isPercentage = false, onHover = null, selectedCandidateIndex = null } = config;

    const labels = data.map((item) => item.label);
    const datasetConfig = buildPieDatasetConfig(
      data.map((item, index) => ({
        ...item,
        isHighlighted: selectedCandidateIndex !== null && selectedCandidateIndex === index
      }))
    );

    const ctx = canvas.getContext('2d');
    const chart = new window.Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [datasetConfig]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.45,
        animation: {
          duration: ANIMATION_DURATION,
          easing: 'easeInOutQuart',
          animateRotate: true,
          animateScale: true
        },
        interaction: {
          mode: 'nearest',
          intersect: true
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#e2e8f0',
              font: {
                family: 'Inter, sans-serif',
                size: 13
              },
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle',
              generateLabels(chartInstance) {
                const original = window.Chart.overrides.pie.plugins.legend.labels.generateLabels;
                const labelsOriginal = original.call(this, chartInstance);
                labelsOriginal.forEach((label, index) => {
                  if (selectedCandidateIndex !== null && selectedCandidateIndex === index) {
                    // eslint-disable-next-line no-param-reassign
                    label.fontStyle = 'bold';
                  }
                });
                return labelsOriginal;
              }
            },
            onHover: (event, legendItem) => {
              if (onHover) {
                onHover(legendItem.index);
              }
            },
            onLeave: () => {
              if (onHover) {
                onHover(null);
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(148, 163, 184, 0.28)',
            borderWidth: 1,
            titleColor: '#f8fafc',
            bodyColor: '#e2e8f0',
            padding: 12,
            displayColors: true,
            callbacks: {
              label(context) {
                const value = context.parsed;
                const dataset = context.dataset;
                const total = dataset.data.reduce((acc, val) => acc + val, 0);
                const percentage = total === 0 ? 0 : (value / total) * 100;

                if (isPercentage) {
                  return `${context.label}: ${value.toFixed(2)}% (${percentage.toFixed(2)}% of total)`;
                }

                return `${context.label}: ${value.toLocaleString('en-US')} (${percentage.toFixed(2)}%)`;
              }
            }
          }
        },
        onHover: (event, activeElements) => {
          if (onHover && activeElements.length > 0) {
            onHover(activeElements[0].index);
          }
        }
      }
    });

    return chart;
  }

  function createLineChart(canvas, config) {
    if (!canvas || typeof window.Chart === 'undefined') {
      return null;
    }

    const { data, isPercentage = false, onHover = null, selectedCandidateIndex = null } = config;

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const labels = data[0].values.map((item) => item.label);
    const datasets = buildLineDatasetsConfig(data, isPercentage, selectedCandidateIndex);

    const ctx = canvas.getContext('2d');
    const chart = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        animation: {
          duration: ANIMATION_DURATION,
          easing: 'easeInOutQuart'
        },
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#e2e8f0',
              font: {
                family: 'Inter, sans-serif',
                size: 13
              },
              padding: 16,
              usePointStyle: true,
              pointStyle: 'circle',
              generateLabels(chartInstance) {
                const original = window.Chart.overrides.line.plugins.legend.labels.generateLabels;
                const labelsOriginal = original.call(this, chartInstance);
                labelsOriginal.forEach((label, index) => {
                  if (selectedCandidateIndex !== null && selectedCandidateIndex === index) {
                    // eslint-disable-next-line no-param-reassign
                    label.fontStyle = 'bold';
                  }
                });
                return labelsOriginal;
              }
            },
            onHover: (event, legendItem) => {
              if (onHover) {
                onHover(legendItem.datasetIndex);
              }
            },
            onLeave: () => {
              if (onHover) {
                onHover(null);
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderColor: 'rgba(148, 163, 184, 0.28)',
            borderWidth: 1,
            titleColor: '#f8fafc',
            bodyColor: '#e2e8f0',
            padding: 12,
            displayColors: true,
            callbacks: {
              label(context) {
                const value = context.parsed.y;
                if (isPercentage) {
                  return `${context.dataset.label}: ${value.toFixed(2)}%`;
                }
                return `${context.dataset.label}: ${value.toLocaleString('en-US')}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#cbd5f5',
              font: {
                size: 12
              }
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.12)'
            },
            title: {
              display: true,
              text: 'Election Year',
              color: '#e2e8f0'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#cbd5f5',
              callback: getTicksFormatter(isPercentage)
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.12)'
            },
            title: {
              display: true,
              text: isPercentage ? 'Percentage (%)' : 'Votes',
              color: '#e2e8f0'
            }
          }
        },
        onHover: (event, activeElements) => {
          if (onHover && activeElements.length > 0) {
            onHover(activeElements[0].datasetIndex);
          }
        }
      }
    });

    return chart;
  }

  function updateBarChart(chart, data, isPercentage, options = {}) {
    if (!chart) {
      return;
    }

    const dataset = chart.data.datasets[0];
    if (!dataset) {
      return;
    }

    const { selectedCandidateIndex = null } = options;
    const labels = data.map((item) => item.label);
    const datasetConfig = buildBarDatasetConfig(data, isPercentage, selectedCandidateIndex);

    chart.data.labels = labels;
    dataset.data = datasetConfig.data;
    dataset.backgroundColor = datasetConfig.backgroundColor;
    dataset.baseColors = datasetConfig.baseColors;
    dataset.borderColor = datasetConfig.borderColor;
    dataset.borderWidth = datasetConfig.borderWidth;
    dataset.label = datasetConfig.label;
    dataset.hoverBackgroundColor = datasetConfig.hoverBackgroundColor;
    chart.options.scales.y.title.text = isPercentage ? 'Percentage (%)' : 'Votes';
    chart.options.scales.y.ticks.callback = getTicksFormatter(isPercentage);

    chart.update('active');
  }

  function updatePieChart(chart, data, isPercentage, options = {}) {
    if (!chart) {
      return;
    }

    const dataset = chart.data.datasets[0];
    if (!dataset) {
      return;
    }

    const { selectedCandidateIndex = null } = options;
    const labels = data.map((item) => item.label);
    const datasetConfig = buildPieDatasetConfig(
      data.map((item, index) => ({
        ...item,
        isHighlighted: selectedCandidateIndex !== null && selectedCandidateIndex === index
      }))
    );

    chart.data.labels = labels;
    dataset.data = datasetConfig.data;
    dataset.backgroundColor = datasetConfig.backgroundColor;
    dataset.baseColors = datasetConfig.baseColors;
    dataset.borderColor = datasetConfig.borderColor;
    dataset.borderWidth = datasetConfig.borderWidth;
    dataset.hoverOffset = datasetConfig.hoverOffset;
    dataset.offset = datasetConfig.offset;

    chart.update('active');
  }

  function updateLineChart(chart, data, isPercentage, options = {}) {
    if (!chart) {
      return;
    }

    const { selectedCandidateIndex = null } = options;
    const labels = data.length ? data[0].values.map((item) => item.label) : [];
    const datasets = buildLineDatasetsConfig(data, isPercentage, selectedCandidateIndex);

    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.options.scales.y.title.text = isPercentage ? 'Percentage (%)' : 'Votes';
    chart.options.scales.y.ticks.callback = getTicksFormatter(isPercentage);

    chart.update('active');
  }

  function highlightCandidate(chart, candidateIndex) {
    if (!chart) {
      return;
    }

    const chartType = chart.config.type;

    if (chartType === 'bar') {
      const dataset = chart.data.datasets[0];
      if (!dataset || !Array.isArray(dataset.baseColors)) {
        return;
      }

      dataset.backgroundColor = dataset.baseColors.map((color, index) =>
        candidateIndex !== null && candidateIndex === index ? color : withAlpha(color)
      );

      dataset.borderWidth = dataset.baseColors.map((_, index) =>
        candidateIndex !== null && candidateIndex === index ? 3 : 2
      );
    } else if (chartType === 'pie') {
      const dataset = chart.data.datasets[0];
      if (!dataset) {
        return;
      }

      dataset.offset = dataset.data.map((_, index) =>
        candidateIndex !== null && candidateIndex === index ? 18 : 0
      );
    } else if (chartType === 'line') {
      chart.data.datasets.forEach((dataset, index) => {
        // eslint-disable-next-line no-param-reassign
        dataset.borderWidth = candidateIndex !== null && candidateIndex === index ? 3 : 2;
        // eslint-disable-next-line no-param-reassign
        dataset.pointRadius = candidateIndex !== null && candidateIndex === index ? 6 : 4;
      });
    }

    chart.update('none');
  }

  return {
    createBarChart,
    createPieChart,
    createLineChart,
    updateBarChart,
    updatePieChart,
    updateLineChart,
    highlightCandidate,
    UGANDAN_COLORS,
    getCandidateColor
  };
});
