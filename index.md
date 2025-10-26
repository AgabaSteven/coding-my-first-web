---
layout: default
title: Insight Trends Dashboard
description: Interactive KPI dashboard with exportable visualizations and accessibility-first controls.
og_title: Insight Trends Dashboard - Export-Ready Analytics
og_description: Visualize trends, export charts as PNG/PDF, and navigate with keyboard-friendly controls.
twitter_title: Insight Trends Dashboard
twitter_description: Accessibility-first dashboard with chart exports and timeline playback.
google_sheet_url: 
---

## Insights Overview {#insights-overview}

Use this dashboard to monitor key performance indicators, track time-based trends, and export visuals for presentations. Configure your data source with a Google Sheets URL and explore with keyboard shortcuts.

### Feature Highlights

- **Export Options**: Download charts as PNG or PDF using the toolbar above each visualization.
- **Timeline Playback**: Use spacebar to pause/resume, arrow keys to scrub forward/backward.
- **Accessible Controls**: All buttons include ARIA labels and visual tooltips for assistive technologies.
- **Responsive Design**: Adapts to desktop, tablet, and mobile viewports.

---

## Interactive Visualization Area {#visualization-area}

<div class="dashboard-container">
  <div class="export-toolbar" id="export-tools" role="toolbar" aria-label="Chart export controls">
    <button 
      type="button" 
      class="export-btn export-btn--png" 
      id="export-png-btn"
      aria-label="Download current chart as PNG image"
      title="Export current view as PNG">
      <span aria-hidden="true">📷</span>
      <span class="export-btn__text">PNG</span>
    </button>
    <button 
      type="button" 
      class="export-btn export-btn--pdf" 
      id="export-pdf-btn"
      aria-label="Download current chart as PDF document"
      title="Export current view as PDF">
      <span aria-hidden="true">📄</span>
      <span class="export-btn__text">PDF</span>
    </button>
    <span class="export-status" id="export-status" role="status" aria-live="polite"></span>
  </div>
  
  <div class="chart-wrapper" id="chart-container" aria-label="Key performance metrics visualization">
    <canvas id="main-chart" role="img" aria-label="Time series chart showing trend data"></canvas>
  </div>
</div>

---

## Timeline Playback Controls {#playback}

<div class="playback" role="region" aria-labelledby="timeline-heading">
  <h2 id="timeline-heading" class="visually-hidden">Timeline controls</h2>
  <div class="playback-controls" aria-label="Timeline playback controls">
    <button 
      type="button" 
      class="playback-btn playback-btn--play" 
      id="play-pause-btn"
      aria-label="Play timeline"
      aria-pressed="false"
      title="Press space to play or pause">
      <span aria-hidden="true" id="play-pause-icon">▶️</span>
      <span class="visually-hidden" id="play-pause-text">Play timeline</span>
    </button>
    <button 
      type="button" 
      class="playback-btn playback-btn--prev" 
      id="prev-btn"
      aria-label="Previous time period"
      title="Left arrow key">
      <span aria-hidden="true">⏮</span>
      <span class="visually-hidden">Previous time period</span>
    </button>
    <button 
      type="button" 
      class="playback-btn playback-btn--next" 
      id="next-btn"
      aria-label="Next time period"
      title="Right arrow key">
      <span aria-hidden="true">⏭</span>
      <span class="visually-hidden">Next time period</span>
    </button>
    <div class="playback-info" role="status" aria-live="polite" aria-atomic="true">
      <span id="playback-status">Ready to play</span>
    </div>
  </div>

  <div class="timeline-slider">
    <label for="timeline-range" id="timeline-label">Timeline scrubber</label>
    <input 
      type="range"
      id="timeline-range"
      class="timeline-range"
      min="0"
      max="0"
      value="0"
      step="1"
      aria-labelledby="timeline-label timeline-period"
    />
    <span id="timeline-period" class="timeline-period" role="status" aria-live="polite">Initializing…</span>
  </div>

  <div class="timeline-metrics" role="group" aria-label="Metric highlights for selected period">
    <article class="metric-card" aria-labelledby="metric-users-label">
      <p id="metric-users-label" class="metric-label">Active users</p>
      <p id="metric-users-value" class="metric-value">—</p>
      <p class="metric-delta" id="metric-users-delta" aria-live="polite"></p>
    </article>
    <article class="metric-card" aria-labelledby="metric-conversion-label">
      <p id="metric-conversion-label" class="metric-label">Conversion rate</p>
      <p id="metric-conversion-value" class="metric-value">—</p>
      <p class="metric-delta" id="metric-conversion-delta" aria-live="polite"></p>
    </article>
    <article class="metric-card" aria-labelledby="metric-retention-label">
      <p id="metric-retention-label" class="metric-label">Retention</p>
      <p id="metric-retention-value" class="metric-value">—</p>
      <p class="metric-delta" id="metric-retention-delta" aria-live="polite"></p>
    </article>
    <article class="metric-card" aria-labelledby="metric-nps-label">
      <p id="metric-nps-label" class="metric-label">NPS</p>
      <p id="metric-nps-value" class="metric-value">—</p>
      <p class="metric-delta" id="metric-nps-delta" aria-live="polite"></p>
    </article>
  </div>
  <div id="timeline-announcer" class="visually-hidden" aria-live="polite" role="status"></div>
</div>

<div class="keyboard-shortcuts" role="complementary" aria-label="Keyboard shortcuts">
  <h3>Keyboard shortcuts</h3>
  <dl>
    <dt><kbd>Space</kbd></dt>
    <dd>Toggle play/pause</dd>
    <dt><kbd>←</kbd></dt>
    <dd>Previous period</dd>
    <dt><kbd>→</kbd></dt>
    <dd>Next period</dd>
  </dl>
</div>

---

## Deployment Guide {#deployment-notes}

### Prerequisites

- **Node.js** (v18+ recommended) for linting and testing scripts
- **Ruby** (v3.1+) with Bundler for Jekyll builds (optional but recommended)
- **Google Sheets API** setup or public sheet URL with columns: `Period`, `Active Users`, `Conversion Rate`, `Retention`, `NPS`

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YourOrg/insight-trends-dashboard.git
   cd insight-trends-dashboard
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **(Optional) Install Ruby gems for Jekyll builds**:
   ```bash
   bundle install
   ```

4. **Configure environment**:
   - Copy `.env.sample` to `.env` (or set variables directly in your shell).
   - Provide a published sheet or API endpoint for `GOOGLE_SHEETS_URL`.

5. **Run quality checks**:
   ```bash
   npm run lint
   npm test
   ```

6. **Start a local preview**:
   ```bash
   npm start
   # or with Jekyll
   bundle exec jekyll serve
   ```

### Build & Deploy

- **Build command**: `npm run build` (runs lint, tests, then `jekyll build`)
- **Output directory**: `_site`
- **Primary environment variables**:
  - `JEKYLL_ENV=production`
  - `GOOGLE_SHEETS_URL=https://sheets.googleapis.com/v4/spreadsheets/...`
  - `GOOGLE_SHEETS_RANGE=Dashboard!A1:E13` (optional override)

### Vercel Deployment Steps

1. Import your repository from GitHub.
2. Set environment variables (`GOOGLE_SHEETS_URL`, optional `GOOGLE_SHEETS_RANGE`).
3. Override the build command to `npm run build` and output directory to `_site`.
4. Enable **Automatically expose System Environment Variables** so `JEKYLL_ENV` is available.
5. Deploy; Vercel will re-build on each push to the default branch.

### Netlify Deployment Steps

1. Connect the repository in the Netlify dashboard.
2. Under **Site settings → Build & deploy → Build settings**, set:
   - **Build command**: `npm run build`
   - **Publish directory**: `_site`
3. Add environment variables under **Build & deploy → Environment**.
4. Trigger a deploy. Netlify CLI users can run `netlify deploy --build`.

### Google Sheets Configuration

1. Structure your data with the first row as headers.
2. Publish the sheet or use the Sheets API with a service account.
3. If using the API, create a URL using the form:
   ```
   https://sheets.googleapis.com/v4/spreadsheets/WORKBOOK_ID/values/Dashboard!A1:E20?key=YOUR_API_KEY
   ```
4. Provide the endpoint via `GOOGLE_SHEETS_URL`.
5. Ensure CORS is allowed (public sheets are easiest for quick demos).

---

## Development Workflow

### Linting & Formatting

```bash
npm run lint       # ESLint for JS
npm run lint:fix   # ESLint with auto-fix
npm run format     # Prettier formatting
```

### Testing

```bash
npm test           # Run unit tests once
npm run test:watch # Jest in watch mode
```

### Continuous Integration

Automated pipelines run linting, tests, and build verification on every pull request to prevent regressions.

---

## Election Results Visualization {#election-viz}

<section class="election-section">
  <p class="election-section__lead">
    Explore Uganda's presidential election results from 1996 through 2021. Toggle between vote totals and percentage shares, compare candidates across elections, and interact with dynamic charts featuring colors inspired by the Ugandan flag.
  </p>

  <div class="election-dashboard">
    <aside class="election-dashboard__sidebar" aria-label="Election controls and candidates">
      <div>
        <h3>Configure View</h3>
        <p>Select an election year and toggle the metric display.</p>
      </div>

      <div class="election-field">
        <label class="election-field__label" for="election-select">Election Year</label>
        <select id="election-select" class="election-select" aria-label="Select election year">
          <option>Loading elections...</option>
        </select>
      </div>

      <button 
        type="button" 
        id="metric-toggle" 
        class="metric-toggle"
        aria-pressed="false"
        aria-label="Toggle between votes and percentages">
        <span class="metric-toggle__text">
          <span class="metric-toggle__label">Display Mode</span>
          <span id="metric-toggle-label" class="metric-toggle__value">Votes</span>
        </span>
        <span class="metric-toggle__indicator">
          <span class="metric-toggle__knob"></span>
        </span>
      </button>

      <div class="candidate-list__heading">
        <h4>Candidates</h4>
        <p>Click or hover to highlight</p>
      </div>

      <ul id="candidate-list" class="candidate-list" role="list" aria-label="Candidate results">
      </ul>

      <div id="visual-status" class="visual-status" role="status" aria-live="polite" aria-atomic="true"></div>
    </aside>

    <div class="election-dashboard__charts">
      <div class="chart-grid">
        <article class="chart-card">
          <header class="chart-card__header">
            <h3 class="chart-card__title">Bar Chart</h3>
            <span class="chart-card__meta" aria-hidden="true">📊</span>
          </header>
          <p class="chart-card__description">Compare vote totals or percentages side by side</p>
          <div class="chart-card__body">
            <canvas id="election-bar-chart" role="img" aria-label="Bar chart showing election results"></canvas>
          </div>
        </article>

        <article class="chart-card">
          <header class="chart-card__header">
            <h3 class="chart-card__title">Pie Chart</h3>
            <span class="chart-card__meta" aria-hidden="true">🥧</span>
          </header>
          <p class="chart-card__description">Visualize vote share distribution</p>
          <div class="chart-card__body chart-card__body--square">
            <canvas id="election-pie-chart" role="img" aria-label="Pie chart showing vote distribution"></canvas>
          </div>
        </article>

        <article class="chart-card chart-card--wide">
          <header class="chart-card__header">
            <h3 class="chart-card__title">Trend Line Chart</h3>
            <span class="chart-card__meta" aria-hidden="true">📈</span>
          </header>
          <p class="chart-card__description">Track candidate performance across multiple elections</p>
          <div class="chart-card__body chart-card__body--wide">
            <canvas id="election-line-chart" role="img" aria-label="Line chart showing voting trends over time"></canvas>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Implement the change and add tests.
4. Run `npm run lint` and `npm test`.
5. Submit a pull request with a detailed summary.

---

## License

This project is open-source and available under the MIT License.
