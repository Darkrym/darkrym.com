// ── TAB SWITCHING ────────────────────────────────────────────
function showTab(name, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-bar button').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
  btn.scrollIntoView({ inline: 'nearest', behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── CLI OS TOGGLE ─────────────────────────────────────────────
function showCliOs(os, btn) {
  document.querySelectorAll('.cli-os-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.cli-os-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('cli-os-' + os).classList.add('active');
  btn.classList.add('active');
}

// ── SEARCH ENGINE ─────────────────────────────────────────────
const TAB_NAMES = {
  'webshell': 'Webshell',
  'windows-logs': 'Windows Logs',
  'windows-registry': 'Windows Registry',
  'cli': 'CLI',
  'sql-server': 'SQL Server',
  'ip-domain': 'IP & Domain',
  'sigma': 'Sigma Rules',
  'regex': 'Regex',
  'markdown': 'Markdown'
};

// Build a flat index of searchable text nodes from all panels
function buildIndex() {
  const index = [];
  document.querySelectorAll('.tab-panel').forEach(panel => {
    const tabId = panel.id.replace('tab-', '');
    const tabName = TAB_NAMES[tabId] || tabId;

    // Index sections (h2, h3, card-titles, table rows, list items, pre blocks)
    const sections = panel.querySelectorAll('h2.section, h3.sub, .card-title, tr, li, pre');
    sections.forEach(el => {
      const text = el.textContent.trim().replace(/\s+/g, ' ');
      if (text.length < 3) return;

      // Find nearest heading for context
      let heading = '';
      let sib = el.previousElementSibling;
      let parent = el.parentElement;
      while (parent && parent !== panel) {
        let hEl = parent.querySelector('h2.section, .card-title');
        if (hEl) { heading = hEl.textContent.trim(); break; }
        parent = parent.parentElement;
      }

      index.push({ tabId, tabName, el, text, heading });
    });
  });
  return index;
}

let searchIndex = null;
let hlNodes = [];
let debounceTimer = null;
let focusedIdx = -1;

const input = document.getElementById('searchInput');
const resultsBox = document.getElementById('searchResults');
const countEl = document.getElementById('searchCount');
const clearBtn = document.getElementById('searchClear');

input.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(runSearch, 120);
});

input.addEventListener('keydown', e => {
  const items = resultsBox.querySelectorAll('.sr-item');
  if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(items, 1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(items, -1); }
  else if (e.key === 'Enter') {
    const focused = resultsBox.querySelector('.sr-item.focused');
    if (focused) focused.click();
    else if (items.length === 1) items[0].click();
  }
  else if (e.key === 'Escape') { clearSearch(); }
});

// Close on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrapper')) hideResults();
});

function moveFocus(items, dir) {
  if (!items.length) return;
  items[focusedIdx]?.classList.remove('focused');
  focusedIdx = Math.max(0, Math.min(items.length - 1, focusedIdx + dir));
  items[focusedIdx]?.classList.add('focused');
  items[focusedIdx]?.scrollIntoView({ block: 'nearest' });
}

function runSearch() {
  const q = input.value.trim();
  clearBtn.style.display = q ? 'block' : 'none';

  // Remove old highlights
  removeHighlights();

  if (!q) {
    hideResults();
    countEl.textContent = '';
    return;
  }

  if (!searchIndex) searchIndex = buildIndex();

  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = [];

  searchIndex.forEach(entry => {
    const lower = entry.text.toLowerCase();
    if (terms.every(t => lower.includes(t))) {
      matches.push(entry);
    }
  });

  focusedIdx = -1;
  renderResults(matches, q, terms);
}

function highlight(text, terms) {
  let result = escapeHtml(text);
  terms.forEach(term => {
    const re = new RegExp('(' + escapeRe(term) + ')', 'gi');
    result = result.replace(re, '<mark>$1</mark>');
  });
  return result;
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderResults(matches, q, terms) {
  if (!matches.length) {
    resultsBox.innerHTML = `<div class="no-results">no results for <mark>${escapeHtml(q)}</mark></div>`;
    resultsBox.style.display = 'block';
    countEl.textContent = '0 results';
    return;
  }

  countEl.textContent = `${matches.length} result${matches.length !== 1 ? 's' : ''}`;

  // Group by tab
  const groups = {};
  matches.forEach(m => {
    if (!groups[m.tabId]) groups[m.tabId] = { name: m.tabName, items: [] };
    groups[m.tabId].items.push(m);
  });

  let html = '';
  Object.entries(groups).forEach(([tabId, group]) => {
    html += `<div class="sr-group">
      <div class="sr-group-label">${escapeHtml(group.name)}</div>`;
    group.items.slice(0, 8).forEach(m => {
      const snippet = m.text.length > 120 ? m.text.slice(0, 120) + '…' : m.text;
      const ctx = m.heading && m.heading !== m.text.slice(0,m.heading.length)
        ? escapeHtml(m.heading) : '';
      html += `<div class="sr-item" data-tab="${tabId}" data-text="${escapeHtml(m.text.slice(0,60))}">
        <div class="sr-item-title">${highlight(snippet, terms)}</div>
        ${ctx ? `<div class="sr-item-ctx">${ctx}</div>` : ''}
      </div>`;
    });
    if (group.items.length > 8) {
      html += `<div class="sr-item-ctx" style="padding:4px 14px 8px;color:var(--dim);">… and ${group.items.length - 8} more in this tab</div>`;
    }
    html += `</div>`;
  });

  resultsBox.innerHTML = html;
  resultsBox.style.display = 'block';

  // Click handlers
  resultsBox.querySelectorAll('.sr-item').forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.dataset.tab;
      const btn = [...document.querySelectorAll('.tab-bar button')]
        .find(b => b.getAttribute('onclick')?.includes(`'${tabId}'`));
      if (btn) showTab(tabId, btn);
      hideResults();
      // Highlight matches in the now-active panel
      setTimeout(() => highlightInPage(terms, tabId), 80);
    });
  });
}

function highlightInPage(terms, tabId) {
  removeHighlights();
  const panel = document.getElementById('tab-' + tabId);
  if (!panel) return;

  const walker = document.createTreeWalker(panel, NodeFilter.SHOW_TEXT);
  const nodesToWrap = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    // Skip script/style/input elements
    if (['SCRIPT','STYLE','INPUT'].includes(parent?.tagName)) continue;
    const lower = node.textContent.toLowerCase();
    if (terms.every(t => lower.includes(t)) || terms.some(t => lower.includes(t))) {
      nodesToWrap.push(node);
    }
  }

  nodesToWrap.forEach(node => {
    let html = escapeHtml(node.textContent);
    terms.forEach(term => {
      const re = new RegExp('(' + escapeRe(term) + ')', 'gi');
      html = html.replace(re, '<span class="search-hl">$1</span>');
    });
    const span = document.createElement('span');
    span.innerHTML = html;
    node.parentNode.replaceChild(span, node);
    hlNodes.push(span);
  });

  // Scroll first highlight into view
  const first = panel.querySelector('.search-hl');
  if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function removeHighlights() {
  hlNodes.forEach(span => {
    const parent = span.parentNode;
    if (!parent) return;
    const text = document.createTextNode(span.textContent);
    parent.replaceChild(text, span);
    parent.normalize();
  });
  hlNodes = [];
  // Also nuke any leftover (e.g. from re-render)
  document.querySelectorAll('.search-hl').forEach(el => {
    const text = document.createTextNode(el.textContent);
    el.parentNode.replaceChild(text, el);
  });
}

function hideResults() {
  resultsBox.style.display = 'none';
  focusedIdx = -1;
}

function clearSearch() {
  input.value = '';
  clearBtn.style.display = 'none';
  countEl.textContent = '';
  hideResults();
  removeHighlights();
  input.focus();
}

// Keyboard shortcut: / to focus search
document.addEventListener('keydown', e => {
  if (e.key === '/' && document.activeElement !== input) {
    e.preventDefault();
    input.focus();
    input.select();
  }
});
