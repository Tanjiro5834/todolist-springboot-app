  // ─── CONFIG ────────────────────────────────────────────────────────────────
  const API = 'http://localhost:8080/tasks';

  // ─── STATE ─────────────────────────────────────────────────────────────────
  let tasks            = [];
  let selectedPriority = 'LOW';

  // ─── THEME ─────────────────────────────────────────────────────────────────
  const html = document.documentElement;
  html.setAttribute('data-theme', localStorage.getItem('do-theme') || 'light');

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('do-theme', next);
  });

  // ─── TOAST ─────────────────────────────────────────────────────────────────
  let toastTimer;
  function showToast(msg, isError = false) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast' + (isError ? ' error' : '');
    // force reflow so transition fires even if toast is already visible
    void el.offsetWidth;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
  }

  // ─── API HELPERS ───────────────────────────────────────────────────────────
  async function apiFetch(path, options = {}) {
    const res = await fetch(API + path, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    // DELETE returns 200 with empty body — guard against parsing empty
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  // ─── PRIORITY PILLS ────────────────────────────────────────────────────────
  document.getElementById('priority-group').addEventListener('click', e => {
    const pill = e.target.closest('.p-pill');
    if (!pill) return;
    selectedPriority = pill.dataset.priority;
    document.querySelectorAll('.p-pill').forEach(p =>
      p.classList.toggle('sel', p.dataset.priority === selectedPriority)
    );
  });

  // ─── LOAD ALL TASKS ────────────────────────────────────────────────────────
  async function loadTasks() {
    showSkeletons();
    try {
      tasks = await apiFetch('');  // GET /tasks
      render();
    } catch (err) {
      clearSkeletons();
      showToast('Could not load tasks — is Spring Boot running?', true);
      console.error('[loadTasks]', err);
    }
  }

  // ─── ADD TASK ──────────────────────────────────────────────────────────────
  async function addTask() {
    const titleEl = document.getElementById('input-title');
    const descEl  = document.getElementById('input-desc');
    const title   = titleEl.value.trim();
    if (!title) { titleEl.focus(); return; }

    const btn = document.getElementById('add-btn');
    btn.disabled = true;

    const payload = {
      title,
      description: descEl.value.trim() || null,
      priority:    selectedPriority      // "HIGH" | "MEDIUM" | "LOW"
    };

    try {
      const created = await apiFetch('', {   // POST /tasks
        method: 'POST',
        body:   JSON.stringify(payload)
      });
      tasks.unshift(created);
      titleEl.value = '';
      descEl.value  = '';
      render();
      showToast('Task added');
    } catch (err) {
      showToast('Failed to add task', true);
      console.error('[addTask]', err);
    } finally {
      btn.disabled = false;
      titleEl.focus();
    }
  }

  document.getElementById('add-btn').addEventListener('click', addTask);

  document.getElementById('input-title').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('input-desc').focus(); }
  });

  document.getElementById('input-desc').addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addTask();
  });

  // ─── DELETE TASK ───────────────────────────────────────────────────────────
  async function deleteTask(id) {
    // optimistic: animate out immediately
    const el = document.querySelector(`.task-item[data-id="${id}"]`);
    if (el) el.classList.add('removing');

    try {
      await apiFetch(`/${id}`, { method: 'DELETE' });  // DELETE /tasks/{id}
      tasks = tasks.filter(t => t.id !== id);
      setTimeout(() => render(), 260);
      showToast('Task deleted');
    } catch (err) {
      // rollback animation
      if (el) el.classList.remove('removing');
      showToast('Failed to delete task', true);
      console.error('[deleteTask]', err);
    }
  }

  // ─── UPDATE TASK (priority toggle demo — extend as needed) ─────────────────
  // PUT /tasks/{id} expects the full Task body.
  async function updateTask(id, patch) {
    const original = tasks.find(t => t.id === id);
    const payload  = { ...original, ...patch };

    try {
      const updated = await apiFetch(`/${id}`, {   // PUT /tasks/{id}
        method: 'PUT',
        body:   JSON.stringify(payload)
      });
      tasks = tasks.map(t => t.id === id ? updated : t);
      render();
    } catch (err) {
      showToast('Failed to update task', true);
      console.error('[updateTask]', err);
    }
  }

  // ─── RENDER ────────────────────────────────────────────────────────────────
  const priorityLabel = { HIGH: 'High', MEDIUM: 'Med', LOW: 'Low' };

  function render() {
    const list  = document.getElementById('task-list');
    const empty = document.getElementById('empty-state');
    list.innerHTML = '';
    empty.classList.toggle('show', tasks.length === 0);

    tasks.forEach(task => {
      const item = document.createElement('div');
      item.className   = 'task-item';
      item.dataset.id       = task.id;
      item.dataset.priority = task.priority;

      item.innerHTML = `
        <button class="task-check" aria-label="Toggle done">
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7.5L10 1" stroke="white" stroke-width="1.8"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="task-body">
          <div class="task-title">${esc(task.title)}</div>
          ${task.description ? `<div class="task-desc">${esc(task.description)}</div>` : ''}
          <span class="task-badge badge-${task.priority}">
            ${priorityLabel[task.priority] ?? task.priority}
          </span>
        </div>
        <button class="task-del" aria-label="Delete">✕</button>
      `;

      // delete
      item.querySelector('.task-del').addEventListener('click', () => deleteTask(task.id));

      // checkbox → cycle priority as a demo of PUT; swap for your own "done" field if you add one
      item.querySelector('.task-check').addEventListener('click', () => {
        const cycle = { LOW: 'MEDIUM', MEDIUM: 'HIGH', HIGH: 'LOW' };
        updateTask(task.id, { priority: cycle[task.priority] });
      });

      list.appendChild(item);
    });
  }

  // ─── SKELETONS ─────────────────────────────────────────────────────────────
  function showSkeletons(n = 3) {
    const list = document.getElementById('task-list');
    list.innerHTML = Array.from({ length: n }, () => `
      <div class="skeleton">
        <div class="skel-circle"></div>
        <div class="skel-body">
          <div class="skel-line"></div>
          <div class="skel-line short"></div>
          <div class="skel-line badge"></div>
        </div>
      </div>
    `).join('');
    document.getElementById('empty-state').classList.remove('show');
  }

  function clearSkeletons() {
    document.getElementById('task-list').innerHTML = '';
  }

  // ─── UTILS ─────────────────────────────────────────────────────────────────
  function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ─── INIT ──────────────────────────────────────────────────────────────────
  loadTasks();