/**
 * UNTI 16题测试 - 三方案对比
 */

// ==================== 方案A：当前题目 + 替换Q10增加D ====================
const QUESTIONS_A = [
  // Q1
  {
    id: 1,
    question: "期末作业是一篇 3000 字论述文。DDL 是今晚 12 点，现在 21:00。你的真实操作是：",
    options: [
      { text: "早就写完了，已经在做其他事了。", scores: { A: 2 } },
      { text: "让 AI 先写个底稿自己再改改，主打糊弄。", scores: { A: -1, W: 1 } },
      { text: "宁死不屈自己敲，痛码 3000 字卡点极限提交。", scores: { D: 2, E: 1 } },
      { text: "交不交吧，无所谓，睡觉。", scores: { A: -2 } }
    ]
  },
  // Q2
  {
    id: 2,
    question: "对于未来，我有一张清晰的蓝图。",
    options: [
      { text: "认同，并正在步步推进。", scores: { A: 2 } },
      { text: "脑子里有，但身体跟不上。", scores: { E: 2 } },
      { text: "没有蓝图，走一步看一步随缘吧。", scores: { E: -2 } },
      { text: "蓝图？我的蓝图是活过下周。", scores: { W: 1 } }
    ]
  },
  // Q3
  {
    id: 3,
    question: "老师宣布期末要进行自由分组的小组作业，此时你的真实状态是：",
    options: [
      { text: "迅速锁定班里的大腿，或主动拉群分配任务。", scores: { A: 2 } },
      { text: "坐在座位上装死，默默祈祷有人能顺手捡走我。", scores: { S: -2 } },
      { text: "和烂泥室友自动抱团，准备 DDL 前夜合体创造奇迹。", scores: { D: 2 } },
      { text: "极度社恐内耗，甚至想问老师能不能一个人单干。", scores: { E: 2 } }
    ]
  },
  // Q4
  {
    id: 4,
    question: "看到别人拿奖学金、拿到好 Offer 时，我的第一反应通常是：",
    options: [
      { text: "焦虑，疯狂反思自己。", scores: { E: 2 } },
      { text: "有压力，转化为动力去卷。", scores: { A: 2 } },
      { text: "毫无波澜，各人有各命。", scores: { E: -2 } },
      { text: "立刻去转发锦鲤蹭好运。", scores: { W: 1 } }
    ]
  },
  // Q5
  {
    id: 5,
    question: "你的"饭搭子"突然在吃饭时崩溃大哭，讲述私密创伤。你的内心 OS 是：",
    options: [
      { text: "（警报拉响）救命！这超出了陪吃 NPC 的功能模块啊！", scores: { S: -2 } },
      { text: "表面倾听，大脑开始计算这顿饭还要多久结束。", scores: { S: -1 } },
      { text: "瞬间极度共情，陪 TA 骂天骂地，眼泪掉得比 TA 还快。", scores: { S: 2 } },
      { text: "开始冷静地帮 TA 分析问题，并给出客观解决方案。", scores: { E: -1 } }
    ]
  },
  // Q6
  {
    id: 6,
    question: "你发现有点好感的暧昧对象，在朋友圈给其他异性发了暧昧评论。你会：",
    options: [
      { text: "瞬间下头，电子围栏高筑，直接判死刑。", scores: { S: -2 } },
      { text: "疯狂内耗，反复视奸对方主页，怀疑是不是自己不够好。", scores: { E: 2 } },
      { text: "截图发给朋友痛骂其"中央空调"，下个更乖。", scores: { W: 2 } },
      { text: "假装没看见，觉得还能抢救一下。", scores: { S: 1 } }
    ]
  },
  // Q7
  {
    id: 7,
    question: "我最典型的度过周末的方式：",
    options: [
      { text: "床是本体，靠外卖维生。", scores: { A: -2 } },
      { text: "极度自律：图书馆、健身房或学技能。", scores: { A: 2 } },
      { text: "突然暴走 Citywalk 或特种兵旅行。", scores: { W: 2 } },
      { text: "必须找朋友吃喝玩乐，受不了一个人。", scores: { S: 2 } }
    ]
  },
  // Q8
  {
    id: 8,
    question: "在多人社交场合（如班会、聚餐）中，我更像：",
    options: [
      { text: "隐形人，试图与背景板融为一体。", scores: { S: -2 } },
      { text: "控场者，主导话题，推进流程。", scores: { S: 2 } },
      { text: "捧哏/怨种，谁都不想得罪，随时补位。", scores: { E: 1 } },
      { text: "气氛组，偶尔发癫搞怪，偶尔安静。", scores: { W: 2 } }
    ]
  },
  // Q9
  {
    id: 9,
    question: "在这个充满消费陷阱的时代，你内心真实的消费观更接近：",
    options: [
      { text: "千金难买我乐意：只要能提供情绪价值，花多少都不心疼。", scores: { W: 2 } },
      { text: "钱花刀刃上：看 50 个测评疯狂比价，追求极致性价比。", scores: { A: 1 } },
      { text: "不买立省 100%：物欲极低，东西没坏绝不换新。", scores: { A: 2 } },
      { text: "双标大师：给别人花钱不手软，给自己买衣服抠抠搜搜。", scores: { E: 1 } }
    ]
  },
  // Q10 - 方案A：替换为DDL题目
  {
    id: 10,
    question: "离 DDL 还有 48 小时，任务才完成 20%。你会：",
    options: [
      { text: "严格按照时间表推进，分秒必争。", scores: { A: 2 } },
      { text: "先玩一天，最后 24 小时爆肝赶工。", scores: { D: 2 } },
      { text: "边焦虑边刷手机逃避，脑子里全是任务。", scores: { E: 2 } },
      { text: "干脆不做，反正也做不完。", scores: { A: -2 } }
    ]
  },
  // Q11
  {
    id: 11,
    question: "假设你突然意外获得了一笔 5000 元横财。你的第一反应通常是：",
    options: [
      { text: "存进定期，或者报课/买必需的生产力工具。", scores: { W: -2 } },
      { text: ""转运了！"拿出一部分买彩票/游戏抽卡，试图以小博大。", scores: { W: 2 } },
      { text: "立刻在群里发红包，请好朋友们吃大餐。", scores: { S: 2 } },
      { text: "悄悄给自己安排大餐/买心仪之物，绝不发朋友圈炫耀。", scores: { S: -1 } }
    ]
  },
  // Q12
  {
    id: 12,
    question: "深夜睡不着，你通常是因为：",
    options: [
      { text: "脑子里回放白天的丢脸小事，尴尬扭蛆。", scores: { E: 2 } },
      { text: "焦虑明天的任务还没完成，越想越清醒。", scores: { E: 1 } },
      { text: "单纯报复性熬夜刷手机，越刷越空虚。", scores: { W: 1 } },
      { text: "睡得很好，很少失眠。", scores: { E: -2 } }
    ]
  },
  // Q13
  {
    id: 13,
    question: "在食堂排队打饭，突然有个同学极其自然地插到了你前面。你的第一反应是：",
    options: [
      { text: "算了，多一事不如少一事，可能人家真的很急。", scores: { E: 2 } },
      { text: "瞬间战斗力爆表，直接拍他肩膀："同学，排队好吗？"", scores: { A: 2 } },
      { text: "在心里疯狂辱骂，然后拍个背影发到学校表白墙避雷。", scores: { W: 1, E: 1 } },
      { text: "无所谓，我戴着降噪耳机正在发呆，根本没注意。", scores: { S: -2 } }
    ]
  },
  // Q14
  {
    id: 14,
    question: "在校园路上远远看到一个"半熟不熟"的同学迎面走来，你会：",
    options: [
      { text: "迅速掏出手机假装打字，完美避开眼神交汇。", scores: { S: -2 } },
      { text: "疯狂做心理建设，走近了尴尬地挤出一个微笑。", scores: { E: 2 } },
      { text: "隔着老远就大声喊名字打招呼，完全不社恐。", scores: { S: 2 } },
      { text: "突然原地180度转身换一条路走，主打一个随心所欲。", scores: { W: 2 } }
    ]
  },
  // Q15
  {
    id: 15,
    question: "在一段深度的亲密关系（恋爱或至交）中，你最底层的需求是：",
    options: [
      { text: "毫无保留的分享欲，希望能高度绑定、时刻黏在一起。", scores: { S: 2 } },
      { text: "保持各自独立的精神空间，比起黏糊糊更喜欢顶峰相见。", scores: { S: -2 } },
      { text: "缺乏安全感，一旦觉得对方冷淡，就准备启动防御机制抽身。", scores: { E: 2 } },
      { text: "极致的情绪拉扯，平淡如水不如轰轰烈烈，偶尔故意作一下。", scores: { W: 2 } }
    ]
  },
  // Q16
  {
    id: 16,
    question: "诚实地回答，你现在做这个测试，是为了什么？",
    options: [
      { text: "纯粹觉得好玩，打发时间。", scores: { W: -1 } },
      { text: "看到别人都在测，想了解一下自己是个什么品种。", scores: { S: 1 } },
      { text: "在这个操蛋的世界里，找个标签解释我现在的状态。", scores: { E: 1, UR: true } },
      { text: "测完发朋友圈，求关注。", scores: { S: 1, W: 1 } }
    ]
  }
];

// ==================== 方案B：修改Q13增加D ====================
const QUESTIONS_B = JSON.parse(JSON.stringify(QUESTIONS_A));
// 恢复Q10为朋友圈题目
QUESTIONS_B[9] = {
  id: 10,
  question: "你的朋友圈通常呈现出一种怎样的状态？",
  options: [
    { text: "几乎不发，仅三天可见，赛博坟墓。", scores: { S: -2 } },
    { text: "精心挑图配文案，努力维持体面现充人设。", scores: { A: 1, E: -1 } },
    { text: "毫无顾忌地高频发疯，一天三条无意义嚎叫。", scores: { W: 2 } },
    { text: "随心记录生活，完全不在乎有没有人点赞。", scores: { E: -2 } }
  ]
};
// 修改Q13增加D维度
QUESTIONS_B[12] = {
  id: 13,
  question: "在食堂排队打饭，突然有个同学极其自然地插到了你前面。你的第一反应是：",
  options: [
    { text: "算了，多一事不如少一事，可能人家真的很急。", scores: { E: 2 } },
    { text: "瞬间战斗力爆表，直接拍他肩膀："同学，排队好吗？"", scores: { A: 2 } },
    { text: "在心里疯狂辱骂，然后拍个背影发到学校表白墙避雷。", scores: { W: 1, E: 1 } },
    { text: "戴着耳机发呆根本没注意，事后才反应过来被插队了。", scores: { D: 1, S: -1 } }
  ]
};

// ==================== 方案C：保持原题，调整FIRE触发 ====================
const QUESTIONS_C = JSON.parse(JSON.stringify(QUESTIONS_B));
// 恢复Q13原始版本
QUESTIONS_C[12] = {
  id: 13,
  question: "在食堂排队打饭，突然有个同学极其自然地插到了你前面。你的第一反应是：",
  options: [
    { text: "算了，多一事不如少一事，可能人家真的很急。", scores: { E: 2 } },
    { text: "瞬间战斗力爆表，直接拍他肩膀："同学，排队好吗？"", scores: { A: 2 } },
    { text: "在心里疯狂辱骂，然后拍个背影发到学校表白墙避雷。", scores: { W: 1, E: 1 } },
    { text: "无所谓，我戴着降噪耳机正在发呆，根本没注意。", scores: { S: -2 } }
  ]
};

// ==================== 评分引擎 ====================
function calculatePersonality(answers, questions) {
  let scores = { A: 0, E: 0, S: 0, W: 0, D: 0 };
  let selectedUR = false;

  for (let i = 0; i < answers.length; i++) {
    const option = questions[i].options[answers[i]];

    if (i === 15 && option.scores && option.scores.UR) {
      selectedUR = true;
    }

    for (const [key, val] of Object.entries(option.scores)) {
      if (key in scores && typeof val === 'number') {
        scores[key] += val;
      }
    }
  }

  // UR触发（理性版）
  if (selectedUR) {
    const isObserver = scores.E >= 5 && scores.S <= -3;
    const isAwakeButTrapped = scores.A >= 4 && scores.E >= 4;
    const isUniqueCombo = scores.W >= 5 && scores.S <= -4;

    if (isObserver || isAwakeButTrapped || isUniqueCombo) {
      return { personality: "ALIEN", scores, trigger: "UR" };
    }
  }

  // SSR触发
  if (scores.A >= 2 && scores.A <= 6 && scores.E <= -2 && scores.W >= 2) {
    return { personality: "FREE", scores, trigger: "SSR" };
  }

  // Max-Vector
  const dims = ['A', 'E', 'S', 'W', 'D'];
  let maxAbs = -1, dominant = '', isNegative = false;

  for (const key of dims) {
    const val = scores[key];
    const absVal = Math.abs(val);
    if (absVal > maxAbs) {
      maxAbs = absVal;
      dominant = key;
      isNegative = val < 0;
    }
  }

  const mapping = {
    'A': isNegative ? 'FLOP' : 'KING',
    'E': isNegative ? 'NULL' : 'OOPS',
    'S': isNegative ? 'NULL' : 'PURE',
    'W': 'WILD',
    'D': 'FIRE'
  };

  return { personality: mapping[dominant], scores, trigger: "Max-Vector" };
}

// ==================== 测试函数 ====================
function runTest(questions, name, count = 1000) {
  const stats = {
    personalities: {},
    triggers: { UR: 0, SSR: 0, "Max-Vector": 0 },
    scoreStats: { A: [], E: [], S: [], W: [], D: [] },
    dimCoverage: { A: 0, E: 0, S: 0, W: 0, D: 0 }
  };

  // 统计维度覆盖
  questions.forEach(q => {
    q.options.forEach(opt => {
      Object.keys(opt.scores).forEach(k => {
        if (k in stats.dimCoverage) stats.dimCoverage[k]++;
      });
    });
  });

  for (let i = 0; i < count; i++) {
    const answers = questions.map(q => Math.floor(Math.random() * q.options.length));
    const result = calculatePersonality(answers, questions);

    stats.personalities[result.personality] = (stats.personalities[result.personality] || 0) + 1;
    stats.triggers[result.trigger]++;

    for (const [k, v] of Object.entries(result.scores)) {
      stats.scoreStats[k].push(v);
    }
  }

  // 计算变异系数
  const counts = Object.values(stats.personalities);
  const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
  const variance = counts.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / counts.length;
  const cv = (Math.sqrt(variance) / avg) * 100;

  return { name, stats, cv };
}

function printReport(results) {
  console.log("\n" + "=".repeat(80));
  console.log("📊 UNTI 16题 三方案对比测试报告");
  console.log("=".repeat(80));

  // 维度覆盖对比
  console.log("\n📐 维度覆盖次数对比：");
  console.log("-".repeat(60));
  console.log("维度    方案A(替换Q10)  方案B(修改Q13)  方案C(调整触发)");
  console.log("-".repeat(60));
  const dims = ['A', 'E', 'S', 'W', 'D'];
  for (const d of dims) {
    const row = results.map(r => r.stats.dimCoverage[d].toString().padStart(8));
    console.log(`${d.padEnd(6)} ${row.join('        ')}`);
  }

  // 人格分布对比
  console.log("\n🎭 人格分布对比（1000次测试）：");
  console.log("-".repeat(80));

  const allPersonalities = ['KING', 'NULL', 'FIRE', 'FLOP', 'PURE', 'OOPS', 'WILD', 'FREE', 'ALIEN'];
  const emojis = { KING: '👑', NULL: '🪨', FIRE: '🔥', FLOP: '🛌', PURE: '🌸', OOPS: '🎭', WILD: '🌪️', FREE: '🌌', ALIEN: '👁️' };

  console.log("人格        方案A        方案B        方案C");
  console.log("-".repeat(80));

  for (const p of allPersonalities) {
    const row = results.map(r => {
      const count = r.stats.personalities[p] || 0;
      const pct = ((count / 1000) * 100).toFixed(1);
      return `${pct}%`.padStart(8);
    });
    console.log(`${emojis[p]} ${p.padEnd(6)} ${row.join('      ')}`);
  }

  // 触发机制
  console.log("\n⚡ 触发机制对比：");
  console.log("-".repeat(60));
  for (const t of ['UR', 'SSR', 'Max-Vector']) {
    const row = results.map(r => {
      const count = r.stats.triggers[t];
      const pct = ((count / 1000) * 100).toFixed(1);
      return `${pct}%`.padStart(8);
    });
    console.log(`${t.padEnd(12)} ${row.join('      ')}`);
  }

  // 变异系数
  console.log("\n📈 分布均匀性（变异系数，越低越好）：");
  console.log("-".repeat(60));
  for (const r of results) {
    const status = r.cv < 40 ? '🟢 优秀' : r.cv < 60 ? '🟡 可接受' : '🔴 需优化';
    console.log(`${r.name}: ${r.cv.toFixed(1)}% ${status}`);
  }

  // 分数范围
  console.log("\n📊 D维度分数范围对比（关键指标）：");
  console.log("-".repeat(60));
  for (const r of results) {
    const dScores = r.stats.scoreStats.D;
    const min = Math.min(...dScores);
    const max = Math.max(...dScores);
    const avg = (dScores.reduce((a, b) => a + b, 0) / dScores.length).toFixed(1);
    console.log(`${r.name}: [${min}, ${max}] 平均: ${avg}`);
  }

  // 最终推荐
  console.log("\n" + "=".repeat(80));
  console.log("🏆 综合评估：");
  console.log("=".repeat(80));

  // 计算综合得分
  const scores = results.map(r => {
    let score = 100;
    // 变异系数惩罚
    if (r.cv > 60) score -= 20;
    else if (r.cv > 50) score -= 10;
    // D维度覆盖惩罚
    const dCoverage = r.stats.dimCoverage.D;
    if (dCoverage < 4) score -= 15;
    else if (dCoverage < 6) score -= 5;
    // FIRE触发检查
    const fireCount = r.stats.personalities.FIRE || 0;
    if (fireCount < 50) score -= 10;

    return { name: r.name, score, cv: r.cv, dCoverage, fireCount };
  });

  scores.sort((a, b) => b.score - a.score);

  for (const s of scores) {
    console.log(`${s.name}: ${s.score}分 (CV: ${s.cv.toFixed(1)}%, D覆盖: ${s.dCoverage}次, FIRE: ${s.fireCount}次)`);
  }

  console.log(`\n✅ 推荐方案：${scores[0].name}`);
  console.log("=".repeat(80));
}

// 运行测试
const results = [
  runTest(QUESTIONS_A, "方案A(替换Q10)"),
  runTest(QUESTIONS_B, "方案B(修改Q13)"),
  runTest(QUESTIONS_C, "方案C(调整触发)")
];

printReport(results);
