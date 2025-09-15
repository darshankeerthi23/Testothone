// create-summary.js
// Reads Allure 2 summary.json, posts optional Slack message, and writes email-body.txt
// Works with env-driven config; no code edits required.

const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { WebClient } = require('@slack/web-api');

// --- args & env ---
const argv = yargs(hideBin(process.argv)).argv;
const PLATFORM = argv.platform || process.env.PLATFORM || 'web';
const SLACK_TOKEN = process.env.SLACK_TOKEN || '';
const SLACK_CHANNELS = (process.env.SLACK_CHANNEL || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const repo = process.env.GITHUB_REPOSITORY || ''; // "owner/repo"
const runId = process.env.GITHUB_RUN_ID || '';
const [owner, repoName] = repo.split('/');
const defaultPages = (owner && repoName)
  ? `https://${owner}.github.io/${repoName}`
  : '';
const PAGES_BASE_URL = process.env.PAGES_BASE_URL || defaultPages;
const workflowUrl = (repo && runId)
  ? `https://github.com/${repo}/actions/runs/${runId}`
  : '';

// --- allure files ---
const reportDir = path.resolve(__dirname, 'allure-report');
const summaryFile = path.join(reportDir, 'widgets', 'summary.json');

if (!fs.existsSync(summaryFile)) {
  console.error('Allure summary file is missing. Ensure the Allure report is generated at allure-report/widgets/summary.json');
  process.exit(1);
}

const summaryData = JSON.parse(fs.readFileSync(summaryFile, 'utf-8'));

// --- extract stats (Allure 2 structure) ---
const passed = summaryData?.statistic?.passed || 0;
const failed = summaryData?.statistic?.failed || 0;
const broken = summaryData?.statistic?.broken || 0;
const skipped = summaryData?.statistic?.skipped || 0;
const total = (summaryData?.statistic?.total != null)
  ? summaryData.statistic.total
  : (passed + failed + broken + skipped);

// Duration
const duration = formatHMS(summaryData?.time?.duration || 0);
const now = formatDateTime(new Date());

// Build report link
const reportUrl = PAGES_BASE_URL || '(report URL unavailable)';

const emailBody = `
Hello,

The automation test run is complete. Here's the summary:
- Platform: ${PLATFORM}
- Total Tests: ${total}
- ✅ Passed: ${passed}
- ❌ Failed: ${failed}
- 💔 Broken: ${broken}
- ⚠️ Skipped: ${skipped}

- Duration: ${duration}

Report (${now}):
${reportUrl}

Debug this run:
${workflowUrl || '(workflow URL unavailable)'}

Best regards,
Automation Team
`.trim() + '\n';

// Optional Slack
(async () => {
  if (SLACK_TOKEN && SLACK_CHANNELS.length > 0) {
    try {
      const client = new WebClient(SLACK_TOKEN);
      for (const channel of SLACK_CHANNELS) {
        await client.chat.postMessage({ channel, text: emailBody });
        console.log(`Slack message sent to ${channel}`);
      }
    } catch (err) {
      console.error('Error sending Slack message:', err.message);
    }
  } else {
    console.log('Slack token/channel not set. Skipping Slack notification.');
  }

  fs.writeFileSync('email-body.txt', emailBody);
  console.log('email-body.txt created.');
})();

// --- helpers ---
function formatDateTime(d) {
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hh}:${mm}:${ss}`;
}
function formatHMS(ms) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':');
}
