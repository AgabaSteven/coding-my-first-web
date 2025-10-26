(function setupElectionVisualization() {
  const RAW_ELECTIONS = Object.freeze([
    {
      id: '1996',
      year: '1996',
      label: '1996 General Election',
      candidates: [
        { id: 'museveni', name: 'Yoweri Museveni', party: 'NRM', votes: 4428119 },
        { id: 'ssemogerere', name: 'Paul Ssemogerere', party: 'DP', votes: 1416139 },
        { id: 'mayanja', name: 'Kibirige Mayanja', party: 'UMA', votes: 123290 }
      ]
    },
    {
      id: '2001',
      year: '2001',
      label: '2001 General Election',
      candidates: [
        { id: 'museveni', name: 'Yoweri Museveni', party: 'NRM', votes: 5123360 },
        { id: 'besigye', name: 'Kizza Besigye', party: 'FDC', votes: 2055795 },
        { id: 'awori', name: 'Aggrey Awori', party: 'Independent', votes: 103915 },
        { id: 'bwengye', name: 'Francis Bwengye', party: 'Independent', votes: 22751 },
        { id: 'chapaa', name: 'Karuhanga Chapaa', party: 'Independent', votes: 8046 }
      ]
    },
    {
      id: '2006',
      year: '2006',
      label: '2006 General Election',
      candidates: [
        { id: 'museveni', name: 'Yoweri Museveni', party: 'NRM', votes: 4078911 },
        { id: 'besigye', name: 'Kizza Besigye', party: 'FDC', votes: 2570603 },
        { id: 'ssebana', name: 'John Ssebana Kizito', party: 'DP', votes: 109583 },
        { id: 'bwanika', name: 'Abed Bwanika', party: 'Independent', votes: 65874 },
        { id: 'obote', name: 'Miria Obote', party: 'UPC', votes: 57071 }
      ]
    },
    {
      id: '2011',
      year: '2011',
      label: '2011 General Election',
      candidates: [
        { id: 'museveni', name: 'Yoweri Museveni', party: 'NRM', votes: 5428369 },
        { id: 'besigye', name: 'Kizza Besigye', party: 'FDC', votes: 2064963 },
        { id: 'mao', name: 'Norbert Mao', party: 'DP', votes: 147917 },
        { id: 'otunnu', name: 'Olara Otunnu', party: 'UPC', votes: 125059 },
        { id: 'bwanika', name: 'Abed Bwanika', party: 'PDP', votes: 51186 }
      ]
    },
    {
      id: '2016',
      year: '2016',
      label: '2016 General Election',
      candidates: [
        { id: 'museveni', name: 'Yoweri Museveni', party: 'NRM', votes: 5971872 },
        { id: 'besigye', name: 'Kizza Besigye', party: 'FDC', votes: 3508687 },
        { id: 'mbabazi', name: 'Amama Mbabazi', party: 'Independent', votes: 132574 },
        { id: 'bwanika', name: 'Abed Bwanika', party: 'PPP', votes: 89005 },
        { id: 'biraaro', name: 'Benon Biraaro', party: 'Independent', votes: 24675 }
      ]
    },
    {
      id: '2021',
      year: '2021',
      label: '2021 General Election',
      candidates: [
        { id: 'museveni', name: 'Yoweri Museveni', party: 'NRM', votes: 6042898 },
        { id: 'kyagulanyi', name: 'Robert Kyagulanyi', party: 'NUP', votes: 3631437 },
        { id: 'amuriat', name: 'Patrick Amuriat', party: 'FDC', votes: 337589 },
        { id: 'mao', name: 'Norbert Mao', party: 'DP', votes: 57682 },
        { id: 'tumukunde', name: 'Henry Tumukunde', party: 'Independent', votes: 51392 }
      ]
    }
  ]);

  const ELEMENT_IDS = {
    electionSelect: 'election-select',
    metricToggle: 'metric-toggle',
    metricLabel: 'metric-toggle-label',
    barCanvas: 'election-bar-chart',
    pieCanvas: 'election-pie-chart',
    lineCanvas: 'election-line-chart',
    candidateList: 'candidate-list',
    visualStatus: 'visual-status'
  };

  const state = {
    elections: [],
    candidateColorMap: new Map(),
    charts: {
      bar: null,
      pie: null,
      line: null
    },
    selectedElectionIndex: 0,
    metric: 'votes',
    hoveredCandidate: null,
    selectedCandidate: null
  };

  const elements = {};

  function cacheElements() {
    Object.entries(ELEMENT_IDS).forEach(([key, id]) => {
      elements[key] = document.getElementById(id);
    });
  }

  function getChartComponents() {
    return typeof window !== 'undefined' ? window.chartComponents : undefined;
  }

  function setVisualStatus(message, { persist = false } = {}) {
    if (!elements.visualStatus || !message) {
      return;
    }

    elements.visualStatus.textContent = message;

    if (!persist) {
      window.setTimeout(() => {
        if (elements.visualStatus && elements.visualStatus.textContent === message) {
          elements.visualStatus.textContent = '';
        }
      }, 3200);
    }
  }

  function enrichElectionData(rawElections) {
    const colorMap = new Map();
    let colorIndex = 0;

    const enriched = rawElections.map((election) => {
      const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

      const candidates = election.candidates.map((candidate) => {
        if (!colorMap.has(candidate.name)) {
          colorMap.set(candidate.name, colorIndex);
          colorIndex += 1;
        }

        const assignedIndex = colorMap.get(candidate.name);
        const percentage = totalVotes === 0 ? 0 : (candidate.votes / totalVotes) * 100;

        return {
          ...candidate,
          percentage,
          colorIndex: assignedIndex,
          totalVotes
        };
      });

      return {
        ...election,
        totalVotes,
        candidates
      };
    });

    return { elections: enriched, colorMap };
  }

  function getActiveCandidate() {
    return state.hoveredCandidate || state.selectedCandidate || null;
  }

  function getLineHighlightIndex(activeCandidate) {
    if (!activeCandidate) {
      return null;
    }

    if (!state.candidateColorMap.has(activeCandidate.name)) {
      return null;
    }

    return state.candidateColorMap.get(activeCandidate.name);
  }

  function buildBarData() {
    const election = state.elections[state.selectedElectionIndex];
    if (!election) {
      return [];
    }

    const metricKey = state.metric === 'percentage' ? 'percentage' : 'votes';

    return election.candidates.map((candidate) => ({
      label: candidate.name,
      value: candidate[metricKey],
      party: candidate.party,
      colorIndex: candidate.colorIndex
    }));
  }

  function buildPieData() {
    return buildBarData();
  }

  function buildLineData() {
    const metricKey = state.metric === 'percentage' ? 'percentage' : 'votes';

    return Array.from(state.candidateColorMap.entries()).map(([name, colorIndex]) => ({
      name,
      colorIndex,
      values: state.elections.map((election) => {
        const candidate = election.candidates.find((entry) => entry.name === name);
        return {
          label: election.year,
          value: candidate ? candidate[metricKey] : null
        };
      })
    }));
  }

  function highlightCandidateInList(candidateIndex) {
    if (!elements.candidateList) {
      return;
    }

    const buttons = elements.candidateList.querySelectorAll('.candidate-button');
    buttons.forEach((button, index) => {
      if (candidateIndex !== null && candidateIndex === index) {
        button.classList.add('candidate-button--active');
        button.setAttribute('aria-pressed', 'true');
      } else {
        button.classList.remove('candidate-button--active');
        button.setAttribute('aria-pressed', 'false');
      }
    });
  }

  function applyActiveCandidateHighlight() {
    const chartLib = getChartComponents();
    const active = getActiveCandidate();
    const candidateIndex = active ? active.index : null;
    const lineIndex = getLineHighlightIndex(active);

    highlightCandidateInList(candidateIndex);

    if (!chartLib) {
      return;
    }

    if (state.charts.bar) {
      chartLib.highlightCandidate(state.charts.bar, candidateIndex);
    }

    if (state.charts.pie) {
      chartLib.highlightCandidate(state.charts.pie, candidateIndex);
    }

    if (state.charts.line) {
      chartLib.highlightCandidate(state.charts.line, lineIndex);
    }
  }

  function handleCandidateInteraction(candidate, index, interactionType) {
    if (!candidate) {
      return;
    }

    if (interactionType === 'hover') {
      state.hoveredCandidate = { name: candidate.name, index };
      setVisualStatus(`Highlighting ${candidate.name}`);
    } else if (interactionType === 'leave') {
      state.hoveredCandidate = null;
    } else if (interactionType === 'select') {
      if (state.selectedCandidate && state.selectedCandidate.name === candidate.name) {
        state.selectedCandidate = null;
        setVisualStatus('Cleared candidate selection');
      } else {
        state.selectedCandidate = { name: candidate.name, index };
        setVisualStatus(`Selected ${candidate.name}`);
      }
    }

    applyActiveCandidateHighlight();
  }

  function renderCandidateList() {
    const election = state.elections[state.selectedElectionIndex];
    if (!elements.candidateList || !election) {
      return;
    }

    const chartLib = getChartComponents();
    elements.candidateList.innerHTML = '';

    election.candidates.forEach((candidate, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'candidate-list__item';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'candidate-button';
      button.dataset.index = index;
      button.dataset.name = candidate.name;
      button.setAttribute('aria-pressed', 'false');

      const colorSwatch = document.createElement('span');
      colorSwatch.className = 'candidate-color';
      colorSwatch.style.backgroundColor = chartLib
        ? chartLib.getCandidateColor(candidate.colorIndex)
        : '#EAB308';
      colorSwatch.setAttribute('aria-hidden', 'true');

      const textWrapper = document.createElement('span');
      textWrapper.className = 'candidate-labels';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'candidate-name';
      nameSpan.textContent = candidate.name;

      const partySpan = document.createElement('span');
      partySpan.className = 'candidate-party';
      partySpan.textContent = candidate.party;

      const valueSpan = document.createElement('span');
      valueSpan.className = 'candidate-value';
      valueSpan.textContent = state.metric === 'percentage'
        ? `${candidate.percentage.toFixed(2)}%`
        : candidate.votes.toLocaleString('en-US');

      textWrapper.appendChild(nameSpan);
      textWrapper.appendChild(partySpan);

      button.appendChild(colorSwatch);
      button.appendChild(textWrapper);
      button.appendChild(valueSpan);

      button.addEventListener('click', () => handleCandidateInteraction(candidate, index, 'select'));
      button.addEventListener('mouseenter', () => handleCandidateInteraction(candidate, index, 'hover'));
      button.addEventListener('mouseleave', () => handleCandidateInteraction(candidate, index, 'leave'));
      button.addEventListener('focus', () => handleCandidateInteraction(candidate, index, 'hover'));
      button.addEventListener('blur', () => handleCandidateInteraction(candidate, index, 'leave'));

      listItem.appendChild(button);
      elements.candidateList.appendChild(listItem);
    });

    applyActiveCandidateHighlight();
  }

  function updateCandidateListValues() {
    if (!elements.candidateList) {
      return;
    }

    const election = state.elections[state.selectedElectionIndex];
    if (!election) {
      return;
    }

    const buttons = elements.candidateList.querySelectorAll('.candidate-button');
    buttons.forEach((button) => {
      const index = Number.parseInt(button.dataset.index, 10);
      const candidate = election.candidates[index];
      if (!candidate) {
        return;
      }

      const valueSpan = button.querySelector('.candidate-value');
      if (!valueSpan) {
        return;
      }

      if (state.metric === 'percentage') {
        valueSpan.textContent = `${candidate.percentage.toFixed(2)}%`;
      } else {
        valueSpan.textContent = candidate.votes.toLocaleString('en-US');
      }
    });
  }

  function destroyChart(type) {
    if (state.charts[type]) {
      state.charts[type].destroy();
      state.charts[type] = null;
    }
  }

  function renderCharts({ reinitialize = false } = {}) {
    const chartLib = getChartComponents();
    if (!chartLib) {
      return;
    }

    const active = getActiveCandidate();
    const candidateIndex = active ? active.index : null;
    const lineIndex = getLineHighlightIndex(active);
    const isPercentageMode = state.metric === 'percentage';

    const barData = buildBarData();
    if (!state.charts.bar || reinitialize) {
      destroyChart('bar');
      if (elements.barCanvas) {
        state.charts.bar = chartLib.createBarChart(elements.barCanvas, {
          data: barData,
          isPercentage: isPercentageMode,
          selectedCandidateIndex: candidateIndex,
          onHover: (index) => {
            const election = state.elections[state.selectedElectionIndex];
            const candidate = election ? election.candidates[index] : null;
            if (candidate && index !== undefined && index !== null) {
              state.hoveredCandidate = { name: candidate.name, index };
            } else {
              state.hoveredCandidate = null;
            }
            applyActiveCandidateHighlight();
          }
        });
      }
    } else {
      chartLib.updateBarChart(state.charts.bar, barData, isPercentageMode, {
        selectedCandidateIndex: candidateIndex
      });
    }

    const pieData = buildPieData();
    if (!state.charts.pie || reinitialize) {
      destroyChart('pie');
      if (elements.pieCanvas) {
        state.charts.pie = chartLib.createPieChart(elements.pieCanvas, {
          data: pieData,
          isPercentage: isPercentageMode,
          selectedCandidateIndex: candidateIndex,
          onHover: (index) => {
            const election = state.elections[state.selectedElectionIndex];
            const candidate = election ? election.candidates[index] : null;
            if (candidate && index !== undefined && index !== null) {
              state.hoveredCandidate = { name: candidate.name, index };
            } else {
              state.hoveredCandidate = null;
            }
            applyActiveCandidateHighlight();
          }
        });
      }
    } else {
      chartLib.updatePieChart(state.charts.pie, pieData, isPercentageMode, {
        selectedCandidateIndex: candidateIndex
      });
    }

    const lineData = buildLineData();
    if (!state.charts.line || reinitialize) {
      destroyChart('line');
      if (elements.lineCanvas) {
        state.charts.line = chartLib.createLineChart(elements.lineCanvas, {
          data: lineData,
          isPercentage: isPercentageMode,
          selectedCandidateIndex: lineIndex,
          onHover: (datasetIndex) => {
            if (datasetIndex === undefined || datasetIndex === null) {
              state.hoveredCandidate = null;
              applyActiveCandidateHighlight();
              return;
            }

            const entry = Array.from(state.candidateColorMap.entries()).find(
              ([, indexValue]) => indexValue === datasetIndex
            );
            if (!entry) {
              state.hoveredCandidate = null;
              applyActiveCandidateHighlight();
              return;
            }

            const [name] = entry;
            const election = state.elections[state.selectedElectionIndex];
            const candidateIndexForElection = election
              ? election.candidates.findIndex((candidate) => candidate.name === name)
              : -1;

            if (candidateIndexForElection >= 0) {
              state.hoveredCandidate = { name, index: candidateIndexForElection };
            } else {
              state.hoveredCandidate = { name, index: null };
            }
            applyActiveCandidateHighlight();
          }
        });
      }
    } else {
      chartLib.updateLineChart(state.charts.line, lineData, isPercentageMode, {
        selectedCandidateIndex: lineIndex
      });
    }
  }

  function populateElectionSelect() {
    if (!elements.electionSelect) {
      return;
    }

    elements.electionSelect.innerHTML = '';
    state.elections.forEach((election, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${election.year}`;
      if (index === state.selectedElectionIndex) {
        option.selected = true;
      }
      elements.electionSelect.appendChild(option);
    });
  }

  function updateMetricLabel() {
    if (elements.metricLabel) {
      elements.metricLabel.textContent = state.metric === 'percentage' ? 'Percentages' : 'Votes';
    }
  }

  function handleMetricToggle() {
    state.metric = state.metric === 'percentage' ? 'votes' : 'percentage';

    if (elements.metricToggle) {
      elements.metricToggle.setAttribute('aria-pressed', state.metric === 'percentage' ? 'true' : 'false');
      elements.metricToggle.classList.toggle('metric-toggle--active', state.metric === 'percentage');
    }

    updateMetricLabel();
    updateCandidateListValues();
    renderCharts();

    const election = state.elections[state.selectedElectionIndex];
    const modeLabel = state.metric === 'percentage' ? 'percentage share' : 'vote totals';
    setVisualStatus(`Switched to ${modeLabel} for ${election.label}`);
  }

  function handleElectionChange(event) {
    const newIndex = Number.parseInt(event.target.value, 10);
    if (Number.isNaN(newIndex) || newIndex === state.selectedElectionIndex) {
      return;
    }

    state.selectedElectionIndex = newIndex;
    state.selectedCandidate = null;
    state.hoveredCandidate = null;

    renderCandidateList();
    updateCandidateListValues();
    renderCharts();

    const election = state.elections[state.selectedElectionIndex];
    setVisualStatus(`Loaded ${election.label}`);
  }

  function attachEventListeners() {
    if (elements.metricToggle) {
      elements.metricToggle.addEventListener('click', handleMetricToggle);
    }

    if (elements.electionSelect) {
      elements.electionSelect.addEventListener('change', handleElectionChange);
    }
  }

  function initialize() {
    cacheElements();

    const chartLib = getChartComponents();
    if (!chartLib) {
      return;
    }

    const { elections, colorMap } = enrichElectionData(RAW_ELECTIONS);
    state.elections = elections;
    state.candidateColorMap = colorMap;
    state.selectedElectionIndex = elections.length - 1;

    populateElectionSelect();
    updateMetricLabel();
    renderCandidateList();
    renderCharts({ reinitialize: true });
    attachEventListeners();

    const latestElection = state.elections[state.selectedElectionIndex];
    setVisualStatus(`Visualising ${latestElection.label}`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
