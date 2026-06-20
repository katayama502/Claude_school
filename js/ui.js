/* =====================================================================
 * ui.js — DOM 生成・レンダリング
 *
 * XSS 対策: すべて createElement / textContent で構築し、
 *           innerHTML への文字列挿入は行わない。
 * ===================================================================== */

'use strict';

const UI = (() => {
  const { TOPICS, CATEGORIES, USER_TYPES, LEARNING_FLOWS,
    DIFFICULTY_LABELS, STEP_LABELS, NEXT_TOPICS } = window.AppData;
  const { Progress, UserPrefs } = window.AppCookie;

  /* ------- 小さな DOM ヘルパー ------- */
  function el(tag, opts = {}, children = []) {
    const node = document.createElement(tag);
    if (opts.class) node.className = opts.class;
    if (opts.text != null) node.textContent = opts.text;
    if (opts.attrs) {
      Object.entries(opts.attrs).forEach(([k, v]) => node.setAttribute(k, v));
    }
    if (opts.on) {
      Object.entries(opts.on).forEach(([evt, fn]) => node.addEventListener(evt, fn));
    }
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c) node.appendChild(c);
    });
    return node;
  }

  const STATUS_META = {
    not_started: { label: '未着手', badgeClass: 'badge--gray', mark: '○' },
    in_progress: { label: '学習中', badgeClass: 'badge--warning', mark: '▶' },
    completed: { label: '完了', badgeClass: 'badge--success', mark: '✓' },
  };

  /* ===================================================================
   * カードグリッド
   * =================================================================== */
  function renderCards(container, filters) {
    container.textContent = '';
    const list = getFilteredSortedTopics(filters);

    if (list.length === 0) {
      container.appendChild(
        el('p', { class: 'empty-state', text: '条件に一致するトピックがありません。' })
      );
      return;
    }
    list.forEach((topic) => container.appendChild(buildCard(topic)));
  }

  function getFilteredSortedTopics(filters) {
    let list = Object.values(TOPICS);

    if (filters.category && filters.category !== 'all') {
      list = list.filter((t) => t.category === filters.category);
    }
    if (filters.difficulty) {
      list = list.filter((t) => t.difficulty === filters.difficulty);
    }
    if (filters.status) {
      list = list.filter((t) => Progress.getStatus(t.id) === filters.status);
    }

    // 推奨順ソート：ユーザー属性のフロー順を最優先、その後 ID 順
    const flow = LEARNING_FLOWS[filters.userType] || [];
    list.sort((a, b) => {
      const ia = flow.indexOf(a.id);
      const ib = flow.indexOf(b.id);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.id.localeCompare(b.id);
    });
    return list;
  }

  function buildCard(topic) {
    const status = Progress.getStatus(topic.id);
    const sm = STATUS_META[status];
    const cat = CATEGORIES[topic.category];

    const card = el('article', {
      class: `card card--${status}`,
      attrs: { 'data-id': topic.id, tabindex: '0', role: 'button',
        'aria-label': `${topic.titleJa} の詳細を開く` },
    });

    // トップ画像
    const img = document.createElement('img');
    img.className = 'card__img';
    img.src = `img/${topic.id}.png`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    card.appendChild(img);

    // ヘッダー：難易度 + 状態バッジ
    const header = el('div', { class: 'card__header' }, [
      el('span', { class: 'card__difficulty',
        attrs: { title: `難易度 ${topic.difficulty}` },
        text: DIFFICULTY_LABELS[topic.difficulty] }),
    ]);

    // 状態バッジ（クリックでサイクル）
    const badge = el('button', {
      class: `badge ${sm.badgeClass} card__badge`,
      attrs: { type: 'button', title: 'クリックで状態を切替' },
      text: `${sm.label} ${sm.mark}`.trim(),
      on: {
        click: (e) => {
          e.stopPropagation();
          const next = Progress.cycle(topic.id);
          document.dispatchEvent(new CustomEvent('progress-changed',
            { detail: { id: topic.id, status: next } }));
        },
      },
    });
    header.appendChild(badge);
    card.appendChild(header);

    // カテゴリタグ
    card.appendChild(
      el('span', { class: `card__cat card__cat--${topic.category}`,
        text: cat.labelJa })
    );

    // タイトル・説明
    card.appendChild(el('h3', { class: 'card__title', text: topic.titleJa }));
    card.appendChild(el('p', { class: 'card__en', text: topic.titleEn }));
    card.appendChild(el('p', { class: 'card__desc', text: topic.descJa }));

    // フッター：推定時間 + 詳細
    const footer = el('div', { class: 'card__footer' }, [
      el('span', { class: 'card__time', text: `約${topic.estimatedMinutes}分` }),
      el('span', { class: 'card__detail-link', text: '詳細 →' }),
    ]);
    card.appendChild(footer);

    // カード全体クリックで詳細
    const open = () => openModal(topic.id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
    return card;
  }

  /* ===================================================================
   * 学習フロービジュアライザー
   * =================================================================== */
  function renderFlow(container, userType) {
    container.textContent = '';
    const flow = LEARNING_FLOWS[userType];
    if (!flow) { container.hidden = true; return; }
    container.hidden = false;

    const ut = USER_TYPES[userType];
    container.appendChild(
      el('p', { class: 'flow__heading',
        text: `${ut.icon} あなたのおすすめルート（${ut.labelJa}）` })
    );

    const track = el('ol', { class: 'flow__track' });
    flow.forEach((id, i) => {
      const topic = TOPICS[id];
      if (!topic) return;
      const status = Progress.getStatus(id);
      const sm = STATUS_META[status];

      const step = el('li', {
        class: `flow__step flow__step--${status}`,
        attrs: { 'data-id': id, role: 'button', tabindex: '0',
          'aria-label': `${topic.titleJa}（${sm.label}）` },
      }, [
        el('span', { class: 'flow__mark', text: sm.mark }),
        el('span', { class: 'flow__id', text: id }),
        el('span', { class: 'flow__name', text: topic.titleJa }),
      ]);
      const open = () => openModal(id);
      step.addEventListener('click', open);
      step.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
      track.appendChild(step);

      if (i < flow.length - 1) {
        track.appendChild(el('li', { class: 'flow__arrow', attrs: { 'aria-hidden': 'true' }, text: '→' }));
      }
    });
    container.appendChild(track);
  }

  /* ===================================================================
   * 進捗ダッシュボード（フッター）
   * =================================================================== */
  function renderDashboard(container) {
    container.textContent = '';
    const rate = Progress.getCompletionRate();
    const total = Object.keys(TOPICS).length;
    const done = Object.values(TOPICS)
      .filter((t) => Progress.getStatus(t.id) === 'completed').length;

    container.appendChild(
      el('h3', { class: 'dash__title', text: '学習の進捗' })
    );
    container.appendChild(buildProgressRow(`全体: ${done}/${total} 完了`, rate, true));

    ['build', 'work', 'personal'].forEach((catId) => {
      const stats = Progress.getCategoryStats(catId);
      const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;
      container.appendChild(
        buildProgressRow(`${CATEGORIES[catId].icon} ${CATEGORIES[catId].labelJa}: ${stats.done}/${stats.total}`, pct, false)
      );
    });
  }

  function buildProgressRow(label, pct, isMain) {
    const row = el('div', { class: `dash__row${isMain ? ' dash__row--main' : ''}` });
    row.appendChild(el('div', { class: 'dash__label' }, [
      el('span', { text: label }),
      el('span', { class: 'dash__pct', text: `${pct}%` }),
    ]));
    const bar = el('div', { class: 'dash__bar', attrs: {
      role: 'progressbar', 'aria-valuenow': String(pct),
      'aria-valuemin': '0', 'aria-valuemax': '100' } });
    const fill = el('div', { class: 'dash__fill' });
    fill.style.width = `${pct}%`;
    bar.appendChild(fill);
    row.appendChild(bar);
    return row;
  }

  /* ===================================================================
   * 詳細モーダル
   * =================================================================== */
  let lastFocused = null;

  function openModal(topicId) {
    const topic = TOPICS[topicId];
    if (!topic) return;
    UserPrefs.setLastVisited(topicId);

    const overlay = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    body.textContent = '';
    body.appendChild(buildModalContent(topic));

    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('no-scroll');
    document.getElementById('modal-close').focus();
  }

  function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function buildModalContent(topic) {
    const frag = document.createDocumentFragment();
    const cat = CATEGORIES[topic.category];
    const status = Progress.getStatus(topic.id);

    // メタ行
    frag.appendChild(el('div', { class: 'modal__meta' }, [
      el('span', { class: `card__cat card__cat--${topic.category}`,
        text: `${cat.icon} ${cat.labelJa}` }),
      el('span', { class: 'modal__diff', text: `難易度 ${DIFFICULTY_LABELS[topic.difficulty]}` }),
      el('span', { class: 'modal__est', text: `⏱ 推定 約${topic.estimatedMinutes}分` }),
    ]));

    // タイトル
    frag.appendChild(el('h2', { class: 'modal__title',
      text: `${topic.icon} ${topic.titleJa}` }));
    frag.appendChild(el('p', { class: 'modal__en', text: topic.titleEn }));
    frag.appendChild(el('p', { class: 'modal__desc', text: topic.descJa }));

    // 状態更新ボタン群
    frag.appendChild(buildStatusControls(topic, status));

    // 日本語学習コンテンツ
    if (topic.contentJa) {
      frag.appendChild(buildContentJa(topic.contentJa));
    }

    // 前提トピック
    if (topic.prerequisites.length) {
      const pre = el('div', { class: 'modal__prereq' }, [
        el('span', { class: 'modal__prereq-label', text: '前提: ' }),
      ]);
      topic.prerequisites.forEach((pid) => {
        if (!TOPICS[pid]) return;
        pre.appendChild(el('button', {
          class: 'chip',
          attrs: { type: 'button' },
          text: `${pid} ${TOPICS[pid].titleJa}`,
          on: { click: () => openModal(pid) },
        }));
      });
      frag.appendChild(pre);
    }

    // 学習ステップ（リンク群）
    const steps = el('div', { class: 'modal__steps' });
    steps.appendChild(el('h3', { class: 'modal__section-title', text: '学習ステップ' }));
    let hasLinks = false;
    Object.keys(STEP_LABELS).forEach((key) => {
      const items = topic.links[key];
      if (!items || !items.length) return;
      hasLinks = true;
      const meta = STEP_LABELS[key];
      const group = el('div', { class: 'step-group' }, [
        el('h4', { class: 'step-group__title', text: `${meta.icon} ${meta.ja}` }),
      ]);
      const ul = el('ul', { class: 'step-group__list' });
      items.forEach((link) => {
        const a = el('a', {
          class: 'step-link',
          text: link.labelJa,
          attrs: { href: link.url, target: '_blank', rel: 'noopener noreferrer' },
        });
        a.appendChild(el('span', { class: 'step-link__ext', attrs: { 'aria-hidden': 'true' }, text: '↗' }));
        ul.appendChild(el('li', {}, a));
      });
      group.appendChild(ul);
      steps.appendChild(group);
    });
    if (hasLinks) frag.appendChild(steps);

    // 前後ナビゲーション
    frag.appendChild(buildPrevNext(topic));
    return frag;
  }

  /* ------- 日本語コンテンツセクション ------- */
  function buildContentJa(c) {
    const wrap = el('div', { class: 'content-ja' });

    // 詳細解説
    if (c.detailJa) {
      wrap.appendChild(el('div', { class: 'content-ja__section' }, [
        el('h3', { class: 'content-ja__title', text: '📘 詳細解説' }),
        buildRichText(c.detailJa),
      ]));
    }

    // 3カラムグリッド（重要ポイント / 学べること / ユースケース）
    const grid = el('div', { class: 'content-ja__grid' });

    if (c.keyPoints && c.keyPoints.length) {
      grid.appendChild(buildListCard('🔑 重要ポイント', c.keyPoints, 'key'));
    }
    if (c.whatYouLearn && c.whatYouLearn.length) {
      grid.appendChild(buildListCard('✅ 学べること', c.whatYouLearn, 'learn'));
    }
    if (c.useCases && c.useCases.length) {
      grid.appendChild(buildListCard('💼 ユースケース', c.useCases, 'use'));
    }

    if (grid.children.length) wrap.appendChild(grid);
    return wrap;
  }

  function buildListCard(title, items, mod) {
    const card = el('div', { class: `cj-card cj-card--${mod}` });
    card.appendChild(el('h4', { class: 'cj-card__title', text: title }));
    const ul = el('ul', { class: 'cj-card__list' });
    items.forEach((item) => ul.appendChild(el('li', { text: item })));
    card.appendChild(ul);
    return card;
  }

  /* **太字** を <strong> に変換する軽量レンダラー（XSS安全・限定的markdown） */
  function buildRichText(text) {
    const p = document.createElement('p');
    p.className = 'content-ja__detail';
    // **text** → <strong>text</strong> のみ許可、他は textContent として処理
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    parts.forEach((part) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const strong = document.createElement('strong');
        strong.textContent = part.slice(2, -2);
        p.appendChild(strong);
      } else {
        p.appendChild(document.createTextNode(part));
      }
    });
    return p;
  }

  function buildStatusControls(topic, status) {
    const wrap = el('div', { class: 'modal__status' });
    const defs = [
      { s: 'in_progress', label: '学習を開始', cls: 'btn--warning' },
      { s: 'completed', label: '完了にする', cls: 'btn--success' },
      { s: 'not_started', label: '未着手に戻す', cls: 'btn--ghost' },
    ];
    defs.forEach((d) => {
      const active = status === d.s;
      wrap.appendChild(el('button', {
        class: `btn ${d.cls}${active ? ' is-active' : ''}`,
        attrs: { type: 'button', 'aria-pressed': String(active) },
        text: active ? `${d.label}（現在）` : d.label,
        on: {
          click: () => {
            Progress.update(topic.id, d.s);
            document.dispatchEvent(new CustomEvent('progress-changed',
              { detail: { id: topic.id, status: d.s } }));
            // モーダル内も再描画
            const body = document.getElementById('modal-body');
            body.textContent = '';
            body.appendChild(buildModalContent(topic));
          },
        },
      }));
    });
    return wrap;
  }

  function buildPrevNext(topic) {
    const nav = el('div', { class: 'modal__nav' });
    const prevId = topic.prerequisites[0];
    const nextId = (NEXT_TOPICS[topic.id] || [])[0];

    nav.appendChild(navButton('←', prevId, 'prev'));
    nav.appendChild(navButton('→', nextId, 'next'));
    return nav;
  }

  function navButton(symbol, id, dir) {
    if (!id || !TOPICS[id]) {
      return el('span', { class: 'modal__nav-empty' });
    }
    const t = TOPICS[id];
    const labelText = dir === 'prev' ? `${symbol} ${id} ${t.titleJa}` : `${id} ${t.titleJa} ${symbol}`;
    return el('button', {
      class: `modal__nav-btn modal__nav-btn--${dir}`,
      attrs: { type: 'button' },
      text: labelText,
      on: { click: () => openModal(id) },
    });
  }

  /* ===================================================================
   * ウェルカムモーダル（初回 / 属性未設定）
   * =================================================================== */
  function openWelcome(onPick) {
    const overlay = document.getElementById('welcome-overlay');
    const body = document.getElementById('welcome-body');
    body.textContent = '';

    body.appendChild(el('h2', { class: 'welcome__title', text: 'ようこそ 👋' }));
    body.appendChild(el('p', { class: 'welcome__lead',
      text: 'あなたに合った学習ルートを表示します。当てはまるものを選んでください。' }));

    const grid = el('div', { class: 'welcome__grid' });
    Object.values(USER_TYPES).forEach((ut) => {
      grid.appendChild(el('button', {
        class: 'welcome__card',
        attrs: { type: 'button' },
        on: { click: () => { onPick(ut.id); closeWelcome(); } },
      }, [
        el('span', { class: 'welcome__icon', text: ut.icon }),
        el('span', { class: 'welcome__card-title', text: ut.labelJa }),
        el('span', { class: 'welcome__card-desc', text: ut.descJa }),
      ]));
    });
    body.appendChild(grid);

    body.appendChild(el('button', {
      class: 'welcome__skip',
      attrs: { type: 'button' },
      text: 'あとで選ぶ（すべて表示）',
      on: { click: () => { onPick('developer'); closeWelcome(); } },
    }));

    overlay.hidden = false;
    document.body.classList.add('no-scroll');
  }

  function closeWelcome() {
    document.getElementById('welcome-overlay').hidden = true;
    document.body.classList.remove('no-scroll');
  }

  /* ------- 属性タブのアクティブ表示更新 ------- */
  function syncUserTypeTabs(userType) {
    document.querySelectorAll('[data-usertype]').forEach((btn) => {
      const active = btn.dataset.usertype === userType;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  function syncCategoryTabs(category) {
    document.querySelectorAll('[data-category]').forEach((btn) => {
      const active = btn.dataset.category === category;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  return {
    renderCards, renderFlow, renderDashboard,
    openModal, closeModal,
    openWelcome, closeWelcome,
    syncUserTypeTabs, syncCategoryTabs,
  };
})();

window.UI = UI;
