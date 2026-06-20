/* =====================================================================
 * cookie.js — Cookie ユーティリティ・進捗管理・属性管理
 *
 * セキュリティ:
 *   - SameSite=Strict で CSRF 対策
 *   - 値は encodeURIComponent でエスケープ
 *   - 進捗データと属性のみ保存（個人情報・認証情報は一切保存しない）
 * ===================================================================== */

'use strict';

/* ------- 許可される列挙値（入力バリデーション） ------- */
const VALID_USER_TYPES = ['beginner', 'developer', 'enterprise'];
const VALID_STATUSES = ['not_started', 'in_progress', 'completed'];

/* ------- Cookie 基本操作 ------- */
const CookieManager = {
  set(name, value, days = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const raw = typeof value === 'object' ? JSON.stringify(value) : String(value);
    document.cookie =
      `${encodeURIComponent(name)}=${encodeURIComponent(raw)}` +
      `; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  },

  get(name) {
    const key = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(key)) {
        const raw = decodeURIComponent(c.substring(key.length));
        try {
          return JSON.parse(raw);
        } catch {
          return raw;
        }
      }
    }
    return null;
  },

  delete(name) {
    document.cookie =
      `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
  },
};

/* ------- Cookie 名定数 ------- */
const COOKIE = {
  userType: 'anthro_user_type',
  progress: 'anthro_progress',
  lastVisited: 'anthro_last_visited',
  activeCategory: 'anthro_active_category',
  visitedAt: 'anthro_visited_at',
};

/* ------- 進捗管理 ------- */
const Progress = {
  /** 全トピックの状態オブジェクトを取得（不正データは弾く） */
  getAll() {
    const data = CookieManager.get(COOKIE.progress);
    if (!data || typeof data !== 'object') return {};
    const clean = {};
    Object.keys(data).forEach((id) => {
      if (window.AppData.TOPICS[id] && VALID_STATUSES.includes(data[id])) {
        clean[id] = data[id];
      }
    });
    return clean;
  },

  update(topicId, status) {
    if (!window.AppData.TOPICS[topicId]) return;
    if (!VALID_STATUSES.includes(status)) return;
    const all = this.getAll();
    all[topicId] = status;
    CookieManager.set(COOKIE.progress, all);
  },

  getStatus(topicId) {
    return this.getAll()[topicId] || 'not_started';
  },

  /** 状態をサイクル：未着手→学習中→完了→未着手 */
  cycle(topicId) {
    const order = ['not_started', 'in_progress', 'completed'];
    const current = this.getStatus(topicId);
    const next = order[(order.indexOf(current) + 1) % order.length];
    this.update(topicId, next);
    return next;
  },

  /** 全体完了率（%） */
  getCompletionRate() {
    const all = this.getAll();
    const total = Object.keys(window.AppData.TOPICS).length;
    const done = Object.values(all).filter((s) => s === 'completed').length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  },

  /** カテゴリ別の {done, total} を返す */
  getCategoryStats(categoryId) {
    const all = this.getAll();
    const topics = Object.values(window.AppData.TOPICS)
      .filter((t) => t.category === categoryId);
    const done = topics.filter((t) => all[t.id] === 'completed').length;
    return { done, total: topics.length };
  },

  reset() {
    CookieManager.delete(COOKIE.progress);
    CookieManager.delete(COOKIE.userType);
    CookieManager.delete(COOKIE.lastVisited);
    CookieManager.delete(COOKIE.activeCategory);
  },
};

/* ------- ユーザー属性管理 ------- */
const UserPrefs = {
  getUserType() {
    const t = CookieManager.get(COOKIE.userType);
    return VALID_USER_TYPES.includes(t) ? t : null;
  },
  setUserType(type) {
    if (!VALID_USER_TYPES.includes(type)) return;
    CookieManager.set(COOKIE.userType, type);
  },

  getLastVisited() {
    const id = CookieManager.get(COOKIE.lastVisited);
    return window.AppData.TOPICS[id] ? id : null;
  },
  setLastVisited(topicId) {
    if (window.AppData.TOPICS[topicId]) {
      CookieManager.set(COOKIE.lastVisited, topicId, 30);
    }
  },

  getActiveCategory() {
    const c = CookieManager.get(COOKIE.activeCategory);
    return window.AppData.CATEGORIES[c] ? c : 'all';
  },
  setActiveCategory(categoryId) {
    if (window.AppData.CATEGORIES[categoryId]) {
      // セッション Cookie（expires 未指定）
      document.cookie =
        `${encodeURIComponent(COOKIE.activeCategory)}=${encodeURIComponent(categoryId)}` +
        `; path=/; SameSite=Strict`;
    }
  },

  /** 初回訪問判定。未訪問なら訪問日を記録して true を返す */
  isFirstVisit() {
    const visited = CookieManager.get(COOKIE.visitedAt);
    return !visited;
  },
  markVisited() {
    if (!CookieManager.get(COOKIE.visitedAt)) {
      CookieManager.set(COOKIE.visitedAt, new Date().toISOString(), 3650);
    }
  },
};

window.AppCookie = { CookieManager, Progress, UserPrefs, COOKIE };
