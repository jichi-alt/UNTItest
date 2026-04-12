/**
 * UNTI 评分系统测试模块
 * 模拟100次随机测试，验证Max-Vector算法的准确性和分布
 */

// ==================== 题库数据 ====================
const QUESTIONS = [
  {
    id: 1,
    question: `期末作业 3000 字，DDL 今晚 12 点，现在 21:00，真实操作：`,
    options: [
      { text: `早就写完在做别的事。`, scores: { A: 2 } },
      { text: `AI 写底稿自己改。`, scores: { A: -1, W: 1 } },
      { text: `痛码 3000 字极限卡点。`, scores: { D: 2, E: 1 } },
      { text: `交不交无所谓，睡觉。`, scores: { A: -2 } }
    ]
  },
  {
    id: 2,
    question: `对未来有一张清晰蓝图。`,
    options: [
      { text: `认同，步步推进。`, scores: { A: 2 } },
      { text: `脑子里有，身体跟不上。`, scores: { E: 2 } },
      { text: `没有，走一步看一步随缘。`, scores: { E: -2 } },
      { text: `蓝图？我的蓝图是活过下周。`, scores: { W: 1 } }
    ]
  },
  {
    id: 3,
    question: `小组作业自由分组，你的状态：`,
    options: [
      { text: `锁大腿或拉群当 Leader。`, scores: { A: 2 } },
      { text: `装死祈祷被顺手捡走。`, scores: { S: -2 } },
      { text: `和烂泥室友抱团等 DDL 奇迹。`, scores: { D: 2 } },
      { text: `社恐内耗，想一个人单干。`, scores: { E: 2 } }
    ]
  },
  {
    id: 4,
    question: `看别人拿奖学金/Offer，第一反应：`,
    options: [
      { text: `焦虑，疯狂反思自己。`, scores: { E: 2 } },
      { text: `有压力，转化为动力卷。`, scores: { A: 2 } },
      { text: `毫无波澜，各人有各命。`, scores: { E: -2 } },
      { text: `转发锦鲤蹭好运。`, scores: { W: 1 } }
    ]
  },
  {
    id: 5,
    question: `深度亲密关系（恋爱/至交）底层需求：`,
    options: [
      { text: `毫无保留分享，时刻绑定。`, scores: { S: 2 } },
      { text: `保持独立空间，顶峰相见。`, scores: { S: -2 } },
      { text: `缺乏安全感，随时准备抽身防御。`, scores: { E: 2 } },
      { text: `极致情绪拉扯，不喜平淡。`, scores: { W: 2 } }
    ]
  },
  {
    id: 6,
    question: `饭搭子突然崩溃大哭讲私密创伤，内心OS：`,
    options: [
      { text: `救命，超出陪吃 NPC 模块！`, scores: { S: -2 } },
      { text: `表面倾听，计算还要多久吃完。`, scores: { A: -1 } },
      { text: `极度共情，陪TA骂天骂地掉眼泪。`, scores: { S: 2 } },
      { text: `冷静分析，给客观方案。`, scores: { E: -1 } }
    ]
  },
  {
    id: 7,
    question: `暧昧对象朋友圈给异性发暧昧评论：`,
    options: [
      { text: `瞬间下头，判死刑。`, scores: { S: -2 } },
      { text: `疯狂内耗，怀疑自己不好。`, scores: { E: 2 } },
      { text: `截图痛骂中央空调，下个更乖。`, scores: { W: 2 } },
      { text: `假装没看见，还能抢救。`, scores: { S: 1 } }
    ]
  },
  {
    id: 8,
    question: `兴趣爱好倾向：`,
    options: [
      { text: `躺平学，呼吸睡觉什么都不干。`, scores: { A: -2, S: -2 } },
      { text: `健身、搞钱、深阅读 (正反馈)。`, scores: { A: 2 } },
      { text: `电音节、极限运动、KTV嘶吼。`, scores: { W: 2 } },
      { text: `冷门电影、深夜独自散步。`, scores: { E: -2 } }
    ]
  },
  {
    id: 9,
    question: `消费观更接近：`,
    options: [
      { text: `千金难买我乐意，为情绪价值花钱。`, scores: { W: 2 } },
      { text: `钱花刀刃上，疯狂比价。`, scores: { A: 1 } },
      { text: `不买立省100%，物欲极低。`, scores: { A: 2 } },
      { text: `双标，给别人花不手软给自己抠搜。`, scores: { E: 1 } }
    ]
  },
  {
    id: 10,
    question: `很多时候觉得自己是凑数的 NPC：`,
    options: [
      { text: `认同，就是凑人数的。`, scores: { A: -2 } },
      { text: `偶尔有深深的无力感。`, scores: { E: 2 } },
      { text: `绝不认同，我是主角。`, scores: { A: 2 } },
      { text: `就算 NPC 也是最疯的那个。`, scores: { W: 2 } }
    ]
  },
  {
    id: 11,
    question: `意外获得 5000 元横财：`,
    options: [
      { text: `存定期/买生产力工具。`, scores: { A: 2 } },
      { text: `拿去买彩票/抽卡，以小博大。`, scores: { W: 1 } },
      { text: `群里发红包请客，独乐乐不如众乐乐。`, scores: { S: 2 } },
      { text: `悄悄吃大餐/买心仪之物，不发朋友圈。`, scores: { S: -1 } }
    ]
  },
  {
    id: 12,
    question: `多人社交场合更像：`,
    options: [
      { text: `隐形人。`, scores: { S: -2 } },
      { text: `控场者。`, scores: { A: 2 } },
      { text: `捧哏/怨种。`, scores: { E: 2 } },
      { text: `气氛组。`, scores: { W: 2 } }
    ]
  },
  {
    id: 13,
    question: `理想周末典型度过方式：`,
    options: [
      { text: `床是本体，外卖维生。`, scores: { A: -2 } },
      { text: `自律去图书馆/健身房。`, scores: { A: 2 } },
      { text: `暴走 Citywalk 或特种兵旅行。`, scores: { W: 2 } },
      { text: `找朋友吃喝玩乐，受不了一个人。`, scores: { S: 2 } }
    ]
  },
  {
    id: 14,
    question: `极度厌恶计划被打破：`,
    options: [
      { text: `认同，非常焦虑暴躁。`, scores: { E: 2 } },
      { text: `无所谓，本来就没计划。`, scores: { A: -2 } },
      { text: `计划就是用来打破的，随时变。`, scores: { W: 2 } }
    ]
  },
  {
    id: 15,
    question: `凌晨 1:30 不出意外你在：`,
    options: [
      { text: `机械滑短视频，越刷越空虚。`, scores: { E: 2 } },
      { text: `早就睡了或在爆肝目标。`, scores: { A: 2 } },
      { text: `脑子里回放丢脸小事扭蛆。`, scores: { E: 1 } },
      { text: `戴耳机听歌思考宇宙浪漫。`, scores: { E: -2 } }
    ]
  },
  {
    id: 16,
    question: `遇重大挫折（挂科被拒）：`,
    options: [
      { text: `找朋友大哭大骂求支撑。`, scores: { S: 2 } },
      { text: `迅速复盘定抢救计划。`, scores: { A: 2 } },
      { text: `事已至此，吃顿好的再说。`, scores: { E: -2 } }
    ]
  },
  {
    id: 17,
    question: `深夜流浪猫冲你大声喵：`,
    options: [
      { text: `无视，没多余的爱给了。`, scores: { S: -2 } },
      { text: `趴地上更大声喵喵嗷吼回去。`, scores: { W: 2 } },
      { text: `蹲下咪咪咪试图抚摸连拍。`, scores: { S: 2 } }
    ]
  },
  {
    id: 18,
    question: `面对即将出结果的重大事件：`,
    options: [
      { text: `极其笃定，做好了 120% 准备。`, scores: { A: 2 } },
      { text: `转发锦鲤/拜佛，玄学护体。`, scores: { W: 1 } },
      { text: `到处跟人反向毒奶完了肯定挂。`, scores: { E: 2 } }
    ]
  },
  {
    id: 19,
    question: `大学已过半，躺床上脑子里飘过：`,
    options: [
      { text: `像牛马一样上学上班，有什么意义？`, scores: { E: 2 } },
      { text: `完了我干了啥？不行必须背单词(继续躺)。`, scores: { E: 2 } },
      { text: `去他的绩点，大不了回老家开小卖部。`, scores: { E: -2 } }
    ]
  },
  {
    id: 20,
    question: `做这个测试是为了什么？`,
    options: [
      { text: `纯粹觉得好玩，发朋友圈。`, scores: { S: 1 } },
      { text: `看别人测想了解自己品种。`, scores: { A: 1 } },
      { text: `想在这个世界找个借口拖延5分钟...`, scores: { UR: true } }
    ]
  }
];

// 人格映射表
const PERSONALITIES = {
  KING: { name: "六边形战士", emoji: "👑", rare: "N" },
  NULL: { name: "隐形 NPC", emoji: "🪨", rare: "N" },
  FIRE: { name: "赶Due狂徒", emoji: "🔥", rare: "N" },
  FLOP: { name: "仰卧者", emoji: "🛌", rare: "N" },
  PURE: { name: "清澈者", emoji: "🌸", rare: "N" },
  OOPS: { name: "哦，天哪者", emoji: "🎭", rare: "N" },
  WILD: { name: "发疯者", emoji: "🌪️", rare: "N" },
  FREE: { name: "旷野行者", emoji: "🌌", rare: "SSR" },
  ALIEN: { name: "高维局外人", emoji: "👁️", rare: "UR" }
};

// ==================== 评分引擎 ====================

/**
 * 计算人格结果
 * @param {number[]} answers - 用户选择的选项索引数组 (0-3)
 * @returns {object} 结果对象
 */
function calculatePersonality(answers) {
  let scores = { A: 0, E: 0, S: 0, W: 0, D: 0 };

  // 计算各维度得分
  for (let i = 0; i < answers.length; i++) {
    const q = QUESTIONS[i];
    const optionIndex = answers[i];

    if (optionIndex >= q.options.length) {
      console.warn(`Q${i+1} 选项索引越界: ${optionIndex}`);
      continue;
    }

    const option = q.options[optionIndex];

    // UR触发检测 (Q20选C)
    if (i === 19 && option.UR && scores.A > 0) {
      return {
        personality: "ALIEN",
        scores: scores,
        trigger: "UR",
        reason: "Q20选C且A>0"
      };
    }

    // 累加分数
    for (const [key, val] of Object.entries(option.scores)) {
      if (key in scores) {
        scores[key] += val;
      }
    }
  }

  // SSR拦截检测 (A>=4 且 E<=-3)
  if (scores.A >= 4 && scores.E <= -3) {
    return {
      personality: "FREE",
      scores: scores,
      trigger: "SSR",
      reason: `A=${scores.A}>=4 且 E=${scores.E}<=-3`
    };
  }

  // Max-Vector 极值算法
  let maxAbs = -1;
  let dominant = '';
  let isNegative = false;
  let ties = []; // 平局检测

  for (const [key, val] of Object.entries(scores)) {
    let absVal = Math.abs(val);
    if (absVal > maxAbs) {
      maxAbs = absVal;
      dominant = key;
      isNegative = val < 0;
      ties = [key];
    } else if (absVal === maxAbs && absVal > 0) {
      ties.push(key);
    }
  }

  // 极值映射
  const mapping = {
    'A': isNegative ? 'FLOP' : 'KING',
    'E': isNegative ? 'NULL' : 'OOPS',
    'S': isNegative ? 'NULL' : 'PURE',
    'W': 'WILD',
    'D': 'FIRE'
  };

  const personality = mapping[dominant] || 'OOPS';

  return {
    personality: personality,
    scores: scores,
    dominant: dominant,
    isNegative: isNegative,
    maxAbs: maxAbs,
    ties: ties.length > 1 ? ties : null,
    trigger: "Max-Vector"
  };
}

// ==================== 测试模块 ====================

class PersonalityTestSimulator {
  constructor() {
    this.results = [];
    this.stats = {
      total: 0,
      personalities: {},
      triggers: { UR: 0, SSR: 0, "Max-Vector": 0 },
      ties: 0,
      scoreRanges: { A: [], E: [], S: [], W: [], D: [] }
    };
  }

  /**
   * 生成随机答案
   */
  generateRandomAnswers() {
    return QUESTIONS.map(q => {
      // 对于选项少的题目，限制随机范围
      return Math.floor(Math.random() * q.options.length);
    });
  }

  /**
   * 运行单次测试
   */
  runSingleTest() {
    const answers = this.generateRandomAnswers();
    const result = calculatePersonality(answers);

    this.results.push({ answers, result });
    this.stats.total++;

    // 统计人格分布
    this.stats.personalities[result.personality] =
      (this.stats.personalities[result.personality] || 0) + 1;

    // 统计触发机制
    this.stats.triggers[result.trigger]++;

    // 统计平局
    if (result.ties) this.stats.ties++;

    // 统计分数范围
    for (const [key, val] of Object.entries(result.scores)) {
      this.stats.scoreRanges[key].push(val);
    }

    return result;
  }

  /**
   * 运行N次测试
   */
  runBatchTest(count = 100) {
    console.log(`\n🧪 开始运行 ${count} 次随机测试...\n`);

    for (let i = 0; i < count; i++) {
      this.runSingleTest();
    }

    this.printReport();
    return this.stats;
  }

  /**
   * 打印测试报告
   */
  printReport() {
    console.log("=".repeat(60));
    console.log("📊 UNTI 评分系统测试报告");
    console.log("=".repeat(60));

    // 1. 人格分布
    console.log("\n🎭 人格分布统计：");
    console.log("-".repeat(40));
    const sortedPersonalities = Object.entries(this.stats.personalities)
      .sort((a, b) => b[1] - a[1]);

    for (const [key, count] of sortedPersonalities) {
      const p = PERSONALITIES[key];
      const percent = ((count / this.stats.total) * 100).toFixed(1);
      const bar = "█".repeat(Math.round(percent / 2));
      console.log(`${p.emoji} ${key.padEnd(8)} ${p.rare.padStart(3)} | ${bar} ${percent}% (${count})`);
    }

    // 2. 触发机制分布
    console.log("\n⚡ 触发机制统计：");
    console.log("-".repeat(40));
    for (const [key, count] of Object.entries(this.stats.triggers)) {
      const percent = ((count / this.stats.total) * 100).toFixed(1);
      console.log(`${key.padEnd(12)}: ${count} 次 (${percent}%)`);
    }

    // 3. 平局检测
    console.log("\n⚠️  平局情况：");
    console.log("-".repeat(40));
    const tiePercent = ((this.stats.ties / this.stats.total) * 100).toFixed(1);
    console.log(`平局次数: ${this.stats.ties} (${tiePercent}%)`);

    // 4. 分数范围统计
    console.log("\n📈 维度分数统计：");
    console.log("-".repeat(40));
    for (const [key, values] of Object.entries(this.stats.scoreRanges)) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
      console.log(`${key}: 范围 [${min}, ${max}] | 平均值: ${avg}`);
    }

    // 5. 分布均匀性评估
    console.log("\n✅ 分布均匀性评估：");
    console.log("-".repeat(40));
    const counts = Object.values(this.stats.personalities);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const variance = counts.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / counts.length;
    const stdDev = Math.sqrt(variance).toFixed(2);
    const cv = ((stdDev / avg) * 100).toFixed(1); // 变异系数

    console.log(`标准差: ${stdDev}`);
    console.log(`变异系数: ${cv}%`);

    if (cv < 30) {
      console.log("🟢 分布较为均匀");
    } else if (cv < 50) {
      console.log("🟡 分布有一定偏差，建议检查");
    } else {
      console.log("🔴 分布严重不均，需要优化算法");
    }

    console.log("\n" + "=".repeat(60));
  }

  /**
   * 获取示例测试结果
   */
  getSampleResult() {
    const sample = this.results[0];
    if (!sample) return null;

    return {
      answers: sample.answers,
      result: sample.result,
      detail: QUESTIONS.map((q, i) => ({
        question: q.question,
        selected: q.options[sample.answers[i]].text,
        scores: q.options[sample.answers[i]].scores
      }))
    };
  }
}

// ==================== 运行测试 ====================

const simulator = new PersonalityTestSimulator();
simulator.runBatchTest(100);

// 打印一个详细示例
console.log("\n📝 示例测试详情（第一次测试）：");
console.log("-".repeat(60));
const sample = simulator.getSampleResult();
if (sample) {
  console.log("\n答题记录:");
  sample.detail.forEach((item, i) => {
    console.log(`Q${i+1}: ${item.selected}`);
    console.log(`    → 分数变化: ${JSON.stringify(item.scores)}`);
  });
  console.log("\n最终分数:", sample.result.scores);
  console.log("判定结果:", sample.result.personality,
    `(${PERSONALITIES[sample.result.personality].name})`);
  console.log("触发机制:", sample.result.trigger);
}

// 导出供其他模块使用
module.exports = { calculatePersonality, QUESTIONS, PERSONALITIES, PersonalityTestSimulator };
