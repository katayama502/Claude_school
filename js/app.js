/* =====================================================================
 * app.js — 初期化・状態管理・イベントバインド
 * ===================================================================== */

'use strict';

(function App() {
  const { USER_TYPES, CATEGORIES, DIFFICULTY_LABELS } = window.AppData;
  const { Progress, UserPrefs } = window.AppCookie;

  // 画面状態（フィルタ条件）
  const state = {
    userType: UserPrefs.getUserType() || 'developer',
    category: UserPrefs.getActiveCategory(),
    difficulty: null,
    status: null,
  };

  /* ------- DOM 参照 ------- */
  const $cards = document.getElementById('card-grid');
  const $flow = document.getElementById('flow-visualizer');
  const $dash = document.getElementById('dashboard');

  /* ------- 全体再描画 ------- */
  function rerender() {
    window.UI.renderCards($cards, state);
    window.UI.renderFlow($flow, state.userType);
    window.UI.renderDashboard($dash);
    window.UI.syncUserTypeTabs(state.userType);
    window.UI.syncCategoryTabs(state.category);
  }

  /* ------- ユーザー属性タブ ------- */
  function buildUserTypeTabs() {
    const host = document.getElementById('usertype-tabs');
    Object.values(USER_TYPES).forEach((ut) => {
      const btn = document.createElement('button');
      btn.className = 'tab tab--usertype';
      btn.type = 'button';
      btn.dataset.usertype = ut.id;
      btn.textContent = `${ut.icon} ${ut.labelJa}`;
      btn.setAttribute('aria-pressed', String(state.userType === ut.id));
      btn.addEventListener('click', () => {
        state.userType = ut.id;
        UserPrefs.setUserType(ut.id);
        rerender();
      });
      host.appendChild(btn);
    });
  }

  /* ------- カテゴリタブ ------- */
  function buildCategoryTabs() {
    const host = document.getElementById('category-tabs');
    Object.values(CATEGORIES).forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'tab tab--category';
      btn.type = 'button';
      btn.dataset.category = cat.id;
      btn.textContent = `${cat.icon} ${cat.labelJa}`;
      btn.setAttribute('aria-pressed', String(state.category === cat.id));
      btn.addEventListener('click', () => {
        state.category = cat.id;
        UserPrefs.setActiveCategory(cat.id);
        rerender();
      });
      host.appendChild(btn);
    });
  }

  /* ------- 難易度・状態フィルタ ------- */
  function buildFilters() {
    const diffHost = document.getElementById('difficulty-filter');
    const diffDefs = [
      { v: null, label: 'すべての難易度' },
      { v: 1, label: DIFFICULTY_LABELS[1] },
      { v: 2, label: DIFFICULTY_LABELS[2] },
      { v: 3, label: DIFFICULTY_LABELS[3] },
    ];
    diffDefs.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = d.v == null ? '' : String(d.v);
      opt.textContent = d.label;
      diffHost.appendChild(opt);
    });
    diffHost.addEventListener('change', (e) => {
      const v = e.target.value;
      state.difficulty = v ? Number(v) : null;
      window.UI.renderCards($cards, state);
    });

    const statusHost = document.getElementById('status-filter');
    const statusDefs = [
      { v: null, label: 'すべての状態' },
      { v: 'not_started', label: '未着手' },
      { v: 'in_progress', label: '学習中' },
      { v: 'completed', label: '完了済' },
    ];
    statusDefs.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = d.v || '';
      opt.textContent = d.label;
      statusHost.appendChild(opt);
    });
    statusHost.addEventListener('change', (e) => {
      state.status = e.target.value || null;
      window.UI.renderCards($cards, state);
    });
  }

  /* ------- リセットボタン ------- */
  function bindReset() {
    document.querySelectorAll('[data-action="reset"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!confirm('学習の進捗と属性設定をすべてリセットします。よろしいですか？')) return;
        Progress.reset();
        state.userType = 'developer';
        state.category = 'all';
        state.difficulty = null;
        state.status = null;
        document.getElementById('difficulty-filter').value = '';
        document.getElementById('status-filter').value = '';
        rerender();
        openWelcomeFlow();
      });
    });
  }

  /* ------- モーダル制御 ------- */
  function bindModal() {
    document.getElementById('modal-close').addEventListener('click', window.UI.closeModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') window.UI.closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!document.getElementById('modal-overlay').hidden) window.UI.closeModal();
      }
    });
  }

  /* ------- 進捗変更イベント → 部分再描画 ------- */
  function bindProgressEvents() {
    document.addEventListener('progress-changed', () => {
      window.UI.renderCards($cards, state);
      window.UI.renderFlow($flow, state.userType);
      window.UI.renderDashboard($dash);
    });
  }

  /* ------- ウェルカムフロー ------- */
  function openWelcomeFlow() {
    window.UI.openWelcome((picked) => {
      state.userType = picked;
      UserPrefs.setUserType(picked);
      rerender();
    });
  }

  /* ------- 初期化 ------- */
  function init() {
    buildUserTypeTabs();
    buildCategoryTabs();
    buildFilters();
    bindReset();
    bindModal();
    bindProgressEvents();

    rerender();

    if (UserPrefs.isFirstVisit() || !UserPrefs.getUserType()) {
      openWelcomeFlow();
    }
    UserPrefs.markVisited();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
