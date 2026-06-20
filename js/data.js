/* =====================================================================
 * data.js — トピックデータ・学習フロー・カテゴリ定義
 * Claude School
 *
 * モデル情報は 2026-06 時点の最新ラインナップ
 * （Fable 5 / Opus 4.8 / Sonnet 4.6 / Haiku 4.5）に基づいて記述。
 * ===================================================================== */

'use strict';

/* ------- カテゴリ定義 ------- */
const CATEGORIES = {
  all: { id: 'all', labelJa: 'すべて', icon: '📚' },
  build: { id: 'build', labelJa: 'Claudeで開発する', icon: '🛠️' },
  work: { id: 'work', labelJa: '仕事で使う', icon: '💼' },
  personal: { id: 'personal', labelJa: '個人で使う', icon: '🌱' },
};

/* ------- ユーザー属性定義 ------- */
const USER_TYPES = {
  beginner: { id: 'beginner', labelJa: '初心者・個人', icon: '🌱',
    descJa: 'Claude を仕事や個人利用で使い始めたい方向け' },
  developer: { id: 'developer', labelJa: '開発者', icon: '👩‍💻',
    descJa: 'API や MCP を使って開発したいエンジニア向け' },
  enterprise: { id: 'enterprise', labelJa: '企業・チーム', icon: '🏢',
    descJa: '組織へ Claude を導入・展開したい担当者向け' },
};

/* ------- 推奨学習フロー（ユーザー属性別） ------- */
const LEARNING_FLOWS = {
  beginner: ['C-01', 'C-02', 'A-10', 'C-03', 'B-01'],
  developer: ['A-01', 'A-02', 'A-10', 'A-06', 'A-07', 'A-03', 'A-05'],
  enterprise: ['B-01', 'B-02', 'B-03', 'A-10', 'A-03'],
};

/* ------- 難易度ラベル ------- */
const DIFFICULTY_LABELS = { 1: '★☆☆', 2: '★★☆', 3: '★★★' };

/* ------- 学習ステップ表示順とラベル ------- */
const STEP_LABELS = {
  getStarted: { ja: 'はじめに', icon: '🚀' },
  documentation: { ja: 'ドキュメント', icon: '📖' },
  insights: { ja: 'インサイト', icon: '💡' },
  courses: { ja: 'コース', icon: '🎓' },
};

/* ------- トピックデータ ------- */
const TOPICS = {
  /* ===== カテゴリ A: Claudeで開発する ===== */
  'A-01': {
    id: 'A-01', category: 'build',
    titleJa: '最新Claudeモデルを理解する',
    titleEn: 'Claude Models (Opus 4.8 / Sonnet 4.6)',
    descJa: 'Opus 4.8・Sonnet 4.6・Haiku 4.5・Fable 5 の違いと選び方、最新機能を学びます。',
    difficulty: 1, estimatedMinutes: 20, prerequisites: [], icon: '🔆',
    links: {
      getStarted: [
        { labelJa: 'モデル概要・比較チャート', url: 'https://docs.anthropic.com/en/docs/about-claude/models/overview' },
        { labelJa: 'モデル移行チェックリスト', url: 'https://docs.anthropic.com/en/docs/about-claude/models/migrating-to-claude-4' },
      ],
      documentation: [
        { labelJa: 'モデル選択ガイド', url: 'https://docs.anthropic.com/en/docs/about-claude/models/choosing-a-model' },
        { labelJa: 'リリースノート', url: 'https://docs.claude.com/en/release-notes/overview' },
      ],
      insights: [
        { labelJa: 'Claude 4 発表ブログ（英語）', url: 'https://www.anthropic.com/news/claude-4' },
      ],
    },
    learningFlow: ['developer', 'enterprise'],
  },
  'A-02': {
    id: 'A-02', category: 'build',
    titleJa: 'API と SDK の使い方',
    titleEn: 'APIs & SDKs',
    descJa: 'Python・TypeScript など各言語向け SDK と Messages API の使い方を習得します。',
    difficulty: 2, estimatedMinutes: 40, prerequisites: ['A-01'], icon: '🔌',
    links: {
      getStarted: [
        { labelJa: 'Python SDK', url: 'https://docs.anthropic.com/en/api/client-sdks#python' },
        { labelJa: 'TypeScript SDK', url: 'https://docs.anthropic.com/en/api/client-sdks#typescript' },
        { labelJa: 'Messages API を理解する', url: 'https://docs.anthropic.com/en/api/messages' },
      ],
      documentation: [
        { labelJa: 'Files API でファイル管理', url: 'https://docs.anthropic.com/en/docs/build-with-claude/files' },
        { labelJa: 'PDF サポート', url: 'https://docs.anthropic.com/en/docs/build-with-claude/pdf-support' },
      ],
      courses: [
        { labelJa: 'Anthropic API を使った開発コース', url: 'https://anthropic.skilljar.com/claude-with-the-anthropic-api' },
      ],
    },
    learningFlow: ['developer'],
  },
  'A-03': {
    id: 'A-03', category: 'build',
    titleJa: 'AIエージェントを構築する',
    titleEn: 'Agents',
    descJa: 'ツールを自律的に使い、複数ステップのタスクをこなす AI エージェントの設計・構築を学びます。',
    difficulty: 3, estimatedMinutes: 70, prerequisites: ['A-07'], icon: '🤖',
    links: {
      getStarted: [
        { labelJa: 'Claude Agent SDK 概要', url: 'https://docs.anthropic.com/en/api/agent-sdk/overview' },
        { labelJa: 'エージェント構築のクックブック', url: 'https://github.com/anthropics/anthropic-cookbook' },
      ],
      documentation: [
        { labelJa: 'エフェクティブなエージェントの設計', url: 'https://www.anthropic.com/research/building-effective-agents' },
      ],
      insights: [
        { labelJa: 'Building effective agents（英語ブログ）', url: 'https://www.anthropic.com/engineering/building-effective-agents' },
      ],
    },
    learningFlow: ['developer', 'enterprise'],
  },
  'A-04': {
    id: 'A-04', category: 'build',
    titleJa: 'Skills（スキル）機能',
    titleEn: 'Skills',
    descJa: '再利用可能な手順書・スクリプトをスキルとしてパッケージ化し、Claude に専門能力を持たせます。',
    difficulty: 2, estimatedMinutes: 35, prerequisites: ['A-02'], icon: '🧩',
    links: {
      getStarted: [
        { labelJa: 'Agent Skills 入門', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/overview' },
      ],
      documentation: [
        { labelJa: 'スキルの作成方法', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills/getting-started' },
      ],
    },
    learningFlow: ['developer'],
  },
  'A-05': {
    id: 'A-05', category: 'build',
    titleJa: 'MCP（モデルコンテキストプロトコル）',
    titleEn: 'Model Context Protocol',
    descJa: 'AI とツールを安全に接続する標準プロトコル MCP の概念・実装方法を学びます。',
    difficulty: 3, estimatedMinutes: 60, prerequisites: ['A-02'], icon: '🔗',
    links: {
      getStarted: [
        { labelJa: 'Claude Desktop で MCP を設定', url: 'https://modelcontextprotocol.io/quickstart/user' },
        { labelJa: 'Anthropic 公式 MCP サーバー一覧', url: 'https://github.com/modelcontextprotocol/servers' },
      ],
      documentation: [
        { labelJa: 'MCP ドキュメント', url: 'https://modelcontextprotocol.io/introduction' },
      ],
      courses: [
        { labelJa: 'MCP 入門コース', url: 'https://anthropic.skilljar.com/introduction-to-model-context-protocol' },
        { labelJa: 'MCP 応用コース', url: 'https://anthropic.skilljar.com/model-context-protocol-advanced-topics' },
      ],
    },
    learningFlow: ['developer'],
  },
  'A-06': {
    id: 'A-06', category: 'build',
    titleJa: 'Claude Code で開発効率を上げる',
    titleEn: 'Claude Code',
    descJa: 'ターミナルで動く公式エージェント型コーディングツール Claude Code の使い方を習得します。',
    difficulty: 2, estimatedMinutes: 45, prerequisites: ['A-02'], icon: '⌨️',
    links: {
      getStarted: [
        { labelJa: 'Claude Code クイックスタート', url: 'https://docs.anthropic.com/en/docs/claude-code/quickstart' },
        { labelJa: 'Claude Code 概要', url: 'https://docs.anthropic.com/en/docs/claude-code/overview' },
      ],
      documentation: [
        { labelJa: 'CLAUDE.md とメモリ設定', url: 'https://docs.anthropic.com/en/docs/claude-code/memory' },
        { labelJa: 'MCP との連携', url: 'https://docs.anthropic.com/en/docs/claude-code/mcp' },
      ],
      insights: [
        { labelJa: 'Claude Code ベストプラクティス', url: 'https://www.anthropic.com/engineering/claude-code-best-practices' },
      ],
    },
    learningFlow: ['developer'],
  },
  'A-07': {
    id: 'A-07', category: 'build',
    titleJa: 'ツール連携（Tool Use）',
    titleEn: 'Tool Use',
    descJa: 'Claude に外部関数・API を呼び出させる Tool Use（Function Calling）の仕組みを学びます。',
    difficulty: 3, estimatedMinutes: 50, prerequisites: ['A-02'], icon: '🛠️',
    links: {
      getStarted: [
        { labelJa: 'Tool Use 概要', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview' },
      ],
      documentation: [
        { labelJa: 'ツール定義のベストプラクティス', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use/implement-tool-use' },
        { labelJa: 'トークン効率の良いツール利用', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use/token-efficient-tool-use' },
      ],
      courses: [
        { labelJa: 'Tool Use コース', url: 'https://anthropic.skilljar.com/tool-use-with-claude' },
      ],
    },
    learningFlow: ['developer'],
  },
  'A-08': {
    id: 'A-08', category: 'build',
    titleJa: '拡張思考（Extended Thinking）',
    titleEn: 'Extended Thinking',
    descJa: 'モデルに段階的に深く推論させる拡張思考を使い、複雑な問題の精度を高めます。',
    difficulty: 3, estimatedMinutes: 40, prerequisites: ['A-02'], icon: '🧠',
    links: {
      getStarted: [
        { labelJa: 'Extended Thinking 概要', url: 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking' },
      ],
      documentation: [
        { labelJa: '拡張思考のヒント', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/extended-thinking-tips' },
      ],
    },
    learningFlow: ['developer'],
  },
  'A-09': {
    id: 'A-09', category: 'build',
    titleJa: 'RAG（検索拡張生成）',
    titleEn: 'Retrieval Augmented Generation',
    descJa: 'Claude の応答に外部データを組み合わせる手法。社内文書検索やナレッジベース構築に活用します。',
    difficulty: 3, estimatedMinutes: 55, prerequisites: ['A-02'], icon: '🔍',
    links: {
      getStarted: [
        { labelJa: '顧客サポートエージェントを RAG で構築', url: 'https://github.com/anthropics/anthropic-cookbook/tree/main/skills/retrieval_augmented_generation' },
        { labelJa: 'Voyage AI で埋め込みを使う', url: 'https://docs.anthropic.com/en/docs/build-with-claude/embeddings' },
      ],
      documentation: [
        { labelJa: 'Anthropic 埋め込みドキュメント', url: 'https://docs.anthropic.com/en/docs/build-with-claude/embeddings' },
      ],
      insights: [
        { labelJa: 'コンテキスト検索（Contextual Retrieval）', url: 'https://www.anthropic.com/news/contextual-retrieval' },
      ],
    },
    learningFlow: ['developer'],
  },
  'A-10': {
    id: 'A-10', category: 'build',
    titleJa: 'プロンプトエンジニアリング',
    titleEn: 'Prompt Engineering',
    descJa: 'Claude のパフォーマンスを最大化する効果的なプロンプト作成テクニックを習得します。',
    difficulty: 2, estimatedMinutes: 45, prerequisites: [], icon: '💬',
    links: {
      getStarted: [
        { labelJa: 'インタラクティブチュートリアル', url: 'https://github.com/anthropics/courses/blob/master/prompt_engineering_interactive_tutorial/README.md' },
        { labelJa: '実世界のプロンプティング演習', url: 'https://github.com/anthropics/courses/blob/master/real_world_prompting/README.md' },
        { labelJa: 'プロンプトジェネレーターツール', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-generator' },
      ],
      documentation: [
        { labelJa: 'プロンプトエンジニアリング概要', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview' },
      ],
      insights: [
        { labelJa: 'Anthropic プロンプト勉強会動画', url: 'https://www.youtube.com/watch?v=T9aRN5JkmL8' },
      ],
    },
    learningFlow: ['beginner', 'developer', 'enterprise'],
  },
  'A-11': {
    id: 'A-11', category: 'build',
    titleJa: '評価（Evals）の仕組み',
    titleEn: 'Evaluations',
    descJa: 'プロンプトやモデルの品質を体系的に測定・改善する評価（Evals）の設計手法を学びます。',
    difficulty: 3, estimatedMinutes: 50, prerequisites: ['A-10'], icon: '📊',
    links: {
      getStarted: [
        { labelJa: '評価の作成と利用', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests' },
      ],
      documentation: [
        { labelJa: 'コンソールでの評価ツール', url: 'https://docs.anthropic.com/en/docs/test-and-evaluate/eval-tool' },
      ],
    },
    learningFlow: ['developer'],
  },
  'A-12': {
    id: 'A-12', category: 'build',
    titleJa: 'プロンプトキャッシング',
    titleEn: 'Prompt Caching',
    descJa: '繰り返し使うコンテキストをキャッシュし、レイテンシとコストを大幅に削減する手法を学びます。',
    difficulty: 2, estimatedMinutes: 30, prerequisites: ['A-10'], icon: '⚡',
    links: {
      getStarted: [
        { labelJa: 'プロンプトキャッシング概要', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching' },
      ],
      documentation: [
        { labelJa: 'キャッシュの最適化', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching#cache-limitations' },
      ],
    },
    learningFlow: ['developer'],
  },
  'A-13': {
    id: 'A-13', category: 'build',
    titleJa: 'ビジョン（画像理解）',
    titleEn: 'Vision',
    descJa: '画像・図表・スクリーンショットを Claude に理解させるビジョン機能の使い方を学びます。',
    difficulty: 2, estimatedMinutes: 30, prerequisites: ['A-09'], icon: '👁️',
    links: {
      getStarted: [
        { labelJa: 'Vision 概要', url: 'https://docs.anthropic.com/en/docs/build-with-claude/vision' },
      ],
      documentation: [
        { labelJa: '画像入力のベストプラクティス', url: 'https://docs.anthropic.com/en/docs/build-with-claude/vision#evaluate-image-size' },
      ],
    },
    learningFlow: ['developer'],
  },
  'A-14': {
    id: 'A-14', category: 'build',
    titleJa: 'コンピューターの操作（Computer Use）',
    titleEn: 'Computer Use',
    descJa: 'Claude に画面を見せてマウス・キーボードを操作させる Computer Use の仕組みを学びます。',
    difficulty: 3, estimatedMinutes: 50, prerequisites: ['A-07'], icon: '🖥️',
    links: {
      getStarted: [
        { labelJa: 'Computer Use 概要', url: 'https://docs.anthropic.com/en/docs/build-with-claude/computer-use' },
      ],
      documentation: [
        { labelJa: 'リファレンス実装', url: 'https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo' },
      ],
    },
    learningFlow: ['developer'],
  },
  'A-15': {
    id: 'A-15', category: 'build',
    titleJa: 'ハッカソン向けスターターガイド',
    titleEn: 'Hackathon Hacker Guide',
    descJa: '短時間で Claude を使ったプロトタイプを作るためのスターターキットとヒント集です。',
    difficulty: 1, estimatedMinutes: 25, prerequisites: [], icon: '🏁',
    links: {
      getStarted: [
        { labelJa: 'Anthropic Quickstarts', url: 'https://github.com/anthropics/anthropic-quickstarts' },
      ],
      documentation: [
        { labelJa: 'はじめての API コール', url: 'https://docs.anthropic.com/en/docs/initial-setup' },
      ],
    },
    learningFlow: ['developer'],
  },

  /* ===== カテゴリ B: 仕事で Claude を使う ===== */
  'B-01': {
    id: 'B-01', category: 'work',
    titleJa: 'チームへの Claude 導入',
    titleEn: 'Claude for Teams',
    descJa: 'チームで Claude を使い始めるためのアカウント設定・利用ルール・基本ワークフローを学びます。',
    difficulty: 1, estimatedMinutes: 25, prerequisites: [], icon: '👥',
    links: {
      getStarted: [
        { labelJa: 'Claude for Work 概要', url: 'https://www.anthropic.com/team' },
      ],
      documentation: [
        { labelJa: 'チームプランのヘルプ', url: 'https://support.anthropic.com/en/collections/4078531' },
      ],
    },
    learningFlow: ['beginner', 'enterprise'],
  },
  'B-02': {
    id: 'B-02', category: 'work',
    titleJa: '業務プロセスの自動化',
    titleEn: 'Automating Workflows',
    descJa: '定型業務・文書処理・分析などを Claude で自動化するユースケースと設計手法を学びます。',
    difficulty: 2, estimatedMinutes: 40, prerequisites: ['B-01'], icon: '⚙️',
    links: {
      getStarted: [
        { labelJa: 'ユースケースガイド', url: 'https://docs.anthropic.com/en/docs/about-claude/use-case-guides/overview' },
      ],
      documentation: [
        { labelJa: 'コンテンツ生成・要約', url: 'https://docs.anthropic.com/en/docs/about-claude/use-case-guides/content-moderation' },
      ],
    },
    learningFlow: ['enterprise'],
  },
  'B-03': {
    id: 'B-03', category: 'work',
    titleJa: 'エンタープライズ展開のベストプラクティス',
    titleEn: 'Enterprise Deployment',
    descJa: 'セキュリティ・ガバナンス・スケールを考慮した組織規模での Claude 展開手法を学びます。',
    difficulty: 3, estimatedMinutes: 50, prerequisites: ['B-02'], icon: '🏢',
    links: {
      getStarted: [
        { labelJa: 'Claude for Enterprise', url: 'https://www.anthropic.com/enterprise' },
      ],
      documentation: [
        { labelJa: 'セキュリティとコンプライアンス', url: 'https://trust.anthropic.com/' },
      ],
    },
    learningFlow: ['enterprise'],
  },

  /* ===== カテゴリ C: 個人で Claude を使う ===== */
  'C-01': {
    id: 'C-01', category: 'personal',
    titleJa: 'Claude の基本的な使い方',
    titleEn: 'Getting Started with Claude',
    descJa: 'Claude.ai でのチャットの始め方・会話のコツ・できることの全体像をやさしく学びます。',
    difficulty: 1, estimatedMinutes: 15, prerequisites: [], icon: '🌱',
    links: {
      getStarted: [
        { labelJa: 'Claude.ai を使ってみる', url: 'https://claude.ai/' },
        { labelJa: 'はじめてのガイド', url: 'https://support.anthropic.com/en/collections/4078534-getting-started' },
      ],
    },
    learningFlow: ['beginner'],
  },
  'C-02': {
    id: 'C-02', category: 'personal',
    titleJa: '日常タスクでの活用',
    titleEn: 'Everyday Tasks',
    descJa: 'メール作成・要約・調べ物・翻訳など、日々の作業を Claude で効率化する方法を学びます。',
    difficulty: 1, estimatedMinutes: 20, prerequisites: ['C-01'], icon: '✅',
    links: {
      getStarted: [
        { labelJa: '活用のヒント集', url: 'https://support.anthropic.com/en/collections/4078534-getting-started' },
      ],
    },
    learningFlow: ['beginner'],
  },
  'C-03': {
    id: 'C-03', category: 'personal',
    titleJa: '創作・学習への応用',
    titleEn: 'Creative & Learning',
    descJa: '文章作成・アイデア出し・学習サポートなど、創造的・学習用途での活用方法を学びます。',
    difficulty: 2, estimatedMinutes: 25, prerequisites: ['C-02'], icon: '🎨',
    links: {
      getStarted: [
        { labelJa: 'プロンプトライブラリ', url: 'https://docs.anthropic.com/en/prompt-library/library' },
      ],
      insights: [
        { labelJa: 'Projects 機能の活用', url: 'https://support.anthropic.com/en/articles/9517075-what-are-projects' },
      ],
    },
    learningFlow: ['beginner'],
  },
};

/* ------- 依存関係から「次のトピック」を逆引きするマップを生成 ------- */
const NEXT_TOPICS = (() => {
  const map = {};
  Object.values(TOPICS).forEach((t) => {
    t.prerequisites.forEach((pre) => {
      if (!map[pre]) map[pre] = [];
      map[pre].push(t.id);
    });
  });
  return map;
})();

/* ------- グローバル公開 ------- */
window.AppData = {
  CATEGORIES,
  USER_TYPES,
  LEARNING_FLOWS,
  DIFFICULTY_LABELS,
  STEP_LABELS,
  TOPICS,
  NEXT_TOPICS,
};
