// 五维分数
export interface Scores {
  A: number;  // Action 执行
  E: number;  // Emotion 内耗
  S: number;  // Social 社交
  W: number;  // Wild 发疯
  D: number;  // Deadline 死线
}

// 选项
export interface Option {
  text: string;
  scores: Partial<Scores> | { UR?: boolean };
}

// 题目
export interface Question {
  id: number;
  question: string;
  options: Option[];
}

// 人格稀有度
export type Rarity = 'N' | 'SSR' | 'UR';

// 副人格
export interface SubPersonality {
  name: string;
  desc: string;
}

// 人格定义
export interface Personality {
  name: string;
  emoji: string;
  rare: Rarity;
  tagline: string;
  review: string;
  verdict: string;
  subTypes: Record<string, SubPersonality>;
}

// 测试结果
export interface TestResult {
  personality: string;
  scores: Scores;
  subType: string;
  trigger: 'UR' | 'SSR' | 'Max-Vector' | 'Vector-Match' | 'Low-Similarity';
  confidence?: number;
}

// 答题状态
export interface QuizState {
  currentIndex: number;
  answers: number[];
  scores: Scores;
  result: TestResult | null;
}
