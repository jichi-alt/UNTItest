/**
 * UNTI 评分系统 - "千人千面"精准版
 * 设计原则：
 * 1. 9人格都能被合理触发
 * 2. 每种人格有细分描述，让描述更精准
 * 3. 保留副人格系统增加独特性
 */

// ==================== 16题精准版题库 ====================
const QUESTIONS = [
  // ===== A-D轴（执行vs死线）4题 =====
  {
    id: 1,
    question: `期末作业3000字，DDL今晚12点，现在21点：`,
    options: [
      { text: `早就写完，现在在打游戏。`, scores: { A: 3, D: -2 } },
      { text: `正在疯狂敲键盘赶进度。`, scores: { D: 3, A: 1 } },
      { text: `用AI生成再改改交上去。`, scores: { D: 2, W: 1 } },
      { text: `完全没写，准备求情/摆烂。`, scores: { A: -2, D: 1 } }
    ]
  },
  {
    id: 2,
    question: `下周三个DDL同时到期：`,
    options: [
      { text: `已排好优先级和时间表。`, scores: { A: 3, D: -1 } },
      { text: `焦虑但还在刷手机。`, scores: { D: 2, E: 2 } },
      { text: `DDL前总能做完的。`, scores: { D: 3 } },
      { text: `做不完就算了，躺平。`, scores: { A: -3 } }
    ]
  },
  {
    id: 3,
    question: `离DDL还有48小时，任务完成20%：`,
    options: [
      { text: `严格按照时间表推进。`, scores: { A: 3, D: -2 } },
      { text: `先玩一天，最后24小时爆肝。`, scores: { D: 3 } },
      { text: `边焦虑边刷手机逃避。`, scores: { E: 3, D: 1 } },
      { text: `干脆不做，反正也做不完。`, scores: { A: -3 } }
    ]
  },
  {
    id: 4,
    question: `对于时间管理，你的态度是：`,
    options: [
      { text: `必须有计划表，严格执行。`, scores: { A: 3, D: -2 } },
      { text: `有计划但经常拖延。`, scores: { D: 2, E: 1 } },
      { text: `拖延到DDL前才开始。`, scores: { D: 3 } },
      { text: `没有计划，随心所欲。`, scores: { A: -3, W: 1 } }
    ]
  },

  // ===== S社交轴 4题 =====
  {
    id: 5,
    question: `小组作业自由分组，你的状态：`,
    options: [
      { text: `拉群当Leader，主动组织。`, scores: { S: 3, A: 1 } },
      { text: `装死等被捡，不想主动。`, scores: { S: -3 } },
      { text: `和固定搭子抱团。`, scores: { S: 2 } },
      { text: `想一个人单干，不想社交。`, scores: { S: -3 } }
    ]
  },
  {
    id: 6,
    question: `饭搭子突然崩溃大哭讲私密创伤：`,
    options: [
      { text: `救命，超出陪吃NPC模块！`, scores: { S: -3 } },
      { text: `表面倾听，想快点吃完。`, scores: { S: -2 } },
      { text: `极度共情，陪TA骂天骂地。`, scores: { S: 3 } },
      { text: `冷静分析给客观方案。`, scores: { E: -2 } }
    ]
  },
  {
    id: 7,
    question: `周末一个人的时间，你会：`,
    options: [
      { text: `主动约朋友吃饭出去玩。`, scores: { S: 3 } },
      { text: `出门但自己逛街看电影。`, scores: { S: -1 } },
      { text: `在宿舍躺平，各玩各的手机。`, scores: { S: -3 } },
      { text: `享受独处，看书或学习。`, scores: { S: -2, A: 1 } }
    ]
  },
  {
    id: 8,
    question: `多人社交场合你更像：`,
    options: [
      { text: `控场者，主导话题走向。`, scores: { S: 3 } },
      { text: `隐形人，没人注意到我。`, scores: { S: -3 } },
      { text: `捧哏者，配合别人表演。`, scores: { S: 2 } },
      { text: `气氛组，搞笑活跃气氛。`, scores: { W: 2, S: 1 } }
    ]
  },

  // ===== E内耗轴 4题 =====
  {
    id: 9,
    question: `看到别人拿奖学金/Offer：`,
    options: [
      { text: `焦虑，疯狂反思自己差在哪。`, scores: { E: 3 } },
      { text: `有压力，转化为动力卷。`, scores: { A: 2, E: -1 } },
      { text: `毫无波澜，各人有各命。`, scores: { E: -3 } },
      { text: `转发锦鲤蹭好运。`, scores: { W: 1 } }
    ]
  },
  {
    id: 10,
    question: `觉得自己是凑数的NPC：`,
    options: [
      { text: `认同，就是来凑人数的。`, scores: { E: 3 } },
      { text: `偶尔有深深的无力感。`, scores: { E: 2 } },
      { text: `绝不认同，我是主角。`, scores: { A: 2, E: -2 } },
      { text: `NPC也有NPC的活法。`, scores: { E: -2 } }
    ]
  },
  {
    id: 11,
    question: `深夜睡不着，你通常因为：`,
    options: [
      { text: `脑子里回放白天的丢脸小事。`, scores: { E: 3 } },
      { text: `焦虑明天的任务还没完成。`, scores: { E: 3 } },
      { text: `单纯报复性熬夜玩手机。`, scores: { W: 2 } },
      { text: `睡得很好，很少失眠。`, scores: { E: -3 } }
    ]
  },
  {
    id: 12,
    question: `对未来有一张清晰蓝图：`,
    options: [
      { text: `认同，步步推进执行中。`, scores: { A: 3, E: -1 } },
      { text: `脑子里有，身体跟不上。`, scores: { E: 2 } },
      { text: `没有，走一步看一步。`, scores: { E: -2 } },
      { text: `不规划，顺其自然。`, scores: { E: -3 } }
    ]
  },

  // ===== W发疯轴 4题（正负平衡） =====
  {
    id: 13,
    question: `意外获得5000元横财：`,
    options: [
      { text: `存起来或买生产力工具。`, scores: { W: -3 } },
      { text: `拿去买彩票/抽卡碰运气。`, scores: { W: 3 } },
      { text: `请客吃饭，大家一起开心。`, scores: { S: 3 } },
      { text: `悄悄花掉，不告诉任何人。`, scores: { S: -2 } }
    ]
  },
  {
    id: 14,
    question: `凌晨1:30不出意外你在：`,
    options: [
      { text: `早已入睡，规律作息。`, scores: { W: -3 } },
      { text: `机械刷短视频，越刷越空虚。`, scores: { E: 3 } },
      { text: `戴耳机发呆思考人生。`, scores: { W: -2 } },
      { text: `在外喝酒/打游戏/发疯。`, scores: { W: 3 } }
    ]
  },
  {
    id: 15,
    question: `对亲密关系的期待是：`,
    options: [
      { text: `情绪稳定，平平淡淡才是真。`, scores: { W: -3 } },
      { text: `毫无保留，轰轰烈烈才值得。`, scores: { W: 3 } },
      { text: `保持独立，顶峰相见。`, scores: { S: -3 } },
      { text: `缺乏安全感，随时准备抽身。`, scores: { E: 3 } }
    ]
  },
  {
    id: 16,
    question: `做这个测试是为了什么？`,
    options: [
      { text: `纯粹觉得好玩，打发时间。`, scores: { W: -2 } },
      { text: `想找个标签解释现在的状态。`, scores: { UR: true } },
      { text: `收集图鉴和朋友对比。`, scores: { S: 2 } },
      { text: `发朋友圈求关注。`, scores: { S: 1, W: 2 } }
    ]
  }
];

// ==================== 9人格定义 + 副人格系统 ====================

const PERSONALITIES = {
  KING: {
    name: "六边形战士",
    emoji: "👑",
    rare: "N",
    subTypes: {
      highA_highS: "社交型卷王",      // A>8, S>5
      highA_lowS: "独狼型卷王",       // A>8, S<0
      highA_highW: "疯批卷王",        // A>8, W>5
      balanced: "标准六边形"          // 其他
    }
  },
  NULL: {
    name: "隐形 NPC",
    emoji: "🪨",
    rare: "N",
    subTypes: {
      highE_lowS: "社恐NPC",          // E>8, S<-5
      lowE_lowS: "佛系NPC",           // E<0, S<-5
      highW_lowS: "疯批NPC",          // W>5, S<-5
      balanced: "标准NPC"
    }
  },
  FIRE: {
    name: "赶Due狂徒",
    emoji: "🔥",
    rare: "N",
    subTypes: {
      highD_highA: "高效DDL战士",      // D>8, A>5
      highD_highW: "疯批DDL战士",      // D>8, W>5
      highD_highE: "焦虑DDL战士",      // D>8, E>5
      balanced: "标准DDL战士"
    }
  },
  FLOP: {
    name: "仰卧者",
    emoji: "🛌",
    rare: "N",
    subTypes: {
      lowA_highE: "焦虑仰卧者",        // A<-5, E>5
      lowA_highW: "发疯仰卧者",        // A<-5, W>5
      lowA_lowE: "佛系仰卧者",         // A<-5, E<0
      balanced: "标准仰卧者"
    }
  },
  PURE: {
    name: "清澈者",
    emoji: "🌸",
    rare: "N",
    subTypes: {
      highS_lowE: "阳光清澈",          // S>8, E<0
      highS_highE: "敏感清澈",         // S>8, E>0
      highS_lowW: "乖巧清澈",          // S>8, W<0
      balanced: "标准清澈"
    }
  },
  OOPS: {
    name: "哦，天哪者",
    emoji: "🎭",
    rare: "N",
    subTypes: {
      highE_highW: "倒霉发疯者",       // E>8, W>5
      highE_lowW: "倒霉焦虑者",        // E>8, W<0
      highE_highS: "倒霉社牛",         // E>8, S>5
      balanced: "标准倒霉蛋"
    }
  },
  WILD: {
    name: "发疯者",
    emoji: "🌪️",
    rare: "N",
    subTypes: {
      highW_highA: "行动派疯批",       // W>8, A>5
      highW_lowA: "躺平派疯批",        // W>8, A<0
      highW_highS: "社交疯批",         // W>8, S>5
      balanced: "标准发疯者"
    }
  },
  FREE: {
    name: "旷野行者",
    emoji: "🌌",
    rare: "SSR",
    subTypes: {
      default: "真正的自由灵魂"
    }
  },
  ALIEN: {
    name: "高维局外人",
    emoji: "👁️",
    rare: "UR",
    subTypes: {
      default: "无法被理解的观察者"
    }
  }
};

// 副人格描述
const SUB_PERSONALITY_DESC = {
  // KING副人格
  "社交型卷王": "你是团队的核心，不仅自己卷，还能带动别人一起卷。",
  "独狼型卷王": "你更喜欢一个人默默努力，不声不响地惊艳所有人。",
  "疯批卷王": "你卷得很有个性，常常用非常规手段达成目标。",
  "标准六边形": "各方面都很均衡，没有明显短板。",

  // NULL副人格
  "社恐NPC": "你害怕社交，宁愿躲在角落当背景板。",
  "佛系NPC": "你不在乎别人的眼光，活在自己的世界里。",
  "疯批NPC": "表面是NPC，内心戏超多，经常独自发疯。",
  "标准NPC": "安静、透明，但关键时刻也很可靠。",

  // FIRE副人格
  "高效DDL战士": "你在压力下爆发惊人效率，DDL是你的肾上腺素。",
  "疯批DDL战士": "DDL前你不仅赶工，还要发疯缓解压力。",
  "焦虑DDL战士": "每次DDL都像在渡劫，但你总能熬过去。",
  "标准DDL战士": "你和DDL有着命中注定的孽缘。",

  // FLOP副人格
  "焦虑仰卧者": "想卷卷不动，想躺躺不平，仰卧起坐冠军。",
  "发疯仰卧者": "虽然摆烂，但摆得很有态度，谁也别想管我。",
  "佛系仰卧者": "真正的躺平大师，内心毫无波澜。",
  "标准仰卧者": "间歇性踌躇满志，持续性混吃等死。",

  // PURE副人格
  "阳光清澈": "你像小太阳一样温暖，正能量满满。",
  "敏感清澈": "你很真诚，但也容易受伤。",
  "乖巧清澈": "你懂事得让人心疼，总是为别人着想。",
  "标准清澈": "未经世俗污染的纯真， rare species。",

  // OOPS副人格
  "倒霉发疯者": "生活虐你千百遍，你选择发疯给生活看。",
  "倒霉焦虑者": "为什么倒霉的总是我？陷入无限循环。",
  "倒霉社牛": "虽然倒霉，但身边总有一群人陪你。",
  "标准倒霉蛋": "自带事故体质，但总能化险为夷。",

  // WILD副人格
  "行动派疯批": "你不仅疯，还能把疯变成行动力。",
  "躺平派疯批": "发疯是你的生活方式，不在乎世俗眼光。",
  "社交疯批": "你是聚会的气氛担当，没有你就没有灵魂。",
  "标准发疯者": "精神状态领先人类50个版本。",

  // 隐藏款
  "真正的自由灵魂": "在这个内卷的世界里，你找到了真正的旷野。",
  "无法被理解的观察者": "你看得太透，反而显得格格不入。"
};

// ==================== 评分引擎 ====================

function calculatePersonality(answers) {
  let scores = { A: 0, E: 0, S: 0, W: 0, D: 0 };
  let selectedUR = false;

  // 先累计所有分数
  for (let i = 0; i < answers.length; i++) {
    const option = QUESTIONS[i].options[answers[i]];

    // 记录是否选中UR选项
    if (i === 15 && option.scores && option.scores.UR) {
      selectedUR = true;
    }

    for (const [key, val] of Object.entries(option.scores)) {
      if (key in scores) scores[key] += val;
    }
  }

  // UR触发逻辑 - 在分数完全累计后判断
  if (selectedUR) {
    // 条件1: 高内耗的局外人 (E >= 6)
    // 条件2: 看透但被困 (A >= 4 && E >= 4)
    // 条件3: 随机30%隐藏款
    const isHighE = scores.E >= 6;
    const isAwakeButTrapped = scores.A >= 4 && scores.E >= 4;
    const isRandomLuck = Math.random() < 0.3;

    if (isHighE || isAwakeButTrapped || isRandomLuck) {
      return {
        personality: "ALIEN",
        scores,
        subType: "default",
        trigger: "UR",
        desc: SUB_PERSONALITY_DESC["无法被理解的观察者"]
      };
    }
  }

  // SSR触发 - 合理的中间状态
  if (scores.A >= 2 && scores.A <= 6 && scores.E <= -2 && scores.W >= 2) {
    return {
      personality: "FREE",
      scores,
      subType: "default",
      trigger: "SSR",
      desc: SUB_PERSONALITY_DESC["真正的自由灵魂"]
    };
  }

  // Max-Vector 极值算法
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

  // 人格映射
  const mapping = {
    'A': isNegative ? 'FLOP' : 'KING',
    'E': isNegative ? 'NULL' : 'OOPS',
    'S': isNegative ? 'NULL' : 'PURE',
    'W': 'WILD',
    'D': 'FIRE'
  };

  const personality = mapping[dominant];
  const subType = determineSubType(personality, scores);

  return {
    personality,
    scores,
    subType,
    trigger: "Max-Vector",
    desc: SUB_PERSONALITY_DESC[subType]
  };
}

function determineSubType(personality, scores) {
  const { A, E, S, W, D } = scores;

  switch (personality) {
    case 'KING':
      if (A > 8 && S > 5) return "社交型卷王";
      if (A > 8 && S < 0) return "独狼型卷王";
      if (A > 8 && W > 5) return "疯批卷王";
      return "标准六边形";

    case 'NULL':
      if (E > 8 && S < -5) return "社恐NPC";
      if (E < 0 && S < -5) return "佛系NPC";
      if (W > 5 && S < -5) return "疯批NPC";
      return "标准NPC";

    case 'FIRE':
      if (D > 8 && A > 5) return "高效DDL战士";
      if (D > 8 && W > 5) return "疯批DDL战士";
      if (D > 8 && E > 5) return "焦虑DDL战士";
      return "标准DDL战士";

    case 'FLOP':
      if (A < -5 && E > 5) return "焦虑仰卧者";
      if (A < -5 && W > 5) return "发疯仰卧者";
      if (A < -5 && E < 0) return "佛系仰卧者";
      return "标准仰卧者";

    case 'PURE':
      if (S > 8 && E < 0) return "阳光清澈";
      if (S > 8 && E > 0) return "敏感清澈";
      if (S > 8 && W < 0) return "乖巧清澈";
      return "标准清澈";

    case 'OOPS':
      if (E > 8 && W > 5) return "倒霉发疯者";
      if (E > 8 && W < 0) return "倒霉焦虑者";
      if (E > 8 && S > 5) return "倒霉社牛";
      return "标准倒霉蛋";

    case 'WILD':
      if (W > 8 && A > 5) return "行动派疯批";
      if (W > 8 && A < 0) return "躺平派疯批";
      if (W > 8 && S > 5) return "社交疯批";
      return "标准发疯者";

    case 'FREE':
    case 'ALIEN':
      return "default";

    default:
      return "标准";
  }
}

// ==================== 测试 ====================

class TestSimulator {
  constructor() {
    this.stats = {
      total: 0,
      personalities: {},
      subTypes: {},
      triggers: { UR: 0, SSR: 0, "Max-Vector": 0 },
      scoreRanges: { A: [], E: [], S: [], W: [], D: [] }
    };
  }

  run(count = 500) {
    console.log(`\n🧪 UNTI "千人千面"精准版 - ${count}次测试\n`);

    for (let i = 0; i < count; i++) {
      const answers = QUESTIONS.map(q => Math.floor(Math.random() * q.options.length));
      const result = calculatePersonality(answers);

      this.stats.total++;
      this.stats.personalities[result.personality] = (this.stats.personalities[result.personality] || 0) + 1;
      this.stats.subTypes[result.subType] = (this.stats.subTypes[result.subType] || 0) + 1;
      this.stats.triggers[result.trigger]++;

      for (const [key, val] of Object.entries(result.scores)) {
        this.stats.scoreRanges[key].push(val);
      }
    }

    this.printReport();
  }

  printReport() {
    console.log("=".repeat(70));
    console.log("📊 UNTI '千人千面'测试报告");
    console.log("=".repeat(70));

    // 人格分布
    console.log("\n🎭 人格分布（主人格）：");
    console.log("-".repeat(50));
    const sorted = Object.entries(this.stats.personalities).sort((a, b) => b[1] - a[1]);

    for (const [key, count] of sorted) {
      const p = PERSONALITIES[key];
      const pct = ((count / this.stats.total) * 100).toFixed(1);
      const bar = "█".repeat(Math.round(pct / 2));
      console.log(`${p.emoji} ${key.padEnd(8)} ${p.rare.padStart(3)} | ${bar} ${pct}% (${count})`);
    }

    // 触发机制
    console.log("\n⚡ 触发机制：");
    for (const [k, v] of Object.entries(this.stats.triggers)) {
      console.log(`${k.padEnd(12)}: ${v} 次 (${((v/this.stats.total)*100).toFixed(1)}%)`);
    }

    // 维度统计
    console.log("\n📈 维度分数范围：");
    for (const [key, vals] of Object.entries(this.stats.scoreRanges)) {
      const min = Math.min(...vals), max = Math.max(...vals);
      const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
      console.log(`${key}: [${min.toString().padStart(3)}, ${max.toString().padStart(3)}] 平均:${avg.padStart(5)}`);
    }

    // 副人格分布
    console.log("\n🎨 副人格分布（Top 10）：");
    console.log("-".repeat(50));
    const sortedSub = Object.entries(this.stats.subTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    for (const [key, count] of sortedSub) {
      const pct = ((count / this.stats.total) * 100).toFixed(1);
      console.log(`${key.padEnd(12)}: ${pct}% (${count})`);
    }

    // 均匀性
    const counts = Object.values(this.stats.personalities);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    const variance = counts.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / counts.length;
    const cv = ((Math.sqrt(variance) / avg) * 100).toFixed(1);

    console.log("\n✅ 分布评估：");
    console.log(`变异系数: ${cv}%`);
    console.log(cv < 40 ? "🟢 优秀" : cv < 60 ? "🟡 可接受" : "🔴 需优化");

    // 示例
    console.log("\n📝 示例结果：");
    console.log("-".repeat(50));
    const sample = {
      answers: [0, 2, 1, 3, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0],
      result: calculatePersonality([0, 2, 1, 3, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0])
    };
    console.log(`人格: ${PERSONALITIES[sample.result.personality].emoji} ${PERSONALITIES[sample.result.personality].name}`);
    console.log(`副人格: ${sample.result.subType}`);
    console.log(`描述: ${sample.result.desc}`);
    console.log(`分数: A=${sample.result.scores.A} E=${sample.result.scores.E} S=${sample.result.scores.S} W=${sample.result.scores.W} D=${sample.result.scores.D}`);

    console.log("\n" + "=".repeat(70));
  }
}

new TestSimulator().run(500);

module.exports = { calculatePersonality, QUESTIONS, PERSONALITIES, SUB_PERSONALITY_DESC };
