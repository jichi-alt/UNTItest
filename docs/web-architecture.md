# UNTI 网页架构规划

## 一、项目结构

```
unti/
├── public/
│   ├── images/              # 静态图片资源
│   │   ├── home-page.png    # 首页形象图
│   │   ├── KING.png
│   │   ├── NULL.png
│   │   ├── FIRE.png
│   │   ├── FLOP.png
│   │   ├── PURE.png
│   │   ├── OOPS.png
│   │   ├── WILD.png
│   │   ├── FREE.png         # SSR隐藏款
│   │   └── ALIEN.png        # UR隐藏款
│   └── fonts/               # 中文字体（如需自定义）
├── src/
│   ├── components/          # 可复用组件
│   │   ├── Button.tsx       # 扁平描边风格按钮
│   │   ├── Card.tsx         # 题目卡片
│   │   ├── ProgressTrack.tsx # 校园跑道进度条
│   │   ├── ScoreDisplay.tsx # 分数展示组件
│   │   └── SealStamp.tsx    # 红色印章SVG
│   ├── pages/               # 页面组件
│   │   ├── LandingPage.tsx  # 首页
│   │   ├── QuizPage.tsx     # 答题页
│   │   ├── LoadingPage.tsx  # 加载页
│   │   └── ResultPage.tsx   # 结果页（含海报）
│   ├── hooks/               # 自定义Hooks
│   │   ├── useQuiz.ts       # 答题状态管理
│   │   ├── usePersonality.ts # 人格计算
│   │   └── useImagePreload.ts # 图片预加载
│   ├── utils/
│   │   ├── engine.ts        # 评分引擎
│   │   ├── questions.ts     # 题库数据
│   │   └── personalities.ts # 人格文案
│   ├── styles/
│   │   └── globals.css      # 全局样式（扁平描边风）
│   └── types/
│       └── index.ts         # TypeScript类型定义
├── test/
│   └── engine.test.js       # 评分系统测试
└── docs/
    └── web-architecture.md  # 本文档
```

## 二、页面流程设计

```
┌─────────────────────────────────────────────────────────────┐
│                        用户访问                              │
└───────────────────────┬─────────────────────────────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  LandingPage (首页)                                         │
│  ├── Logo + 标题 "UNTI 大学生精神状态鉴定"                    │
│  ├── 简笔画茫然小人 (Home page.png)                         │
│  └── 开始测试按钮 (弹性动画入场)                             │
└───────────────────────┬─────────────────────────────────────┘
                        │ 点击
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  QuizPage (答题页)                                          │
│  ├── 顶部：校园跑道进度条 + 火柴人                          │
│  │   └── 气泡：跑路中 3/20                                  │
│  ├── 中间：题目卡片 (当前题目)                               │
│  │   └── 题目 + 4个选项                                     │
│  └── 交互：滑动切换 (左出右入)                               │
└───────────────────────┬─────────────────────────────────────┘
                        │ 答完20题
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  LoadingPage (加载页)                                       │
│  ├── 3秒过渡动画                                            │
│  ├── 随机趣味文案                                           │
│  └── 预加载结果页所需图片                                    │
└───────────────────────┬─────────────────────────────────────┘
                        │ 3秒后自动跳转
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  ResultPage (结果页/海报)                                   │
│  ├── Header: 机密档案卡                                     │
│  │   ├── 受测者代号: 匿名观察对象                           │
│  │   ├── 档案编号: UNTI-XXXX (随机4位)                      │
│  │   └── 红色印章: 【鉴定完毕】                              │
│  ├── Visual: 人格插画 (9张PNG之一)                          │
│  ├── Title: 代号 + 人格名 (如 👑 六边形战士)                │
│  ├── 五维分数展示 (替代雷达图)                               │
│  │   └── A: ●●●○○  E: ●●○○○  S: ●●●●○  W: ●○○○○  D: ●●○○○
│  ├── 锐评 + 判词正文                                        │
│  └── Footer: 长按保存 / 再测一次                            │
└─────────────────────────────────────────────────────────────┘
```

## 三、关键组件设计

### 3.1 扁平描边风格规范

```css
/* 核心视觉规范 - Tailwind CSS */
:root {
  --bg-primary: #F7F7F5;      /* 米灰背景 */
  --text-primary: #2C2C2C;     /* 深炭黑 */
  --accent-blue: #002FA7;      /* 克莱因蓝 */
  --accent-orange: #FF5722;    /* 活力橙 */
  --border-width: 2px;
  --border-radius: 8px;
  --shadow-hard: 4px 4px 0px #2C2C2C;  /* 纯黑硬阴影 */
}

/* 按钮样式 */
.btn-outline {
  @apply border-2 border-[#2C2C2C] rounded-lg;
  @apply shadow-[4px_4px_0px_#2C2C2C];
  @apply active:translate-x-[2px] active:translate-y-[2px];
  @apply active:shadow-[2px_2px_0px_#2C2C2C];
  @apply transition-all duration-150;
}

/* 卡片样式 */
.card-outline {
  @apply bg-white border-2 border-[#2C2C2C] rounded-lg;
  @apply shadow-[4px_4px_0px_#2C2C2C];
}
```

### 3.2 校园跑道进度条

```tsx
// ProgressTrack.tsx
interface ProgressTrackProps {
  current: number;      // 当前题号 (0-19)
  total: number;        // 总题数 20
}

// 视觉结构:
// ├──────────────────────────────────────┤  ← 跑道底线 (2px深色线)
//      🏃 跑路中 3/20                     ← 火柴人 + 气泡
// 
// 实现: CSS transform translateX 让火柴人平滑移动
// 进度计算: (current / (total - 1)) * 100%
```

### 3.3 五维分数展示（替代雷达图）

```tsx
// ScoreDisplay.tsx - 简洁的条形图展示
interface ScoreDisplayProps {
  scores: {
    A: number;  // 执行 (Action)
    E: number;  // 内耗 (Emotion)
    S: number;  // 社交 (Social)
    W: number;  // 发疯 (Wild)
    D: number;  // 死线 (Deadline)
  };
}

// 视觉呈现:
// ┌─────────────────────────────────┐
// │  执行(A) ████████░░  8          │
// │  内耗(E) ████░░░░░░  4          │
// │  社交(S) ██████░░░░  6          │
// │  发疯(W) ██████████  10         │
// │  死线(D) ██░░░░░░░░  2          │
// └─────────────────────────────────┘
// 
// 最大刻度: 根据实际分数最大值动态调整，或固定到15
```

### 3.4 图片资源使用方案

| 图片 | 用途 | 尺寸建议 |
|------|------|----------|
| `home-page.png` | 首页形象图 | 居中展示，宽度70% |
| `KING.png` ~ `ALIEN.png` | 结果页人格插画 | 宽度80%，下方留白 |

**预加载策略**：
```tsx
// LoadingPage 阶段预加载所有人格图
const personalityImages = [
  'KING', 'NULL', 'FIRE', 'FLOP', 
  'PURE', 'OOPS', 'WILD', 'FREE', 'ALIEN'
];

// 使用 Promise.all 并行加载
useEffect(() => {
  Promise.all(
    personalityImages.map(name => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.src = `/images/${name}.png`;
      });
    })
  );
}, []);
```

## 四、数据结构

```typescript
// types/index.ts

// 五维分数
interface Scores {
  A: number;  // Action 执行
  E: number;  // Emotion 内耗
  S: number;  // Social 社交
  W: number;  // Wild 发疯
  D: number;  // Deadline 死线
}

// 选项
interface Option {
  text: string;
  scores: Partial<Scores> | { UR?: boolean };
}

// 题目
interface Question {
  id: number;
  question: string;
  options: Option[];
}

// 人格定义
type PersonalityType = 
  | 'KING' | 'NULL' | 'FIRE' | 'FLOP' 
  | 'PURE' | 'OOPS' | 'WILD' | 'FREE' | 'ALIEN';

interface Personality {
  type: PersonalityType;
  name: string;
  emoji: string;
  rare: 'N' | 'SSR' | 'UR';
  review: string;      // 锐评
  verdict: string;     // 判词正文
}

// 测试结果
interface TestResult {
  personality: PersonalityType;
  scores: Scores;
  trigger: 'UR' | 'SSR' | 'Max-Vector';
  archiveId: string;   // UNTI-XXXX
}
```

## 五、状态管理

```typescript
// 使用 React Context 管理全局状态

interface QuizState {
  // 答题状态
  currentIndex: number;           // 当前题号
  answers: number[];              // 已选答案索引
  scores: Scores;                 // 实时分数
  
  // 结果状态
  result: TestResult | null;
  
  // 操作
  selectOption: (optionIndex: number) => void;
  reset: () => void;
}

// 持久化：使用 localStorage 保存答题进度
// 用户刷新后可选择"继续测试"或"重新开始"
```

## 六、响应式适配

```css
/* Mobile First */
.container {
  @apply w-full max-w-md mx-auto px-4;
  @apply min-h-screen flex flex-col;
}

/* 字体大小适配 */
.title {
  @apply text-2xl sm:text-3xl font-bold;
}

.question {
  @apply text-lg sm:text-xl;
}
```

## 七、性能优化

1. **图片优化**
   - 人格图使用 PNG 保持透明背景
   - 首页图可压缩至 100KB 以内
   - 使用 `loading="lazy"` 延迟加载非首屏图片

2. **动画性能**
   - 使用 `transform` 和 `opacity` 实现动画
   - 添加 `will-change` 提示浏览器优化
   - 答题切换使用 CSS transition 而非 JS 动画

3. **包体积**
   - 不使用图表库，自研简单的分数展示
   - 按需引入 Framer Motion（仅首页动画）

## 八、开发顺序建议

```
Phase 1 (MVP):
├── 1. 搭建项目框架 (Vite + React + TS)
├── 2. 实现评分引擎 (移植 test/engine.test.js)
├── 3. 开发 LandingPage + QuizPage
├── 4. 实现基本的结果展示页
└── 5. 本地运行测试

Phase 2 (完善):
├── 1. 添加 LoadingPage 动画
├── 2. 优化分数展示 UI
├── 3. 添加 localStorage 持久化
└── 4. 多设备适配测试

Phase 3 (上线):
├── 1. 添加数据埋点
├── 2. 性能优化
└── 3. 部署
```
