const ACCOUNTS_KEY = 'savings-tracker-accounts';
const ACTIVE_KEY = 'savings-tracker-active-account';

// --- Backdrop Choices ---

const BACKDROPS = [
  { id: 'bd-mist',      name: 'Mist',      swatch: '#f0f4f8' },
  { id: 'bd-lavender',  name: 'Lavender',  swatch: 'linear-gradient(135deg, #c7d2fe, #e9d5ff)' },
  { id: 'bd-sunset',    name: 'Sunset',    swatch: 'linear-gradient(135deg, #fde68a, #fca5a5, #c4b5fd)' },
  { id: 'bd-ocean',     name: 'Ocean',     swatch: 'linear-gradient(135deg, #a5f3fc, #6ee7b7)' },
  { id: 'bd-rose',      name: 'Rose',      swatch: 'linear-gradient(135deg, #ffe4e6, #fecdd3)' },
  { id: 'bd-forest',    name: 'Forest',    swatch: 'linear-gradient(135deg, #a7f3d0, #6ee7b7)' },
  { id: 'bd-slate',     name: 'Slate',     swatch: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' },
  { id: 'bd-midnight',  name: 'Midnight',  swatch: 'linear-gradient(135deg, #1e293b, #334155)' },
  { id: 'bd-aurora',    name: 'Aurora',    swatch: 'linear-gradient(135deg, #a78bfa, #06b6d4, #34d399)' },
  { id: 'bd-peach',     name: 'Peach',     swatch: 'linear-gradient(135deg, #fed7aa, #fca5a5)' },
  { id: 'bd-storm',     name: 'Storm',     swatch: 'linear-gradient(135deg, #475569, #64748b, #475569)' },
  { id: 'bd-candy',     name: 'Candy',     swatch: 'linear-gradient(135deg, #f9a8d4, #c084fc, #818cf8)' },
  { id: 'bd-sahara',    name: 'Sahara',    swatch: 'linear-gradient(135deg, #fde68a, #d97706, #92400e)' },
  { id: 'bd-arctic',    name: 'Arctic',    swatch: 'linear-gradient(135deg, #e0f2fe, #bae6fd, #7dd3fc)' },
  { id: 'bd-berry',     name: 'Berry',     swatch: 'linear-gradient(135deg, #831843, #be185d, #e11d48)' },
  { id: 'bd-moss',      name: 'Moss',      swatch: 'linear-gradient(135deg, #365314, #4d7c0f, #65a30d)' },
];

function getAccountBackdrop() {
  return getActiveAccount().backdrop || 'bd-mist';
}

function setAccountBackdrop(backdropId) {
  const accounts = loadAccounts();
  const account = accounts.find(a => a.id === getActiveAccount().id);
  if (account) {
    account.backdrop = backdropId;
    saveAccounts(accounts);
  }
}

function applyBackdrop(id) {
  BACKDROPS.forEach(b => document.body.classList.remove(b.id));
  document.body.classList.add(id);
}

function renderBackdropPicker() {
  const container = document.getElementById('backdrop-picker');
  const current = getAccountBackdrop();

  container.innerHTML = BACKDROPS.map(b =>
    `<button
      class="backdrop-swatch ${b.id === current ? 'active' : ''}"
      data-backdrop="${b.id}"
      title="${b.name}"
      style="background: ${b.swatch};"
    ></button>`
  ).join('');
}

document.getElementById('backdrop-picker').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-backdrop]');
  if (!btn) return;
  const id = btn.dataset.backdrop;
  setAccountBackdrop(id);
  applyBackdrop(id);
  document.querySelectorAll('.backdrop-swatch').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
});

// --- Font Choices ---

const FONTS = [
  { id: 'font-system',      name: 'System',      preview: 'Aa' },
  { id: 'font-inter',       name: 'Inter',       preview: 'Aa' },
  { id: 'font-nunito',      name: 'Nunito',      preview: 'Aa' },
  { id: 'font-quicksand',   name: 'Quicksand',   preview: 'Aa' },
  { id: 'font-merriweather', name: 'Merriweather', preview: 'Aa' },
  { id: 'font-playfair',    name: 'Playfair',    preview: 'Aa' },
  { id: 'font-mono',        name: 'Mono',        preview: 'Aa' },
];

const FONT_FAMILIES = {
  'font-system':      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  'font-inter':       "'Inter', sans-serif",
  'font-nunito':      "'Nunito', sans-serif",
  'font-quicksand':   "'Quicksand', sans-serif",
  'font-merriweather': "'Merriweather', Georgia, serif",
  'font-playfair':    "'Playfair Display', Georgia, serif",
  'font-mono':        "'Space Mono', 'Courier New', monospace",
};

function getAccountFont() {
  return getActiveAccount().font || 'font-system';
}

function setAccountFont(fontId) {
  const accounts = loadAccounts();
  const account = accounts.find(a => a.id === getActiveAccount().id);
  if (account) {
    account.font = fontId;
    saveAccounts(accounts);
  }
}

function applyFont(id) {
  FONTS.forEach(f => document.body.classList.remove(f.id));
  document.body.classList.add(id);
}

function renderFontPicker() {
  const container = document.getElementById('font-picker');
  const current = getAccountFont();

  container.innerHTML = FONTS.map(f =>
    `<button class="font-btn ${f.id === current ? 'active' : ''}" data-font="${f.id}" title="${f.name}" style="font-family: ${FONT_FAMILIES[f.id]};">
      ${f.name}
    </button>`
  ).join('');
}

document.getElementById('font-picker').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-font]');
  if (!btn) return;
  const id = btn.dataset.font;
  setAccountFont(id);
  applyFont(id);
  document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});

// --- Account Storage ---

function loadAccounts() {
  const data = localStorage.getItem(ACCOUNTS_KEY);
  if (data) return JSON.parse(data);

  // Migrate from old single-account format
  const oldGoals = localStorage.getItem('savings-tracker-goals');
  if (oldGoals) {
    const defaultAccount = {
      id: generateId(),
      name: 'My Account',
      goals: JSON.parse(oldGoals),
    };
    const accounts = [defaultAccount];
    saveAccounts(accounts);
    setActiveAccountId(defaultAccount.id);
    localStorage.removeItem('savings-tracker-goals');
    return accounts;
  }

  // First-time setup
  const starter = { id: generateId(), name: 'My Account', goals: [] };
  saveAccounts([starter]);
  setActiveAccountId(starter.id);
  return [starter];
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function getActiveAccountId() {
  return localStorage.getItem(ACTIVE_KEY);
}

function setActiveAccountId(id) {
  localStorage.setItem(ACTIVE_KEY, id);
}

function getActiveAccount() {
  const accounts = loadAccounts();
  const id = getActiveAccountId();
  return accounts.find(a => a.id === id) || accounts[0];
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// --- Helpers ---

function formatMoney(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getTotalSaved(goal) {
  return goal.contributions.reduce((sum, c) => sum + c.amount, 0);
}

function getPercentage(goal) {
  const saved = getTotalSaved(goal);
  return Math.min(Math.round((saved / goal.target) * 100), 100);
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// --- Account UI ---

function renderAccountSelect() {
  const select = document.getElementById('account-select');
  const accounts = loadAccounts();
  const activeId = getActiveAccount().id;

  select.innerHTML = accounts.map(a =>
    `<option value="${a.id}" ${a.id === activeId ? 'selected' : ''}>${escapeHtml(a.name)}</option>`
  ).join('');
}

function renderSummary() {
  const container = document.getElementById('account-summary');
  const account = getActiveAccount();
  const goals = account.goals;

  if (goals.length === 0) {
    container.innerHTML = '';
    return;
  }

  const totalSaved = goals.reduce((sum, g) => sum + getTotalSaved(g), 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const goalsComplete = goals.filter(g => getTotalSaved(g) >= g.target).length;

  container.innerHTML = `
    <div class="summary-card">
      <div class="summary-label">Total Saved</div>
      <div class="summary-value green">${formatMoney(totalSaved)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Total Target</div>
      <div class="summary-value indigo">${formatMoney(totalTarget)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Goals Met</div>
      <div class="summary-value">${goalsComplete} / ${goals.length}</div>
    </div>
  `;
}

document.getElementById('account-select').addEventListener('change', (e) => {
  setActiveAccountId(e.target.value);
  renderAll();
});

document.getElementById('new-account-btn').addEventListener('click', () => {
  const name = prompt('Account name:');
  if (!name || !name.trim()) return;

  const accounts = loadAccounts();
  const newAccount = { id: generateId(), name: name.trim(), goals: [] };
  accounts.push(newAccount);
  saveAccounts(accounts);
  setActiveAccountId(newAccount.id);
  renderAll();
});

document.getElementById('rename-account-btn').addEventListener('click', () => {
  const account = getActiveAccount();
  const name = prompt('Rename account:', account.name);
  if (!name || !name.trim()) return;

  const accounts = loadAccounts();
  const target = accounts.find(a => a.id === account.id);
  if (target) {
    target.name = name.trim();
    saveAccounts(accounts);
    renderAccountSelect();
  }
});

document.getElementById('delete-account-btn').addEventListener('click', () => {
  const accounts = loadAccounts();
  if (accounts.length <= 1) {
    alert('You must have at least one account.');
    return;
  }
  const account = getActiveAccount();
  if (!confirm(`Delete "${account.name}" and all its goals?`)) return;

  const remaining = accounts.filter(a => a.id !== account.id);
  saveAccounts(remaining);
  setActiveAccountId(remaining[0].id);
  renderAll();
});

// --- Goals Rendering ---

function renderGoals() {
  const container = document.getElementById('goals-container');
  const account = getActiveAccount();
  const goals = account.goals;

  if (goals.length === 0) {
    container.innerHTML = '<p class="empty-state">No goals yet. Add one above to get started!</p>';
    return;
  }

  container.innerHTML = goals.map(goal => {
    const saved = getTotalSaved(goal);
    const pct = getPercentage(goal);
    const isComplete = saved >= goal.target;
    const days = daysUntil(goal.targetDate);

    let dateLabel = '';
    if (goal.targetDate) {
      if (days !== null && days > 0) {
        dateLabel = `${formatDate(goal.targetDate)} (${days} day${days !== 1 ? 's' : ''} left)`;
      } else if (days === 0) {
        dateLabel = `${formatDate(goal.targetDate)} (Today!)`;
      } else {
        dateLabel = `${formatDate(goal.targetDate)} (Past due)`;
      }
    }

    const remaining = goal.target - saved;
    let perWeekHtml = '';
    if (!isComplete && days !== null && days > 0) {
      const weeksLeft = days / 7;
      const perWeek = remaining / weeksLeft;
      perWeekHtml = `<div class="goal-per-week">${formatMoney(perWeek)}/week to stay on track</div>`;
    } else if (!isComplete && days !== null && days <= 0 && remaining > 0) {
      perWeekHtml = `<div class="goal-per-week overdue">${formatMoney(remaining)} still needed (past due)</div>`;
    }

    return `
      <div class="goal-card" data-id="${goal.id}">
        <div class="goal-header">
          <div>
            <div class="goal-name">${escapeHtml(goal.name)}</div>
            ${dateLabel ? `<div class="goal-date">${dateLabel}</div>` : ''}
          </div>
          <div class="goal-header-actions">
            <button class="btn btn-small btn-add" onclick="openContributionModal('${goal.id}')">+ Add</button>
            <button class="btn btn-delete" onclick="deleteGoal('${goal.id}')" title="Delete goal">&times;</button>
          </div>
        </div>
        <div class="goal-amounts">
          <span class="goal-saved">${formatMoney(saved)}</span>
          <span class="goal-target">of ${formatMoney(goal.target)}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${isComplete ? 'complete' : ''}" style="width: ${pct}%"></div>
        </div>
        <div class="goal-footer">
          <span class="goal-percent">${pct}%</span>
          ${isComplete ? '<span class="goal-complete-badge">Goal reached!</span>' : `<span class="goal-percent">${formatMoney(remaining)} to go</span>`}
        </div>
        ${perWeekHtml}
      </div>
    `;
  }).join('');
}

// --- Goal CRUD ---

document.getElementById('goal-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.getElementById('goal-name');
  const targetInput = document.getElementById('goal-target');
  const dateInput = document.getElementById('goal-date');

  const goal = {
    id: generateId(),
    name: nameInput.value.trim(),
    target: parseFloat(targetInput.value),
    targetDate: dateInput.value || null,
    contributions: [],
    createdAt: new Date().toISOString(),
  };

  const accounts = loadAccounts();
  const account = accounts.find(a => a.id === getActiveAccount().id);
  account.goals.push(goal);
  saveAccounts(accounts);

  nameInput.value = '';
  targetInput.value = '';
  dateInput.value = '';
  nameInput.focus();

  renderGoals();
  renderSummary();
});

function deleteGoal(id) {
  if (!confirm('Delete this goal and all its contributions?')) return;
  const accounts = loadAccounts();
  const account = accounts.find(a => a.id === getActiveAccount().id);
  account.goals = account.goals.filter(g => g.id !== id);
  saveAccounts(accounts);
  renderGoals();
  renderSummary();
}

// --- Contribution Modal ---

function openContributionModal(goalId) {
  const account = getActiveAccount();
  const goal = account.goals.find(g => g.id === goalId);
  if (!goal) return;

  document.getElementById('contribution-goal-id').value = goalId;
  document.getElementById('modal-title').textContent = `Add to "${goal.name}"`;
  document.getElementById('contribution-amount').value = '';
  document.getElementById('contribution-note').value = '';

  renderHistory(goal);

  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('contribution-amount').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

document.getElementById('modal-close').addEventListener('click', closeModal);

document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

document.getElementById('contribution-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const goalId = document.getElementById('contribution-goal-id').value;
  const amount = parseFloat(document.getElementById('contribution-amount').value);
  const note = document.getElementById('contribution-note').value.trim();

  const accounts = loadAccounts();
  const account = accounts.find(a => a.id === getActiveAccount().id);
  const goal = account.goals.find(g => g.id === goalId);
  if (!goal) return;

  goal.contributions.push({
    id: generateId(),
    amount,
    note: note || null,
    date: new Date().toISOString(),
  });

  saveAccounts(accounts);
  renderGoals();
  renderSummary();

  document.getElementById('contribution-amount').value = '';
  document.getElementById('contribution-note').value = '';
  document.getElementById('contribution-amount').focus();

  renderHistory(goal);
});

function renderHistory(goal) {
  const list = document.getElementById('history-list');

  if (goal.contributions.length === 0) {
    list.innerHTML = '<li class="history-empty">No contributions yet</li>';
    return;
  }

  const sorted = [...goal.contributions].sort((a, b) => new Date(b.date) - new Date(a.date));

  list.innerHTML = sorted.map(c => `
    <li>
      <div>
        <span class="history-amount">+${formatMoney(c.amount)}</span>
        ${c.note ? `<span class="history-note"> &mdash; ${escapeHtml(c.note)}</span>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:0.35rem;">
        <span class="history-date">${formatDate(c.date)}</span>
        <button class="history-delete" onclick="deleteContribution('${goal.id}','${c.id}')" title="Remove">&times;</button>
      </div>
    </li>
  `).join('');
}

function deleteContribution(goalId, contributionId) {
  const accounts = loadAccounts();
  const account = accounts.find(a => a.id === getActiveAccount().id);
  const goal = account.goals.find(g => g.id === goalId);
  if (!goal) return;

  goal.contributions = goal.contributions.filter(c => c.id !== contributionId);
  saveAccounts(accounts);
  renderGoals();
  renderSummary();
  renderHistory(goal);
}

// --- Export / Import ---

document.getElementById('export-btn').addEventListener('click', () => {
  const data = {
    accounts: loadAccounts(),
    activeAccountId: getActiveAccountId(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'savings-tracker-backup.json';
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('import-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!data.accounts || !Array.isArray(data.accounts)) {
        alert('Invalid backup file.');
        return;
      }
      if (!confirm('This will replace all your current data. Continue?')) return;
      saveAccounts(data.accounts);
      setActiveAccountId(data.activeAccountId || data.accounts[0].id);
      renderAll();
    } catch {
      alert('Could not read file. Make sure it is a valid backup.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// --- Render All ---

function renderAll() {
  renderAccountSelect();
  renderBackdropPicker();
  applyBackdrop(getAccountBackdrop());
  renderFontPicker();
  applyFont(getAccountFont());
  renderSummary();
  renderGoals();
}

// --- Init ---

// Migrate old global backdrop into existing accounts
const oldBackdrop = localStorage.getItem('savings-tracker-backdrop');
if (oldBackdrop) {
  const accts = loadAccounts();
  accts.forEach(a => { if (!a.backdrop) a.backdrop = oldBackdrop; });
  saveAccounts(accts);
  localStorage.removeItem('savings-tracker-backdrop');
}

renderAll();

// --- AI Earnings Advisor Agent ---

const aiFab = document.getElementById('ai-fab');
const aiPanel = document.getElementById('ai-panel');
const aiBody = document.getElementById('ai-panel-body');
const aiClose = document.getElementById('ai-panel-close');
const aiInput = document.getElementById('ai-question-input');
const aiAskBtn = document.getElementById('ai-ask-btn');
const aiForm = document.getElementById('ai-input-form');

aiFab.addEventListener('click', () => {
  const isHidden = aiPanel.classList.toggle('hidden');
  aiFab.classList.toggle('active', !isHidden);
  if (!isHidden && aiBody.children.length === 0) {
    showAiWelcome();
  }
  if (!isHidden) aiInput.focus();
});

aiClose.addEventListener('click', () => {
  aiPanel.classList.add('hidden');
  aiFab.classList.remove('active');
});

let aiResponding = false;

aiForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (aiResponding) return;
  const question = aiInput.value.trim();
  if (!question) return;
  aiInput.value = '';
  addAiMessage(escapeHtml(question), 'user');
  const topic = matchTopic(question);
  aiResponding = true;
  aiInput.disabled = true;
  aiAskBtn.disabled = true;
  showTypingThenRespond(() => generateResponse(topic, question));
});

// --- Smart Search Engine ---

function fuzzyMatch(word, target) {
  if (target.includes(word) || word.includes(target)) return true;
  if (word.length < 3 || target.length < 3) return false;
  const maxDist = word.length <= 4 ? 1 : 2;
  return levenshtein(word, target) <= maxDist;
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

const topicDB = [
  {
    topic: 'quick-wins',
    weight: 1,
    exact: ['quick', 'fast', 'easy', 'today', 'now', 'immediate', 'asap', 'soon', 'urgent', 'cash', 'money', 'rapid', 'instant', 'tonight', 'hurry', 'rush', 'need cash', 'right away', 'this week', 'emergency'],
    fuzzy: ['quick', 'fast', 'urgent', 'immediate', 'money', 'cash'],
    phrases: ['need money', 'make money', 'get money', 'earn fast', 'quick cash', 'fast cash', 'easy money', 'right now', 'this week', 'need it soon', 'in a hurry', 'as soon as possible', 'fastest way', 'quickest way', 'easiest way'],
  },
  {
    topic: 'side-hustles',
    weight: 1,
    exact: ['hustle', 'gig', 'part-time', 'job', 'work', 'deliver', 'drive', 'uber', 'lyft', 'doordash', 'instacart', 'taskrabbit', 'fiverr', 'upwork', 'etsy', 'resell', 'flip', 'sell stuff', 'marketplace'],
    fuzzy: ['hustle', 'delivery', 'driving', 'doordash', 'instacart', 'taskrabbit', 'fiverr', 'freelance'],
    phrases: ['side job', 'side hustle', 'extra job', 'second job', 'weekend job', 'part time', 'gig work', 'gig economy', 'extra work', 'after work', 'deliver food', 'drive for', 'sell things', 'sell items', 'sell online', 'flea market', 'garage sale', 'yard sale'],
  },
  {
    topic: 'passive',
    weight: 1,
    exact: ['passive', 'autopilot', 'automatic', 'residual', 'rental', 'royalty', 'dividend', 'interest', 'invest', 'stock', 'crypto', 'airbnb', 'property', 'real estate'],
    fuzzy: ['passive', 'autopilot', 'automatic', 'residual', 'rental', 'dividend', 'investment'],
    phrases: ['passive income', 'make money while i sleep', 'earn while sleeping', 'hands off', 'without working', 'rent out', 'rent my', 'recurring income', 'money on autopilot', 'set and forget', 'long term income', 'ongoing income', 'steady income', 'without effort'],
  },
  {
    topic: 'skills',
    weight: 1,
    exact: ['skill', 'talent', 'expertise', 'ability', 'strength', 'knowledge', 'teach', 'tutor', 'coach', 'consult', 'design', 'write', 'code', 'program', 'photograph', 'edit', 'translate', 'language'],
    fuzzy: ['skill', 'talent', 'freelance', 'tutoring', 'coaching', 'consulting', 'photography', 'writing', 'design', 'programming'],
    phrases: ['what can i do', 'what am i good at', 'use my skills', 'monetize my', 'leverage my', 'good at', 'i know how', 'i can do', 'my experience', 'my background', 'my degree', 'my education', 'what i know', 'freelance work'],
  },
  {
    topic: 'weekly-plan',
    weight: 1,
    exact: ['weekly', 'schedule', 'plan', 'daily', 'routine', 'calendar', 'organize', 'structure', 'timetable', 'roadmap', 'strategy', 'goal', 'step', 'action'],
    fuzzy: ['weekly', 'schedule', 'routine', 'calendar', 'organize', 'strategy', 'timetable'],
    phrases: ['weekly plan', 'daily plan', 'action plan', 'game plan', 'step by step', 'where to start', 'how to start', 'get started', 'first steps', 'what first', 'what should i do first', 'beginning', 'roadmap', 'give me a plan', 'make a plan', 'organize my time', 'how to organize', 'what order'],
  },
  {
    topic: 'boost',
    weight: 1,
    exact: ['boost', 'increase', 'reduce', 'expense', 'budget', 'accelerate', 'optimize', 'maximize', 'subscription', 'bill', 'spending', 'frugal', 'cheap', 'coupon', 'discount', 'negotiate', 'cancel'],
    fuzzy: ['boost', 'budget', 'expense', 'subscription', 'spending', 'frugal', 'optimize', 'maximize'],
    phrases: ['save more', 'spend less', 'cut expenses', 'cut costs', 'lower bills', 'stop spending', 'waste money', 'where does my money go', 'too many subscriptions', 'cancel subscriptions', 'trim the fat', 'tighten budget', 'be more frugal', 'save faster', 'reach my goal faster', 'speed up', 'not saving enough', 'falling behind'],
  },
  {
    topic: 'selling',
    weight: 1,
    exact: ['sell', 'declutter', 'poshmark', 'ebay', 'craigslist', 'facebook', 'marketplace', 'thrift', 'consignment', 'liquidate', 'downsize'],
    fuzzy: ['selling', 'poshmark', 'ebay', 'craigslist', 'marketplace', 'declutter', 'consignment'],
    phrases: ['sell my stuff', 'sell things', 'sell items', 'sell online', 'sell clothes', 'sell electronics', 'get rid of', 'clean out', 'clear out', 'don\'t need anymore', 'sitting around', 'collecting dust', 'garage sale', 'yard sale', 'what can i sell', 'stuff to sell'],
  },
  {
    topic: 'online',
    weight: 1,
    exact: ['online', 'internet', 'remote', 'computer', 'laptop', 'phone', 'app', 'website', 'digital', 'survey', 'click', 'type', 'data entry', 'virtual'],
    fuzzy: ['online', 'remote', 'internet', 'digital', 'survey', 'virtual'],
    phrases: ['from home', 'work from home', 'on my computer', 'on my phone', 'on my laptop', 'without leaving', 'stay home', 'at home', 'online jobs', 'remote work', 'remote jobs', 'online surveys', 'make money online', 'earn online', 'digital work', 'virtual assistant'],
  },
  {
    topic: 'local',
    weight: 1,
    exact: ['local', 'neighbor', 'community', 'nearby', 'walk', 'dog', 'pet', 'babysit', 'nanny', 'lawn', 'mow', 'clean', 'wash', 'shovel', 'snow', 'leaf', 'errand', 'handyman', 'repair', 'fix', 'paint', 'move', 'haul'],
    fuzzy: ['neighbor', 'babysit', 'handyman', 'cleaning', 'walking', 'mowing', 'shoveling'],
    phrases: ['in my area', 'in my neighborhood', 'near me', 'around here', 'in my town', 'in my city', 'dog walking', 'pet sitting', 'baby sitting', 'lawn care', 'yard work', 'house cleaning', 'car washing', 'snow removal', 'help people', 'help neighbors', 'odd jobs', 'local jobs', 'physical work', 'manual labor', 'hands on'],
  },
  {
    topic: 'motivation',
    weight: 0.8,
    exact: ['motivation', 'motivate', 'inspire', 'discourage', 'hopeless', 'impossible', 'stressed', 'overwhelm', 'anxiety', 'worried', 'scared', 'afraid', 'stuck', 'lost', 'confused', 'frustrated', 'tired', 'exhausted', 'burnout', 'give up', 'quit'],
    fuzzy: ['motivation', 'discouraged', 'hopeless', 'impossible', 'overwhelmed', 'frustrated', 'exhausted'],
    phrases: ['i can\'t', 'too hard', 'not possible', 'never going to', 'give up', 'feel stuck', 'feel lost', 'don\'t know what to do', 'is it possible', 'can i really', 'am i able', 'not enough time', 'too late', 'behind on', 'falling behind', 'keep going', 'stay motivated', 'how to stay', 'feel better'],
  },
];

function matchTopic(text) {
  const q = text.toLowerCase().replace(/[?!.,;:'"]/g, '');
  const words = q.split(/\s+/).filter(w => w.length > 1);
  const scores = {};

  for (const entry of topicDB) {
    let score = 0;

    // Phrase matching (highest value - 3 points each)
    for (const phrase of entry.phrases) {
      if (q.includes(phrase)) score += 3;
    }

    // Exact keyword matching (2 points each)
    for (const kw of entry.exact) {
      if (kw.includes(' ')) {
        if (q.includes(kw)) score += 2;
      } else {
        if (words.includes(kw)) score += 2;
      }
    }

    // Fuzzy matching (1 point each, only if no exact hits yet)
    if (score === 0) {
      for (const fw of entry.fuzzy) {
        for (const w of words) {
          if (w !== fw && fuzzyMatch(w, fw)) { score += 1; break; }
        }
      }
    }

    if (score > 0) scores[entry.topic] = score * entry.weight;
  }

  // Pick highest scoring topic
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0 && sorted[0][1] >= 1) return sorted[0][0];

  // General intent detection
  const intentWords = ['how', 'way', 'ways', 'idea', 'ideas', 'suggest', 'suggestion', 'help', 'advice', 'recommend', 'tip', 'tips', 'earn', 'income', 'profit', 'revenue'];
  if (words.some(w => intentWords.includes(w))) return 'overview';

  return 'fallback';
}

function addAiMessage(html, role) {
  const div = document.createElement('div');
  div.className = `ai-msg ${role}`;
  div.innerHTML = html;
  aiBody.appendChild(div);
  aiBody.scrollTop = aiBody.scrollHeight;
}

function showTypingThenRespond(responseFn) {
  const typing = document.createElement('div');
  typing.className = 'ai-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  aiBody.appendChild(typing);
  aiBody.scrollTop = aiBody.scrollHeight;

  setTimeout(() => {
    typing.remove();
    addAiMessage(responseFn(), 'agent');
    aiResponding = false;
    aiInput.disabled = false;
    aiAskBtn.disabled = false;
    aiInput.focus();
  }, 600 + Math.random() * 400);
}

function analyzeGoals() {
  const account = getActiveAccount();
  const goals = account.goals;
  if (goals.length === 0) return null;

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = goals.reduce((s, g) => s + getTotalSaved(g), 0);
  const totalGap = totalTarget - totalSaved;
  const incomplete = goals.filter(g => getTotalSaved(g) < g.target);

  let mostUrgent = null;
  let shortestDays = Infinity;
  incomplete.forEach(g => {
    const d = daysUntil(g.targetDate);
    if (d !== null && d > 0 && d < shortestDays) {
      shortestDays = d;
      mostUrgent = g;
    }
  });

  let biggestGap = null;
  let maxGap = 0;
  incomplete.forEach(g => {
    const gap = g.target - getTotalSaved(g);
    if (gap > maxGap) {
      maxGap = gap;
      biggestGap = g;
    }
  });

  return { totalTarget, totalSaved, totalGap, incomplete, mostUrgent, shortestDays, biggestGap, maxGap, goals };
}

function urgencyTag(days) {
  if (days <= 30) return '<span class="urgency-tag urgent">Urgent - less than 30 days</span>';
  if (days <= 90) return '<span class="urgency-tag moderate">Moderate - within 3 months</span>';
  return '<span class="urgency-tag relaxed">Flexible timeline</span>';
}

function showAiWelcome() {
  const data = analyzeGoals();
  if (!data || data.goals.length === 0) {
    addAiMessage(
      `<h4>Welcome to AI Earnings Advisor</h4>
      <p>Add some savings goals first, and I'll analyze them to suggest personalized ways to earn the money you need.</p>
      <p>Create a goal above, then come back here!</p>`,
      'agent'
    );
    return;
  }

  let goalCards = data.incomplete.slice(0, 3).map(g => {
    const gap = g.target - getTotalSaved(g);
    const days = daysUntil(g.targetDate);
    const daysStr = days !== null && days > 0 ? ` &middot; ${days} days left` : days !== null && days <= 0 ? ' &middot; Past due' : '';
    return `<div class="goal-analysis">
      <div class="goal-analysis-name">${escapeHtml(g.name)}</div>
      <div class="goal-analysis-detail">Need ${formatMoney(gap)} more${daysStr}</div>
    </div>`;
  }).join('');

  let html = `<h4>Here's your savings snapshot</h4>`;

  if (data.totalGap <= 0) {
    html += `<p>All your goals are fully funded! Consider setting new goals or investing your surplus.</p>`;
  } else {
    html += `<p>You need <strong>${formatMoney(data.totalGap)}</strong> more across ${data.incomplete.length} goal${data.incomplete.length > 1 ? 's' : ''}.</p>`;
    html += goalCards;
    if (data.mostUrgent) {
      html += urgencyTag(data.shortestDays);
    }
    html += `<p style="margin-top:0.5rem">Ask me a question below and I'll suggest ways to earn what you need.</p>`;
  }

  addAiMessage(html, 'agent');
}

function generateResponse(topic, question) {
  const data = analyzeGoals();
  const gap = data ? data.totalGap : 0;
  const urgent = data ? data.mostUrgent : null;
  const days = data ? data.shortestDays : Infinity;
  const noGoals = !data || data.goals.length === 0;

  if (noGoals) {
    return `<p>I don't see any goals yet. Add a savings goal first and I'll tailor my suggestions to your specific needs.</p>`;
  }

  if (gap <= 0) {
    return `<h4>You're fully funded!</h4><p>All goals are met. Consider setting new goals, building an emergency fund, or exploring investment options to grow your savings further.</p>`;
  }

  switch (topic) {
    case 'quick-wins': return quickWinsResponse(gap, days);
    case 'side-hustles': return sideHustlesResponse(gap, days, urgent);
    case 'passive': return passiveIncomeResponse(gap);
    case 'skills': return skillsResponse(gap);
    case 'weekly-plan': return weeklyPlanResponse(data);
    case 'boost': return boostResponse(data);
    case 'selling': return sellingResponse(gap);
    case 'online': return onlineResponse(gap);
    case 'local': return localResponse(gap);
    case 'motivation': return motivationResponse(data);
    case 'overview': return overviewResponse(data);
    case 'fallback': return fallbackResponse(question, data);
    default: return quickWinsResponse(gap, days);
  }
}

function overviewResponse(data) {
  const gap = data.totalGap;
  const days = data.shortestDays;
  let html = `<h4>Here's how to earn ${formatMoney(gap)}</h4>`;
  if (days !== Infinity) html += urgencyTag(days);
  html += `<p>I'd recommend a combination approach:</p><ul>`;
  html += `<li><strong>Immediate:</strong> Sell items you no longer need <span class="earn-amount">$50-500</span></li>`;
  html += `<li><strong>Weekly:</strong> Gig work or freelance tasks <span class="earn-amount">$100-500/wk</span></li>`;
  html += `<li><strong>Ongoing:</strong> Build a side income stream <span class="earn-amount">$500-3000/mo</span></li>`;
  html += `<li><strong>Save more:</strong> Cut subscriptions & negotiate bills <span class="earn-amount">$50-200/mo</span></li>`;
  html += `</ul><p>Try asking me about a specific area like "quick cash ideas", "side hustles for my timeline", "passive income", "skills I can monetize", "weekly plan", or "how to save more".</p>`;
  return html;
}

function fallbackResponse(question, data) {
  const gap = data.totalGap;
  let html = `<h4>Let me help with that</h4>`;
  html += `<p>Here's what I can help with for your ${formatMoney(gap)} savings gap:</p><ul>`;
  html += `<li><strong>"I need money fast"</strong> - Quick-win earning ideas</li>`;
  html += `<li><strong>"side hustles"</strong> - Gig work & job suggestions</li>`;
  html += `<li><strong>"sell my stuff"</strong> - Turn clutter into cash</li>`;
  html += `<li><strong>"work from home"</strong> - Online earning options</li>`;
  html += `<li><strong>"jobs near me"</strong> - Local service ideas</li>`;
  html += `<li><strong>"passive income"</strong> - Hands-off strategies</li>`;
  html += `<li><strong>"use my skills"</strong> - Monetize what you know</li>`;
  html += `<li><strong>"make me a plan"</strong> - Structured weekly schedule</li>`;
  html += `<li><strong>"save more"</strong> - Cut expenses & boost savings</li>`;
  html += `<li><strong>"I feel stuck"</strong> - Motivation & perspective</li>`;
  html += `</ul><p>Try describing what you're looking for in your own words - I understand typos and natural language!</p>`;
  return html;
}

function sellingResponse(gap) {
  let html = `<h4>Turn Your Stuff Into Cash</h4>`;
  html += `<p>Most people have ${formatMoney(Math.min(gap, 500))}+ worth of sellable items at home:</p><ul>`;
  html += `<li><strong>Clothes & shoes</strong> - Poshmark, Mercari, ThredUp <span class="earn-amount">$5-50/item</span></li>`;
  html += `<li><strong>Electronics</strong> - Old phones, tablets, consoles on Swappa/eBay <span class="earn-amount">$30-300+</span></li>`;
  html += `<li><strong>Furniture</strong> - Facebook Marketplace, Craigslist <span class="earn-amount">$25-500</span></li>`;
  html += `<li><strong>Books & media</strong> - Decluttr, Amazon trade-in <span class="earn-amount">$1-20/item</span></li>`;
  html += `<li><strong>Collectibles & toys</strong> - eBay, specialty forums <span class="earn-amount">$10-200+</span></li>`;
  html += `<li><strong>Kitchen & home goods</strong> - Local marketplace, consignment <span class="earn-amount">$5-75</span></li>`;
  html += `</ul><p><strong>Pro tips:</strong> Take good photos in natural light, price 10-20% below retail, and bundle similar items for faster sales.</p>`;
  return html;
}

function onlineResponse(gap) {
  let html = `<h4>Earn Money Online From Home</h4>`;
  html += `<p>Ways to earn on your computer or phone:</p><ul>`;
  html += `<li><strong>User testing</strong> - UserTesting, TryMyUI (test websites) <span class="earn-amount">$10-60/test</span></li>`;
  html += `<li><strong>Surveys & studies</strong> - Prolific, Respondent (research studies) <span class="earn-amount">$8-150/study</span></li>`;
  html += `<li><strong>Micro-tasks</strong> - Amazon MTurk, Clickworker <span class="earn-amount">$5-20/hr</span></li>`;
  html += `<li><strong>Transcription</strong> - Rev, TranscribeMe (type audio) <span class="earn-amount">$10-25/hr</span></li>`;
  html += `<li><strong>Virtual assistant</strong> - Belay, Time Etc <span class="earn-amount">$15-30/hr</span></li>`;
  html += `<li><strong>Freelance writing</strong> - Contently, Medium, blog posts <span class="earn-amount">$25-100+/article</span></li>`;
  html += `<li><strong>Online tutoring</strong> - Wyzant, Chegg, Varsity Tutors <span class="earn-amount">$20-60/hr</span></li>`;
  html += `<li><strong>Sell digital goods</strong> - Templates, printables, presets <span class="earn-amount">$50-500/mo</span></li>`;
  html += `</ul>`;
  if (gap <= 500) {
    html += `<p>For your ${formatMoney(gap)} gap, a few user tests and survey sessions could get you there within weeks.</p>`;
  }
  return html;
}

function localResponse(gap) {
  let html = `<h4>Earn Money Locally In Your Area</h4>`;
  html += `<p>Service jobs you can start this week with no experience:</p><ul>`;
  html += `<li><strong>Dog walking</strong> - Rover, Wag, or post on Nextdoor <span class="earn-amount">$15-30/walk</span></li>`;
  html += `<li><strong>Pet sitting</strong> - Watch pets while owners travel <span class="earn-amount">$25-75/night</span></li>`;
  html += `<li><strong>Lawn care</strong> - Mowing, trimming, leaf cleanup <span class="earn-amount">$30-75/yard</span></li>`;
  html += `<li><strong>House cleaning</strong> - Deep cleans or recurring visits <span class="earn-amount">$50-150/job</span></li>`;
  html += `<li><strong>Babysitting</strong> - Care.com, Sittercity, or word of mouth <span class="earn-amount">$15-25/hr</span></li>`;
  html += `<li><strong>Handyman tasks</strong> - Furniture assembly, mounting, small repairs <span class="earn-amount">$30-80/hr</span></li>`;
  html += `<li><strong>Car washing/detailing</strong> - Mobile detailing is in demand <span class="earn-amount">$50-150/car</span></li>`;
  html += `<li><strong>Moving help</strong> - Dolly, TaskRabbit, or local ads <span class="earn-amount">$25-40/hr</span></li>`;
  html += `</ul><p><strong>How to get clients:</strong> Post on Nextdoor, local Facebook groups, and put up flyers. Word of mouth builds fast.</p>`;
  return html;
}

function motivationResponse(data) {
  const gap = data.totalGap;
  const pct = Math.round((data.totalSaved / data.totalTarget) * 100);

  let html = `<h4>You've Got This</h4>`;
  if (pct > 0) {
    html += `<p>You've already saved <strong>${formatMoney(data.totalSaved)}</strong> - that's ${pct}% of your goal. That's real progress.</p>`;
  }
  html += `<p>Here's some perspective on your remaining ${formatMoney(gap)}:</p><ul>`;
  const dailyAmt = gap / 90;
  const weeklyAmt = gap / 12;
  html += `<li>That's only <strong>${formatMoney(weeklyAmt)}/week</strong> over 3 months</li>`;
  html += `<li>Or <strong>${formatMoney(dailyAmt)}/day</strong> over 90 days</li>`;
  html += `<li>One weekend of gig work could knock out a big chunk</li>`;
  html += `</ul>`;
  html += `<p><strong>Small wins compound.</strong> Even $10 today is $10 closer. Many people in your exact situation have reached their goals by taking it one step at a time.</p>`;
  html += `<p>Pick one thing from my suggestions and try it this week. You don't need a perfect plan - you just need to start.</p>`;
  return html;
}

function quickWinsResponse(gap, days) {
  let html = `<h4>Quick Ways to Earn Money</h4>`;
  if (days <= 30) html += urgencyTag(days);

  html += `<p>Based on your ${formatMoney(gap)} gap, here are fast options:</p><ul>`;

  if (gap <= 100) {
    html += `<li>Sell unused items on Marketplace or Poshmark <span class="earn-amount">$20-100</span></li>
    <li>Do odd jobs on TaskRabbit or Nextdoor <span class="earn-amount">$25-75/task</span></li>
    <li>Participate in online surveys (Prolific, UserTesting) <span class="earn-amount">$10-50/wk</span></li>
    <li>Offer to pet-sit or dog-walk for neighbors <span class="earn-amount">$15-30/walk</span></li>`;
  } else if (gap <= 500) {
    html += `<li>Sell clothing and electronics you don't use <span class="earn-amount">$50-300</span></li>
    <li>Do a weekend of gig work (DoorDash, Instacart) <span class="earn-amount">$100-200/wknd</span></li>
    <li>Freelance a small project on Fiverr <span class="earn-amount">$50-200</span></li>
    <li>Offer lawn care, cleaning, or organizing <span class="earn-amount">$50-150/job</span></li>
    <li>Donate plasma (if eligible) <span class="earn-amount">$50-75/visit</span></li>`;
  } else if (gap <= 2000) {
    html += `<li>Start gig driving on weekends <span class="earn-amount">$400-800/mo</span></li>
    <li>Freelance your professional skills <span class="earn-amount">$200-1000+/project</span></li>
    <li>Sell valuable items (electronics, collectibles) <span class="earn-amount">$100-500+</span></li>
    <li>Take on a part-time evening or weekend job <span class="earn-amount">$500-1200/mo</span></li>
    <li>Offer tutoring in a subject you know <span class="earn-amount">$25-75/hr</span></li>`;
  } else {
    html += `<li>Freelance or consult in your field <span class="earn-amount">$1000-5000+/mo</span></li>
    <li>Start a focused side business <span class="earn-amount">$500-3000+/mo</span></li>
    <li>Take a part-time or contract role <span class="earn-amount">$1000-3000/mo</span></li>
    <li>Rent out a spare room or parking space <span class="earn-amount">$300-1500/mo</span></li>
    <li>Combine multiple income streams from above</li>`;
  }
  html += `</ul>`;
  return html;
}

function sideHustlesResponse(gap, days, urgent) {
  let html = `<h4>Side Hustles for Your Timeline</h4>`;

  if (urgent) {
    html += `<p>Your most urgent goal "<strong>${escapeHtml(urgent.name)}</strong>" needs attention${days <= 30 ? ' within the month' : ` in ${Math.round(days / 7)} weeks`}.</p>`;
  }

  if (days <= 14) {
    html += `<p>With under 2 weeks, focus on <strong>immediate earners</strong>:</p><ul>
    <li>Gig delivery this weekend (DoorDash, UberEats) <span class="earn-amount">$100-200</span></li>
    <li>Sell 5-10 items you own but don't need <span class="earn-amount">$50-500</span></li>
    <li>Offer same-day services on TaskRabbit <span class="earn-amount">$25-100/task</span></li>
    <li>Pick up extra shifts at your current job</li></ul>`;
  } else if (days <= 60) {
    html += `<p>With 1-2 months, you can <strong>build momentum</strong>:</p><ul>
    <li>Consistent weekend gig work <span class="earn-amount">$400-800 total</span></li>
    <li>Take on 2-3 freelance projects <span class="earn-amount">$200-1500</span></li>
    <li>Start a small service (cleaning, yard work, errands) <span class="earn-amount">$300-800</span></li>
    <li>Do user testing and survey panels daily <span class="earn-amount">$100-200</span></li></ul>`;
  } else {
    html += `<p>With a longer timeline, you can <strong>build a reliable side income</strong>:</p><ul>
    <li>Launch a freelance service in your skill area <span class="earn-amount">$500-3000/mo</span></li>
    <li>Build an Etsy shop or digital product <span class="earn-amount">$200-2000/mo</span></li>
    <li>Start tutoring or coaching <span class="earn-amount">$500-2000/mo</span></li>
    <li>Take a structured part-time role <span class="earn-amount">$800-2000/mo</span></li></ul>`;
  }
  return html;
}

function passiveIncomeResponse(gap) {
  let html = `<h4>Passive & Semi-Passive Income Ideas</h4>`;
  html += `<p>These take effort upfront but can generate ongoing income:</p><ul>
  <li><strong>Rent out a room</strong> on Airbnb or to a roommate <span class="earn-amount">$400-1500/mo</span></li>
  <li><strong>Sell digital products</strong> (templates, guides, printables) <span class="earn-amount">$100-1000/mo</span></li>
  <li><strong>Rent equipment</strong> you own (camera, tools, parking spot) <span class="earn-amount">$50-300/mo</span></li>
  <li><strong>Create content</strong> (YouTube, blog) with ad revenue <span class="earn-amount">$0-500/mo</span></li>
  <li><strong>Cashback & rewards</strong> optimization on everyday spending <span class="earn-amount">$20-80/mo</span></li>
  <li><strong>High-yield savings account</strong> for money you've already saved <span class="earn-amount">4-5% APY</span></li></ul>`;
  if (gap > 2000) {
    html += `<p>For your ${formatMoney(gap)} gap, combining passive income with active earning will be most effective.</p>`;
  }
  return html;
}

function skillsResponse(gap) {
  return `<h4>Skills You Can Monetize Quickly</h4>
  <p>These skills can start earning within days:</p><ul>
  <li><strong>Writing & editing</strong> - Blog posts, resumes, copywriting <span class="earn-amount">$25-100/hr</span></li>
  <li><strong>Social media</strong> - Managing accounts for small businesses <span class="earn-amount">$300-1000/mo</span></li>
  <li><strong>Data entry / admin</strong> - Virtual assistant work <span class="earn-amount">$15-30/hr</span></li>
  <li><strong>Design</strong> - Logos, flyers, social graphics <span class="earn-amount">$50-500/project</span></li>
  <li><strong>Photography</strong> - Events, portraits, product shots <span class="earn-amount">$100-500/session</span></li>
  <li><strong>Tech support</strong> - Help people with computers/phones <span class="earn-amount">$25-75/hr</span></li>
  <li><strong>Teaching/tutoring</strong> - Any subject or instrument <span class="earn-amount">$25-75/hr</span></li>
  <li><strong>Handy work</strong> - Assembly, mounting, minor repairs <span class="earn-amount">$30-60/hr</span></li></ul>
  <p>Pick what aligns with your strengths and start offering it this week.</p>`;
}

function weeklyPlanResponse(data) {
  const weeks = data.shortestDays !== Infinity ? data.shortestDays / 7 : 12;
  const weeklyTarget = data.totalGap / Math.max(1, weeks);
  const dailyTarget = weeklyTarget / 7;

  let html = `<h4>Your Weekly Earning Plan</h4>`;
  html += `<p>To close your ${formatMoney(data.totalGap)} gap${data.shortestDays !== Infinity ? ` in ${Math.round(weeks)} weeks` : ''}, aim for <strong>${formatMoney(weeklyTarget)}/week</strong> (${formatMoney(dailyTarget)}/day).</p>`;

  html += `<p><strong>Sample Weekly Schedule:</strong></p><ul>`;

  if (weeklyTarget <= 100) {
    html += `<li><strong>Mon-Fri:</strong> 30 min/day on surveys or micro-tasks <span class="earn-amount">~$5-10/day</span></li>
    <li><strong>Saturday:</strong> 2-3 hrs selling items or gig work <span class="earn-amount">$30-60</span></li>
    <li><strong>Sunday:</strong> One freelance task or odd job <span class="earn-amount">$25-50</span></li>`;
  } else if (weeklyTarget <= 300) {
    html += `<li><strong>Mon-Thu:</strong> 1-2 hrs/evening on freelance work <span class="earn-amount">$20-40/day</span></li>
    <li><strong>Friday:</strong> List items to sell, handle admin <span class="earn-amount">$0-20</span></li>
    <li><strong>Sat-Sun:</strong> 4-5 hrs gig work or service jobs <span class="earn-amount">$80-150/day</span></li>`;
  } else {
    html += `<li><strong>Mon-Fri:</strong> 2-3 hrs/evening on freelance or part-time work <span class="earn-amount">$40-80/day</span></li>
    <li><strong>Saturday:</strong> Full day of gig work, service jobs, or freelance <span class="earn-amount">$100-250</span></li>
    <li><strong>Sunday:</strong> Prep for the week, list items for sale, apply for gigs <span class="earn-amount">$50-100</span></li>`;
  }

  html += `</ul><p>Consistency matters more than perfection. Track your earnings by adding contributions to your goals.</p>`;
  return html;
}

function boostResponse(data) {
  const weeks = data.shortestDays !== Infinity ? data.shortestDays / 7 : 12;
  const weeklyNeeded = data.totalGap / Math.max(1, weeks);

  let html = `<h4>Boost Your Savings Rate</h4>`;
  html += `<p>Two sides of the equation: <strong>earn more</strong> and <strong>spend less</strong>.</p>`;

  html += `<p><strong>Cut expenses (find hidden money):</strong></p><ul>
  <li>Audit subscriptions - cancel unused ones <span class="earn-amount">$20-100/mo</span></li>
  <li>Cook at home more, meal prep on Sundays <span class="earn-amount">$100-300/mo</span></li>
  <li>Switch to cheaper phone/internet plans <span class="earn-amount">$20-60/mo</span></li>
  <li>Use cashback apps (Rakuten, Ibotta) on purchases <span class="earn-amount">$10-40/mo</span></li>
  <li>Negotiate bills (insurance, utilities) <span class="earn-amount">$30-100/mo</span></li></ul>`;

  html += `<p><strong>Accelerate earnings:</strong></p><ul>
  <li>Stack 2-3 earning methods simultaneously</li>
  <li>Dedicate a "savings sprint" weekend each month</li>
  <li>Set up automatic transfers when you earn</li>
  <li>Ask for a raise or take on overtime at your main job</li></ul>`;

  html += `<p>Target: <strong>${formatMoney(weeklyNeeded)}/week</strong> from combined savings + earnings to stay on track.</p>`;
  return html;
}
