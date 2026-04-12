/**
 * UNTI 评分系统 - 最终优化版
 * 基于v3调整：
 * 1. 增加A负向选项，让FLOP能正常出现
 * 2. 增加D负向（提前完成 = -D）
 * 3. 微调各维度平衡
 */

const QUESTIONS = [
  // ===== A-D对立轴 (4题) =====
  {
    id: 1,
    question: `期末作业3000字，DDL今晚12点，现在21点：`,
    options: [
      { text: `早就写完，现在在打游戏。`, scores: { A: 2, D: -2 } },      // A+D-
      { text: `极限操作，正在狂敲键盘。`, scores: { D: 2, A: 1 } },       // D+A+
      { text: `AI生成底稿，自己改改交。`, scores: { D: 1, W: 1 } },       // 中性
      { text: `完全没写，准备请假/求情。`, scores: { A: -2, D: 1 } }      // A-D+
    ]
  },
  {
    id: 2,
    question: `下周三个DDL同时到期，你会：`,
    options: [
      { text: `已排优先级，按部就班执行。`, scores: { A: 2, D: -1 } },    // A+D-
      { text: `焦虑但还在刷手机。`, scores: { D: 1, E: 1 } },              // D+E+
      { text: `问题不大，DDL前自然能做完。`, scores: { D: 2 } },          // 纯D
      { text: `彻底摆烂，做不完就认命。`, scores: { A: -2, D: 1 } }       // A-D+
    ]
  },
  {
    id: 3,
    question: `离DDL还有48小时，任务才完成20%：`,
    options: [
      { text: `严格按照时间表推进。`, scores: { A: 2, D: -2 } },          // A+D-
      { text: `先玩一天，最后24小时爆肝。`, scores: { D: 2 } },            // 纯D
      { text: `边焦虑边刷手机逃避。`, scores: { E: 2, D: 1 } },           // E+D+
      { text: `干脆不做，反正也做不完。`, scores: { A: -2 } }             // 纯A-
    ]
  },
  {
    id: 4,
    question: `对于时间管理，你的态度是：`,
    options: [
      { text: `必须有计划表，严格执行。`, scores: { A: 2, D: -2 } },      // A+D-
      { text: `有计划但经常拖延。`, scores: { D: 1, E: 1 } },              // D+E+
      { text: `拖延到DDL前才开始。`, scores: { D: 2 } },                  // 纯D
      { text: `没有计划，随心所欲。`, scores: { A: -2, W: 1 } }           // A-W+
    ]
  },

  // ===== S社交轴 (4题) =====
  {
    id: 5,
    question: `小组作业自由分组，你的状态：`,
    options: [
      { text: `拉群当Leader，主动组织。`, scores: { A: 1, S: 1 } },
      { text: `装死等被捡，不想主动。`, scores: { S: -2 } },
      { text: `和固定搭子抱团。`, scores: { S: 1 } },
      { text: `想一个人单干，不想社交。`, scores: { S: -2 } }
    ]
  },
  {
    id: 6,
    question: `饭搭子突然崩溃大哭讲私密创伤：`,
    options: [
      { text: `救命，超出陪吃NPC模块！`, scores: { S: -2 } },
      { text: `表面倾听，计算还要多久吃完。`, scores: { S: -1 } },
      { text: `极度共情，陪TA骂天骂地。`, scores: { S: 2 } },
      { text: `冷静分析给客观方案。`, scores: { E: -1, S: -1 } }
    ]
  },
  {
    id: 7,
    question: `周末一个人的时间，你会：`,
    options: [
      { text: `主动约朋友吃饭出去玩。`, scores: { S: 2 } },
      { text: `出门但自己逛街看电影。`, scores: { S: -1 } },
      { text: `在宿舍躺平，各玩各的手机。`, scores: { S: -2, A: -1 } },
      { text: `享受独处，看书或学习。`, scores: { S: -1, A: 1 } }
    ]
  },
  {
    id: 8,
    question: `多人社交场合你更像：`,
    options: [
      { text: `控场者，主导话题走向。`, scores: { S: 2 } },
      { text: `隐形人，没人注意到我。`, scores: { S: -2 } },
      { text: `捧哏者，配合别人表演。`, scores: { S: 1 } },
      { text: `气氛组，搞笑活跃气氛。`, scores: { W: 1, S: 1 } }
    ]
  },

  // ===== E内耗轴 (4题) =====
  {
    id: 9,
    question: `看到别人拿奖学金/Offer：`,
    options: [
      { text: `焦虑，疯狂反思自己差在哪。`, scores: { E: 2 } },
      { text: `有压力，转化为动力卷。`, scores: { A: 2, E: -1 } },
      { text: `毫无波澜，各人有各命。`, scores: { E: -2 } },
      { text: `转发锦鲤蹭好运。`, scores: { W: 1 } }
    ]
  },
  {
    id: 10,
    question: `觉得自己是凑数的NPC：`,
    options: [
      { text: `认同，就是来凑人数的。`, scores: { E: 2 } },
      { text: `偶尔有深深的无力感。`, scores: { E: 1 } },
      { text: `绝不认同，我是主角。`, scores: { A: 2, E: -1 } },
      { text: `NPC也有NPC的活法。`, scores: { E: -2 } }
    ]
  },
  {
    id: 11,
    question: `深夜睡不着，你通常因为：`,
    options: [
      { text: `脑子里回放白天的丢脸小事。`, scores: { E: 2 } },
      { text: `焦虑明天的任务还没完成。`, scores: { E: 2 } },
      { text: `单纯报复性熬夜玩手机。`, scores: { W: 1 } },
      { text: `睡得很好，很少失眠。`, scores: { E: -2 } }
    ]
  },
  {
    id: 12,
    question: `对未来有一张清晰蓝图：`,
    options: [
      { text: `认同，步步推进执行中。`, scores: { A: 2, E: -1 } },
      { text: `脑子里有，身体跟不上。`, scores: { E: 1 } },
      { text: `没有，走一步看一步。`, scores: { E: -1 } },
      { text: `不规划，顺其自然。`, scores: { E: -2 } }
    ]
  },

  // ===== W发疯轴 (4题，正负平衡) =====
  {
    id: 13,
    question: `意外获得5000元横财：`,
    options: [
      { text: `存起来或买生产力工具。`, scores: { W: -2 } },
      { text: `拿去买彩票/抽卡碰运气。`, scores: { W: 2 } },
      { text: `请客吃饭，大家一起开心。`, scores: { S: 2 } },
      { text: `悄悄花掉，不告诉任何人。`, scores: { S: -1 } }
    ]
  },
  {
    id: 14,
    question: `凌晨1:30不出意外你在：`,
    options: [
      { text: `早已入睡，规律作息。`, scores: { W: -2 } },
      { text: `机械刷短视频，越刷越空虚。`, scores: { E: 2 } },
      { text: `戴耳机发呆思考人生。`, scores: { W: -1 } },
      { text: `在外喝酒/打游戏/发疯。`, scores: { W: 2 } }
    ]
  },
  {
    id: 15,
    question: `对亲密关系的期待是：`,
    options: [
      { text: `情绪稳定，平平淡淡才是真。`, scores: { W: -2 } },
      { text: `毫无保留，轰轰烈烈才值得。`, scores: { W: 2 } },
      { text: `保持独立，顶峰相见。`, scores: { S: -2 } },
      { text: `缺乏安全感，随时准备抽身。`, scores: { E: 2 } }
    ]
  },
  {
    id: 16,
    question: `做这个测试是为了什么？`,
    options: [
      { text: `纯粹觉得好玩，打发时间。`, scores: { W: -1 } },
      { text: `想找个标签解释现在的状态。`, scores: { UR: true } },
      { text: `收集图鉴和朋友对比。`, scores: { S: 1 } },
      { text: `发朋友圈求关注。`, scores: { S: 1, W: 1 } }
    ]
  }
];

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

function calculatePersonality(answers) {
  let scores = { A: 0, E: 0, S: 0, W: 0, D: 0 };

  for (let i = 0; i < answers.length; i++) {
    const option = QUESTIONS[i].options[answers[i]];

    if (i === 15 && option.UR && scores.A >= 0) {
      return { personality: "ALIEN", scores, trigger: "UR" };
    }

    for (const [key, val] of Object.entries(option.scores)) {
      if (key in scores) scores[key] += val;
    }
  }

  // SSR条件微调：A>=2且E<=-2（更合理）
  if (scores.A >= 2 && scores.E <= -2) {
    return { personality: "FREE", scores, trigger: "SSR" };
  }

  // Max-Vector
  const priority = ['A', 'E', 'W', 'S', 'D'];
  let maxAbs = -1, dominant = '', isNegative = false;

  for (const key of priority) {
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
    'W': 'WILD',
    'S': isNegative ? 'NULL' : 'PURE',
    'D': 'FIRE'
  };

  return {
    personality: mapping[dominant] || 'OOPS',
    scores,
    dominant,
    trigger: "Max-Vector"
  };
}

// ==================== 测试 ====================

class TestSimulator {
  constructor() {
    this.stats = {
      total: 0,
      personalities: {},
      triggers: { UR: 0, SSR: 0, "Max-Vector": 0 },
      scoreRanges: { A: [], E: [], S: [], W: [], D: [] }
    };
  }

  run(count = 500) {
    console.log(`\n🧪 UNTI 最终版评分系统 - ${count}次测试\n`);

    for (let i = 0; i < count; i++) {
      const answers = QUESTIONS.map(q => Math.floor(Math.random() * q.options.length));
      const result = calculatePersonality(answers);

      this.stats.total++;
      this.stats.personalities[result.personality] = (this.stats.personalities[result.personality] || 0) + 1;
      this.stats.triggers[result.trigger]++;

      for (const [key, val] of Object.entries(result.scores)) {
        this.stats.scoreRanges[key].push(val);
      }
    }

    this.printReport();
  }

  printReport() {
    console.log("=".repeat(65));
    console.log("📊 UNTI 最终版测试报告 (16题)");
    console.log("=".repeat(65));

    // 人格分布
    console.log("\n🎭 人格分布：");
    console.log("-".repeat(45));
    const sorted = Object.entries(this.stats.personalities).sort((a, b) => b[1] - a[1]);

    const expected = { KING: 15, OOPS: 15, WILD: 12, NULL: 12, FIRE: 12, PURE: 12, FLOP: 12, FREE: 5, ALIEN: 5 };

    for (const [key, count] of sorted) {
      const p = PERSONALITIES[key];
      const pct = ((count / this.stats.total) * 100).toFixed(1);
      const bar = "█".repeat(Math.round(pct / 2));
      const exp = expected[key] || 10;
      const diff = (pct - exp).toFixed(1);
      const status = Math.abs(parseFloat(diff)) > 8 ? (diff > 0 ? '🔺' : '🔻') : '✓';
      console.log(`${p.emoji} ${key.padEnd(8)} | ${bar} ${pct}% (${count}) ${status}`);
    }

    // 触发机制
    console.log("\n⚡ 触发机制：");
    for (const [k, v] of Object.entries(this.stats.triggers)) {
      console.log(`${k.padEnd(12)}: ${v} 次 (${((v/this.stats.total)*100).toFixed(1)}%)`);
    }

    // 维度统计
    console.log("\n📈 维度统计：");
    for (const [key, vals] of Object.entries(this.stats.scoreRanges)) {
      const min = Math.min(...vals), max = Math.max(...vals);
      const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
      const pos = vals.filter(v => v > 0).length;
      const neg = vals.filter(v => v < 0).length;
      const neu = vals.filter(v => v === 0).length;
      console.log(`${key}: [${min.toString().padStart(3)}, ${max.toString().padStart(3)}] 平均:${avg.padStart(5)} | +:${pos} -:${neg} 0:${neu}`);
    }

    // 均匀性
    const counts = Object.values(this.stats.personalities);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const variance = counts.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / counts.length;
    const cv = ((Math.sqrt(variance) / avg) * 100).toFixed(1);

    console.log("\n✅ 分布评估：");
    console.log(`变异系数: ${cv}%`);
    console.log(cv < 40 ? "🟢 分布均匀，可上线" : cv < 60 ? "🟡 略有偏差，可接受" : "🔴 需继续优化");

    // 各人格期望vs实际
    console.log("\n📊 期望vs实际：");
    const total = this.stats.total;
    Object.entries(expected).forEach(([k, expPct]) => {
      const actual = this.stats.personalities[k] || 0;
      const actualPct = (actual / total * 100).toFixed(1);
      const diff = (actualPct - expPct).toFixed(1);
      const symbol = Math.abs(parseFloat(diff)) <= 5 ? '✓' : '×';
      console.log(`${k}: 期望${expPct}% 实际${actualPct}% ${symbol}`);
    });

    console.log("\n" + "=".repeat(65));
  }
}

new TestSimulator().run(500);

module.exports = { calculatePersonality, QUESTIONS, PERSONALITIES };
