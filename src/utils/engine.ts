import type { Scores, TestResult, Question } from '../types';
import questionsData from '../data/questions.json';
import personalitiesData from '../data/personalities.json';

export const QUESTIONS: Question[] = questionsData.questions;

// 计算人格
export function calculatePersonality(answers: number[]): TestResult {
  const scores: Scores = { A: 0, E: 0, S: 0, W: 0, D: 0 };
  let selectedUR = false;

  // 累计分数
  for (let i = 0; i < answers.length; i++) {
    const option = QUESTIONS[i].options[answers[i]];

    // 记录 UR 选择
    if (i === 15 && option.scores && 'UR' in option.scores) {
      selectedUR = true;
    }

    // 累加分数
    for (const [key, val] of Object.entries(option.scores)) {
      if (key in scores && typeof val === 'number') {
        scores[key as keyof Scores] += val;
      }
    }
  }

  // UR 触发逻辑
  if (selectedUR) {
    const isObserver = scores.E >= 5 && scores.S <= -3;
    const isAwakeButTrapped = scores.A >= 4 && scores.E >= 4;
    const isUniqueCombo = scores.W >= 5 && scores.S <= -4;

    if (isObserver || isAwakeButTrapped || isUniqueCombo) {
      return {
        personality: 'ALIEN',
        scores,
        subType: 'default',
        trigger: 'UR'
      };
    }
  }

  // SSR 触发逻辑
  if (scores.A >= 2 && scores.A <= 6 && scores.E <= -2 && scores.W >= 2) {
    return {
      personality: 'FREE',
      scores,
      subType: 'default',
      trigger: 'SSR'
    };
  }

  // Max-Vector 极值算法
  const dims: (keyof Scores)[] = ['A', 'E', 'S', 'W', 'D'];
  let maxAbs = -1;
  let dominant: keyof Scores = 'A';
  let isNegative = false;

  for (const key of dims) {
    const val = scores[key];
    const absVal = Math.abs(val);
    if (absVal > maxAbs) {
      maxAbs = absVal;
      dominant = key;
      isNegative = val < 0;
    }
  }

  // 人格映射
  const mapping: Record<keyof Scores, string> = {
    'A': isNegative ? 'FLOP' : 'KING',
    'E': isNegative ? 'NULL' : 'OOPS',
    'S': isNegative ? 'NULL' : 'PURE',
    'W': 'WILD',
    'D': 'FIRE'
  };

  const personality = mapping[dominant];
  const subType = determineSubType(personality, scores);

  return { personality, scores, subType, trigger: 'Max-Vector' };
}

// 确定副人格
function determineSubType(personality: string, scores: Scores): string {
  const { A, E, S, W, D } = scores;

  switch (personality) {
    case 'KING':
      if (A > 8 && S > 5) return 'social_king';
      if (A > 8 && S < 0) return 'lone_king';
      if (A > 8 && W > 5) return 'mad_king';
      return 'standard';

    case 'NULL':
      if (E > 8 && S < -5) return 'social_anxious';
      if (E < 0 && S < -5) return 'chill_npc';
      if (W > 5 && S < -5) return 'mad_npc';
      return 'standard';

    case 'FIRE':
      if (D > 8 && A > 5) return 'efficient';
      if (D > 8 && W > 5) return 'mad_ddl';
      if (D > 8 && E > 5) return 'anxious_ddl';
      return 'standard';

    case 'FLOP':
      if (A < -5 && E > 5) return 'anxious_flop';
      if (A < -5 && W > 5) return 'mad_flop';
      if (A < -5 && E < 0) return 'chill_flop';
      return 'standard';

    case 'PURE':
      if (S > 8 && E < 0) return 'sunny';
      if (S > 8 && E > 0) return 'sensitive';
      if (S > 8 && W < 0) return 'good_kid';
      return 'standard';

    case 'OOPS':
      if (E > 8 && W > 5) return 'mad_oops';
      if (E > 8 && W < 0) return 'anxious_oops';
      if (E > 8 && S > 5) return 'social_oops';
      return 'standard';

    case 'WILD':
      if (W > 8 && A > 5) return 'action_wild';
      if (W > 8 && A < 0) return 'chill_wild';
      if (W > 8 && S > 5) return 'social_wild';
      return 'standard';

    default:
      return 'default';
  }
}

// 获取人格信息
export function getPersonalityInfo(type: string) {
  return personalitiesData.personalities[type as keyof typeof personalitiesData.personalities];
}

// 获取加载文案
export function getRandomLoadingText(): string {
  const texts = personalitiesData.loadingTexts;
  return texts[Math.floor(Math.random() * texts.length)];
}

// 获取作者信息
export function getAuthorNote(): string {
  return personalitiesData.authorNote;
}

// 生成档案编号
export function generateArchiveId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `UNTI-${id}`;
}

// 计算单个选项的分数变化
export function getOptionScores(questionIndex: number, optionIndex: number): Partial<Scores> {
  const option = QUESTIONS[questionIndex].options[optionIndex];
  const result: Partial<Scores> = {};
  for (const [key, val] of Object.entries(option.scores)) {
    if (key in result || key === 'A' || key === 'E' || key === 'S' || key === 'W' || key === 'D') {
      if (typeof val === 'number') {
        (result as Record<string, number>)[key] = val;
      }
    }
  }
  return result;
}
