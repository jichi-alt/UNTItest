/**
 * UNTI 评分系统 v2 - 重构版18题题库
 * 优化点：
 * 1. 删除/重写问题题目
 * 2. 每题最多影响2个维度
 * 3. D维度增加4题
 * 4. W正负平衡
 * 5. 全部统一4选项
 */

// ==================== 重构题库 (18题) ====================
const QUESTIONS = [
  // ========== 保留的优秀题 (6道) ==========
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
    id: 12,
    question: `多人社交场合更像：`,
    options: [
      { text: `隐形人。`, scores: { S: -2 } },
      { text: `控场者。`, scores: { A: 2 } },
      { text: `捧哏/怨种。`, scores: { E: 2 } },
      { text: `气氛组。`, scores: { W: 1 } }
    ]
  },
  {
    id: 20,
    question: `做这个测试是为了什么？`,
    options: [
      { text: `纯粹觉得好玩，发朋友圈。`, scores: { S: 1 } },
      { text: `看别人测想了解自己品种。`, scores: { A: 1 } },
      { text: `想在这个世界找个借口拖延5分钟...`, scores: { UR: true } },
      { text: `收集人格图鉴，和室友对比。`, scores: { S: 1 } }
    ]
  },

  // ========== 微调的良好评 (5道) ==========
  {
    id: 2,
    question: `对未来有一张清晰蓝图。`,
    options: [
      { text: `认同，步步推进。`, scores: { A: 2 } },
      { text: `脑子里有，身体跟不上。`, scores: { E: 2 } },
      { text: `没有，走一步看一步。`, scores: { E: -1 } },
      { text: `蓝图？活过下周就行。`, scores: { W: 1 } }
    ]
  },
  {
    id: 5,
    question: `深度亲密关系底层需求：`,
    options: [
      { text: `毫无保留分享，时刻绑定。`, scores: { S: 2 } },
      { text: `保持独立空间，顶峰相见。`, scores: { S: -2 } },
      { text: `缺乏安全感，随时准备抽身。`, scores: { E: 2 } },
      { text: `情绪稳定，平平淡淡才是真。`, scores: { W: -1 } }  // W-1: 不疯
    ]
  },
  {
    id: 7,
    question: `暧昧对象朋友圈给异性发暧昧评论：`,
    options: [
      { text: `瞬间下头，判死刑。`, scores: { S: -2 } },
      { text: `疯狂内耗，怀疑自己不好。`, scores: { E: 2 } },
      { text: `截图痛骂中央空调，下个更乖。`, scores: { W: 2 } },
      { text: `假装没看见，逃避可耻但有用。`, scores: { E: 1 } }
    ]
  },
  {
    id: 10,
    question: `很多时候觉得自己是凑数的 NPC：`,
    options: [
      { text: `认同，就是凑人数的。`, scores: { S: -2 } },  // 改为S
      { text: `偶尔有深深的无力感。`, scores: { E: 2 } },
      { text: `绝不认同，我是主角。`, scores: { A: 2 } },
      { text: `就算 NPC 也是最疯的那个。`, scores: { W: 2 } }
    ]
  },
  {
    id: 15,
    question: `凌晨 1:30 不出意外你在：`,
    options: [
      { text: `机械滑短视频，越刷越空虚。`, scores: { E: 2 } },
      { text: `早就睡了或在爆肝目标。`, scores: { A: 2 } },
      { text: `脑子里回放丢脸小事扭蛆。`, scores: { E: 1 } },
      { text: `平静入睡，明天还要早八。`, scores: { W: -2 } }  // W-2: 规律生活
    ]
  },

  // ========== 重写的一般/较差题 (7道) ==========

  // Q8重写：拆分兴趣爱好，专注社交维度
  {
    id: 8,
    question: `周末一个人的时间，你会：`,
    options: [
      { text: `主动联系朋友约饭约局。`, scores: { S: 2 } },
      { text: `出门但自己逛街看电影。`, scores: { S: -1 } },
      { text: `宿舍躺平，各玩各的手机。`, scores: { S: -2 } },
      { text: `享受独处，看书或学习。`, scores: { S: -1, A: 1 } }
    ]
  },

  // Q9重写：专注消费决策风格
  {
    id: 9,
    question: `看上一件500块的衣服，但生活费紧张：`,
    options: [
      { text: `咬咬牙买了，开心最重要。`, scores: { W: 2 } },
      { text: `疯狂比价找平替，犹豫三天。`, scores: { D: 2 } },  // 拖延决策
      { text: `直接放弃，不买立省100%。`, scores: { A: 2 } },  // 果断
      { text: `找爸妈撒娇或吃一周泡面。`, scores: { E: 2 } }   // 内耗式解决
    ]
  },

  // Q11微调：移除投机选项的W
  {
    id: 11,
    question: `意外获得 5000 元横财：`,
    options: [
      { text: `存定期/买生产力工具。`, scores: { A: 2 } },
      { text: `拿去买彩票/抽卡碰运气。`, scores: { D: 2 } },  // 改为D：赌DDL
      { text: `群里发红包请客，一起开心。`, scores: { S: 2 } },
      { text: `悄悄吃大餐，不发朋友圈。`, scores: { S: -1 } }
    ]
  },

  // Q13保留但调整W
  {
    id: 13,
    question: `理想周末典型度过方式：`,
    options: [
      { text: `床是本体，外卖维生。`, scores: { A: -2 } },
      { text: `自律去图书馆/健身房。`, scores: { A: 2 } },
      { text: `暴走 Citywalk 或特种兵旅行。`, scores: { W: 1 } },  // 降为+1
      { text: `约朋友剧本杀/聚餐/唱K。`, scores: { S: 2 } }      // 改为S
    ]
  },

  // Q14重写：专注DDL场景
  {
    id: 14,
    question: `离DDL还有48小时，任务完成了20%：`,
    options: [
      { text: `已经做了详细时间表，按计划走。`, scores: { A: 2 } },
      { text: `先玩一天，最后24小时爆肝。`, scores: { D: 2 } },
      { text: `焦虑到失眠但还没开始。`, scores: { E: 2 } },
      { text: `随缘，做不完就认命。`, scores: { W: -1 } }  // 不挣扎
    ]
  },

  // Q16重写：专注应对方式
  {
    id: 16,
    question: `考试挂科，成绩已出无法挽回：`,
    options: [
      { text: `立即查补考时间，制定复习计划。`, scores: { A: 2 } },
      { text: `找朋友大哭一场发泄情绪。`, scores: { S: 2 } },
      { text: `事已至此，先吃顿好的再说。`, scores: { W: 1 } },  // 降为+1
      { text: `反复回想如果当初努力就好了。`, scores: { E: 2 } }
    ]
  },

  // Q17重写：删除流浪猫，改为学习场景
  {
    id: 17,
    question: `图书馆学了一小时，发现啥也没记住：`,
    options: [
      { text: `调整方法继续学，不信邪。`, scores: { A: 2 } },
      { text: `心态崩了，刷手机平复一下。`, scores: { E: 2 } },
      { text: `算了，明天再说，先回宿舍。`, scores: { D: 2 } },  // DDL战士
      { text: `找朋友吐槽求安慰。`, scores: { S: 2 } }
    ]
  },

  // Q18重写：专注压力应对
  {
    id: 18,
    question: `下周有三个DDL同时到期：`,
    options: [
      { text: `已经排好优先级和时间表。`, scores: { A: 2 } },
      { text: `一边焦虑一边刷手机逃避。`, scores: { E: 2 } },
      { text: `问题不大，DDL前自然能做完。`, scores: { D: 2 } },
      { text: `发朋友圈求大神带飞。`, scores: { S: 1 } }
    ]
  },

  // Q19重写：删除emo题，改为时间管理
  {
    id: 19,
    question: `对于时间管理，你的态度是：`,
    options: [
      { text: `必须有计划表，按部就班执行。`, scores: { A: 2 } },
      { text: `计划永远赶不上变化，随意点。`, scores: { D: 2 } },
      { text: `想做就做，不想做就躺。`, scores: { W: 1 } },
      { text: `常因拖延后悔，但下次还敢。`, scores: { E: 2 } }
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

// ==================== 评分引擎 v2 ====================

function calculatePersonality(answers) {
  let scores = { A: 0, E: 0, S: 0, W: 0, D: 0 };

  for (let i = 0; i < answers.length; i++) {
    const q = QUESTIONS[i];
    const optionIndex = answers[i];

    if (optionIndex >= q.options.length) {
      console.warn(`Q${i+1} 选项索引越界: ${optionIndex}`);
      continue;
    }

    const option = q.options[optionIndex];

    // UR触发检测
    if (i === 17 && option.UR && scores.A > 0) {  // Q18是第18题，索引17
      return {
        personality: "ALIEN",
        scores: scores,
        trigger: "UR",
        reason: "Q18选C且A>0"
      };
    }

    for (const [key, val] of Object.entries(option.scores)) {
      if (key in scores) {
        scores[key] += val;
      }
    }
  }

  // SSR拦截 - 降低门槛
  if (scores.A >= 3 && scores.E <= -2) {
    return {
      personality: "FREE",
      scores: scores,
      trigger: "SSR",
      reason: `A=${scores.A}>=3 且 E=${scores.E}<=-2`
    };
  }

  // Max-Vector 极值算法 - 改进平局处理
  let maxAbs = -1;
  let dominant = '';
  let isNegative = false;
  let ties = [];

  // 按固定优先级排序处理平局：A > E > W > S > D
  const priority = ['A', 'E', 'W', 'S', 'D'];

  for (const key of priority) {
    const val = scores[key];
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

// ==================== 测试模块 v2 ====================

class PersonalityTestSimulator {
  constructor() {
    this.results = [];
    this.stats = {
      total: 0,
      personalities: {},
      triggers: { UR: 0, SSR: 0, "Max-Vector": 0 },
      ties: 0,
      scoreRanges: { A: [], E: [], S: [], W: [], D: [] },
      dimensionCount: { A: 0, E: 0, S: 0, W: 0, D: 0 }  // 统计每道题影响的维度
    };

    // 统计每道题影响的维度数
    this.questionStats = QUESTIONS.map((q, i) => ({
      id: i + 1,
      question: q.question.substring(0, 30) + "...",
      dimensionsAffected: new Set(),
      totalOptions: q.options.length
    }));
  }

  generateRandomAnswers() {
    return QUESTIONS.map(q => Math.floor(Math.random() * q.options.length));
  }

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

    // 统计每道题影响的维度
    answers.forEach((ansIdx, qIdx) => {
      const option = QUESTIONS[qIdx].options[ansIdx];
      Object.keys(option.scores).forEach(dim => {
        if (dim !== 'UR') {
          this.questionStats[qIdx].dimensionsAffected.add(dim);
        }
      });
    });

    return result;
  }

  runBatchTest(count = 200) {
    console.log(`\n🧪 UNTI v2 评分系统测试 - ${count}次随机测试\n`);

    for (let i = 0; i < count; i++) {
      this.runSingleTest();
    }

    this.printReport();
    return this.stats;
  }

  printReport() {
    console.log("=".repeat(70));
    console.log("📊 UNTI v2 评分系统测试报告");
    console.log("=".repeat(70));

    // 1. 人格分布
    console.log("\n🎭 人格分布统计：");
    console.log("-".repeat(50));
    const sortedPersonalities = Object.entries(this.stats.personalities)
      .sort((a, b) => b[1] - a[1]);

    for (const [key, count] of sortedPersonalities) {
      const p = PERSONALITIES[key];
      const percent = ((count / this.stats.total) * 100).toFixed(1);
      const bar = "█".repeat(Math.round(percent / 2));
      const isMissing = percent < 5;
      console.log(`${p.emoji} ${key.padEnd(8)} ${p.rare.padStart(3)} | ${bar} ${percent}% (${count})${isMissing ? ' ⚠️' : ''}`);
    }

    // 2. 触发机制
    console.log("\n⚡ 触发机制统计：");
    console.log("-".repeat(50));
    for (const [key, count] of Object.entries(this.stats.triggers)) {
      const percent = ((count / this.stats.total) * 100).toFixed(1);
      console.log(`${key.padEnd(12)}: ${count} 次 (${percent}%)`);
    }

    // 3. 平局情况
    console.log("\n⚠️  平局情况：");
    console.log("-".repeat(50));
    const tiePercent = ((this.stats.ties / this.stats.total) * 100).toFixed(1);
    console.log(`平局次数: ${this.stats.ties} (${tiePercent}%)`);

    // 4. 维度分数统计
    console.log("\n📈 维度分数统计：");
    console.log("-".repeat(50));
    for (const [key, values] of Object.entries(this.stats.scoreRanges)) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
      const positive = values.filter(v => v > 0).length;
      const negative = values.filter(v => v < 0).length;
      console.log(`${key}: [${min}, ${max}] 平均:${avg} | +:${positive} -:${negative}`);
    }

    // 5. 分布均匀性
    console.log("\n✅ 分布均匀性评估：");
    console.log("-".repeat(50));
    const counts = Object.values(this.stats.personalities);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const variance = counts.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / counts.length;
    const stdDev = Math.sqrt(variance).toFixed(2);
    const cv = ((stdDev / avg) * 100).toFixed(1);

    console.log(`标准差: ${stdDev} | 变异系数: ${cv}%`);
    if (cv < 30) console.log("🟢 分布均匀");
    else if (cv < 50) console.log("🟡 分布有一定偏差");
    else console.log("🔴 分布不均，需优化");

    // 6. 题目质量分析
    console.log("\n📋 题目维度影响分析：");
    console.log("-".repeat(50));
    this.questionStats.forEach(q => {
      const dimCount = q.dimensionsAffected.size;
      const status = dimCount > 2 ? '🔴' : dimCount === 2 ? '🟡' : '🟢';
      console.log(`${status} Q${q.id.toString().padStart(2)}: ${q.question.padEnd(25)} 影响${dimCount}维 选项${q.totalOptions}个`);
    });

    console.log("\n" + "=".repeat(70));
  }

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
simulator.runBatchTest(200);

// 打印示例
console.log("\n📝 示例测试详情（第一次测试）：");
console.log("-".repeat(70));
const sample = simulator.getSampleResult();
if (sample) {
  console.log("\n答题记录:");
  sample.detail.slice(0, 10).forEach((item, i) => {
    console.log(`Q${i+1}: ${item.selected.substring(0, 25)}... → ${JSON.stringify(item.scores)}`);
  });
  console.log("...");
  console.log("\n最终分数:", sample.result.scores);
  console.log("判定结果:", sample.result.personality,
    `(${PERSONALITIES[sample.result.personality].name})`);
  console.log("触发机制:", sample.result.trigger);
}

module.exports = { calculatePersonality, QUESTIONS, PERSONALITIES, PersonalityTestSimulator };
