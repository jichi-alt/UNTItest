import type { Scores, TestResult, Question } from '../types';
import questionsData from '../data/questions.json';
import personalitiesData from '../data/personalities.json';

export const QUESTIONS: Question[] = questionsData.questions;

// 人格特征向量定义（基于心理学人格模型）
// 每个人格有一个理想特征向量，表示该人格在各维度的典型表现
const PERSONALITY_VECTORS: Record<string, { vector: Scores; name: string }> = {
  KING: {
    name: '高效行动派',
    vector: { A: 8, E: -4, S: 0, W: -2, D: 2 }  // 高执行力、低内耗、适度DDL
  },
  FLOP: {
    name: '仰卧者',
    vector: { A: -6, E: 4, S: 0, W: 2, D: -2 }  // 低执行力、高内耗
  },
  NULL: {
    name: '隐形NPC',
    vector: { A: -2, E: -2, S: -6, W: -2, D: -2 }  // 低社交、低各项
  },
  OOPS: {
    name: '「哦，天哪」者',
    vector: { A: 0, E: 6, S: 0, W: 2, D: 0 }  // 高内耗、事故体质
  },
  PURE: {
    name: '清澈者',
    vector: { A: 0, E: 0, S: 8, W: -4, D: 0 }  // 高社交、低发疯
  },
  WILD: {
    name: '发疯者',
    vector: { A: 0, E: -2, S: 2, W: 8, D: 0 }  // 高发疯
  },
  FIRE: {
    name: '赶Due狂徒',
    vector: { A: 0, E: 2, S: 0, W: 2, D: 8 }  // 高DDL依赖
  },
  FREE: {
    name: '旷野行者',
    vector: { A: 4, E: -4, S: 0, W: 4, D: 0 }  // 中等执行力、低内耗、高自由
  },
  ALIEN: {
    name: '高维局外人',
    vector: { A: 4, E: 6, S: -4, W: 4, D: 0 }  // 高内耗+高执行力矛盾体
  }
};

// 计算余弦相似度
function cosineSimilarity(a: Scores, b: Scores): number {
  const dims: (keyof Scores)[] = ['A', 'E', 'S', 'W', 'D'];
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const dim of dims) {
    dotProduct += a[dim] * b[dim];
    normA += a[dim] * a[dim];
    normB += b[dim] * b[dim];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

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

  // UR 触发逻辑（保持原有特殊触发）
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

  // SSR 触发逻辑（保持原有特殊触发）
  if (scores.A >= 2 && scores.A <= 6 && scores.E <= -2 && scores.W >= 2) {
    return {
      personality: 'FREE',
      scores,
      subType: 'default',
      trigger: 'SSR'
    };
  }

  // 计算与每个人格的相似度
  const similarities: { personality: string; similarity: number }[] = [];

  for (const [personality, data] of Object.entries(PERSONALITY_VECTORS)) {
    // 跳过特殊人格
    if (personality === 'FREE' || personality === 'ALIEN') continue;

    const similarity = cosineSimilarity(scores, data.vector);
    similarities.push({ personality, similarity });
  }

  // 按相似度排序
  similarities.sort((a, b) => b.similarity - a.similarity);

  // 获取最佳匹配
  const bestMatch = similarities[0];

  // 如果相似度太低（< 0.3），说明没有明显倾向，判为 NULL
  if (bestMatch.similarity < 0.3) {
    return {
      personality: 'NULL',
      scores,
      subType: determineSubType('NULL', scores),
      trigger: 'Low-Similarity'
    };
  }

  const personality = bestMatch.personality;
  const subType = determineSubType(personality, scores);

  return {
    personality,
    scores,
    subType,
    trigger: 'Vector-Match',
    confidence: bestMatch.similarity
  };
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
