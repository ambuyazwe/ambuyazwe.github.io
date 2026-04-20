// Polls git for new commits on master and pulls them automatically.
// Runs in the background alongside the Astro dev server.
const { execSync } = require('child_process');

const INTERVAL = 10000; // check every 10 seconds

function pull() {
  try {
    const result = execSync('git pull --ff-only', { encoding: 'utf-8', timeout: 10000 });
    if (!result.includes('Already up to date')) {
      console.log('[sync] Pulled new changes');
    }
  } catch (e) {
    // Silently ignore errors (offline, merge conflicts, etc.)
  }
}

console.log('[sync] Watching for CMS changes every 10s...');
setInterval(pull, INTERVAL);
