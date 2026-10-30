// 服装设计预置数据：款式、部件定义、材质纹理、调色盘、模特配置
const FASHION_PRESETS = {
  // 款式库
  styles: [
    {
      id: "trench_coat",
      name: "英伦经典双排扣风衣",
      category: "outerwear",
      gender: "unisex",
      desc: "标志性防风翻领与肩章剪裁，秋冬高级感与气场兼备",
      parts: ["collar", "body", "sleeves", "pockets", "accents", "hem"],
      defaultColors: {
        collar: "#9C6644",
        body: "#DDB892",
        sleeves: "#DDB892",
        pockets: "#B08968",
        accents: "#3A2E2B",
        hem: "#B08968"
      },
      partNames: {
        collar: "大翻领与肩章",
        body: "主体风琴衣身",
        sleeves: "插肩袖与袖袢",
        pockets: "斜插挡雨口袋",
        accents: "双排琥珀扣与腰带扣",
        hem: "防风下摆边缘"
      },
      defaultMaterial: "cotton",
      defaultPattern: "solid"
    },
    {
      id: "blazer",
      name: "高定意式收腰西装",
      category: "outerwear",
      gender: "men",
      desc: "经典戗驳领剪裁，修饰肩颈腰线，商务社交兼修",
      parts: ["collar", "body", "sleeves", "pockets", "accents"],
      defaultColors: {
        collar: "#1E293B",
        body: "#0F172A",
        sleeves: "#0F172A",
        pockets: "#1E293B",
        accents: "#E2E8F0"
      },
      partNames: {
        collar: "戗驳领 (Lapel)",
        body: "正装衣身主体",
        sleeves: "定制袖管与假开衩",
        pockets: "双嵌线翻盖口袋",
        accents: "金属包边纽扣"
      },
      defaultMaterial: "wool",
      defaultPattern: "solid"
    },
    {
      id: "hoodie",
      name: "美式重磅微廓形卫衣",
      category: "tops",
      gender: "unisex",
      desc: "450g 重磅紧密赛络纺，立体连帽与大容量袋鼠兜",
      parts: ["collar", "body", "sleeves", "pockets", "accents", "hem"],
      defaultColors: {
        collar: "#475569",
        body: "#334155",
        sleeves: "#334155",
        pockets: "#475569",
        accents: "#94A3B8",
        hem: "#1E293B"
      },
      partNames: {
        collar: "立体连帽 (Hood)",
        body: "前胸后背主体",
        sleeves: "落肩长袖",
        pockets: "前置袋鼠兜",
        accents: "金属头抽绳与刺绣",
        hem: "加宽紧致罗纹下摆"
      },
      defaultMaterial: "cotton",
      defaultPattern: "solid"
    },
    {
      id: "bomber_jacket",
      name: "赛博机能飞行员夹克",
      category: "outerwear",
      gender: "unisex",
      desc: "防泼水微网格抗撕裂面料，多口袋多扣件模块化机能风",
      parts: ["collar", "body", "sleeves", "pockets", "accents", "hem"],
      defaultColors: {
        collar: "#18181B",
        body: "#27272A",
        sleeves: "#3F3F46",
        pockets: "#10B981",
        accents: "#10B981",
        hem: "#18181B"
      },
      partNames: {
        collar: "针织棒球立领",
        body: "抗撕裂夹克主身",
        sleeves: "战术工装袖",
        pockets: "立体拉链斜口袋",
        accents: "荧光机能织带与拉链",
        hem: "弹力防风收口下摆"
      },
      defaultMaterial: "techwear",
      defaultPattern: "solid"
    },
    {
      id: "dress",
      name: "法式复古收腰衬衫裙",
      category: "dresses",
      gender: "women",
      desc: "轻复古法式修身剪裁，法式小翻领配合流动垂顺裙摆",
      parts: ["collar", "body", "sleeves", "pockets", "accents", "hem"],
      defaultColors: {
        collar: "#F8FAFC",
        body: "#BE185D",
        sleeves: "#DB2777",
        pockets: "#F472B6",
        accents: "#FDF2F8",
        hem: "#9D174D"
      },
      partNames: {
        collar: "法式优雅翻领",
        body: "收腰衬衫裙身",
        sleeves: "微蓬法式泡泡袖",
        pockets: "侧边隐形裙袋",
        accents: "天然贝壳纽扣与腰带",
        hem: "飘逸A字大裙摆"
      },
      defaultMaterial: "silk",
      defaultPattern: "solid"
    },
    {
      id: "tee",
      name: "极简重磅微落肩T恤",
      category: "tops",
      gender: "unisex",
      desc: "280g 纯棉双纱，二本针加固领口，自然微阔廓形",
      parts: ["collar", "body", "sleeves", "pockets", "accents"],
      defaultColors: {
        collar: "#0284C7",
        body: "#0EA5E9",
        sleeves: "#0EA5E9",
        pockets: "#38BDF8",
        accents: "#E0F2FE"
      },
      partNames: {
        collar: "高弹螺纹圆领",
        body: "无侧缝筒织身板",
        sleeves: "落肩七分/短袖",
        pockets: "左胸工装口袋",
        accents: "侧缝极简织唛标"
      },
      defaultMaterial: "cotton",
      defaultPattern: "solid"
    }
  ],

  // 材质库与触感特性
  materials: [
    {
      id: "cotton",
      name: "精梳紧密棉 (Cotton)",
      desc: "40支双股紧密纺，亲肤吸汗，微哑光质感",
      roughness: 0.7,
      patternStyle: "subtle-grain",
      composition: "100% 长绒棉",
      season: "四季皆宜",
      weight: "280g/m²"
    },
    {
      id: "wool",
      name: "美利奴精纺羊毛 (Wool)",
      desc: "120支超细美利奴，天然弹力，抗皱垂坠且保暖",
      roughness: 0.5,
      patternStyle: "wool-felt",
      composition: "90% 澳洲美利奴羊毛 + 10% 桑蚕丝",
      season: "秋冬春",
      weight: "360g/m²"
    },
    {
      id: "denim",
      name: "复古赤耳丹宁 (Denim)",
      desc: "14oz 经典斜纹织造，水洗微落色肌理，经久耐穿",
      roughness: 0.9,
      patternStyle: "denim-twill",
      composition: "98% 棉 + 2% 氨纶微弹",
      season: "四季",
      weight: "420g/m²"
    },
    {
      id: "silk",
      name: "天然重磅桑蚕丝 (Silk)",
      desc: "22姆米真丝双乔，流动珠光光泽，流体垂感",
      roughness: 0.2,
      patternStyle: "silk-luster",
      composition: "100% 桑蚕丝",
      season: "春夏秋",
      weight: "95g/m²"
    },
    {
      id: "techwear",
      name: "三防抗撕裂尼龙 (Techwear)",
      desc: "Cordura 防泼水防刮微方格撕裂层，机能硬核",
      roughness: 0.4,
      patternStyle: "grid-ripstop",
      composition: "100% 聚酰胺纤维 + DWR涂层",
      season: "秋冬机能",
      weight: "310g/m²"
    },
    {
      id: "corduroy",
      name: "复古条绒灯芯绒 (Corduroy)",
      desc: "8坑立体粗条绒，柔糯温暖，触感丰盈",
      roughness: 0.8,
      patternStyle: "cord-stripe",
      composition: "100% 纯棉条绒",
      season: "秋冬",
      weight: "350g/m²"
    },
    {
      id: "leather",
      name: "头层纳帕皮革 (Leather)",
      desc: "植物鞣制头层牛皮，温润微光泽，耐磨奢雅",
      roughness: 0.3,
      patternStyle: "leather-pore",
      composition: "100% 天然头层牛皮",
      season: "秋冬",
      weight: "520g/m²"
    }
  ],

  // 纹理与印花
  patterns: [
    { id: "solid", name: "纯色极简 (Solid)" },
    { id: "plaid", name: "英伦苏格兰格 (Tartan)" },
    { id: "houndstooth", name: "复古千鸟格 (Houndstooth)" },
    { id: "stripes", name: "经典细条纹 (Pinstripes)" },
    { id: "camo", name: "都市暗夜迷彩 (Camo)" },
    { id: "embroidery", name: "金线胸前徽标 (Badge)" }
  ],

  // 精选调色盘（潘通与流行色）
  colorPalettes: [
    {
      group: "高级大地色系 (Earth & Warm)",
      colors: [
        { name: "经典风衣驼", hex: "#D2B48C" },
        { name: "燕麦晨雾米", hex: "#E8E2D6" },
        { name: "深秋焦糖棕", hex: "#8B5A2B" },
        { name: "暖调奶茶咖", hex: "#B08968" },
        { name: "象牙生蚕白", hex: "#FDFBF7" },
        { name: "黑曜深石墨", hex: "#1A1A1A" }
      ]
    },
    {
      group: "智性商务正装 (Executive)",
      colors: [
        { name: "深海海军蓝", hex: "#0F172A" },
        { name: "冷杉墨绿", hex: "#1B4332" },
        { name: "勃艮第酒红", hex: "#5C1D24" },
        { name: "高级中性烟灰", hex: "#475569" },
        { name: "冷调石板灰", hex: "#94A3B8" },
        { name: "纯粹极夜黑", hex: "#0A0A0A" }
      ]
    },
    {
      group: "赛博潮酷街头 (Cyber Street)",
      colors: [
        { name: "极光荧光绿", hex: "#00FF9D" },
        { name: "电光镭射紫", hex: "#8B5CF6" },
        { name: "克莱因极蓝", hex: "#0038FF" },
        { name: "火星熔岩橙", hex: "#F97316" },
        { name: "赛博荧光黄", hex: "#EAB308" },
        { name: "暗夜装甲灰", hex: "#27272A" }
      ]
    },
    {
      group: "温柔莫兰迪 (Morandi Pastel)",
      colors: [
        { name: "鼠尾草灰绿", hex: "#A3B18A" },
        { name: "干枯玫瑰粉", hex: "#DB2777" },
        { name: "雾霾静谧蓝", hex: "#60A5FA" },
        { name: "香芋浅淡紫", hex: "#C084FC" },
        { name: "鹅黄雏菊", hex: "#FEF08A" },
        { name: "柔光肉桂", hex: "#E0A96D" }
      ]
    }
  ],

  // 模特库配置（不同体型、性别、身材数据）
  models: [
    {
      id: "model_m1",
      name: "林晨 (职场男模)",
      gender: "男",
      height: "185 cm",
      weight: "74 kg",
      figure: "倒三角匀称身形",
      skinTone: "light",
      avatarEmoji: "👨🏻‍💼",
      suitCategory: "商务通勤 / 正装 / 休闲大衣",
      bust: 98,
      waist: 76,
      hips: 95,
      shoulderWidth: 46
    },
    {
      id: "model_f1",
      name: "沈薇 (优雅女模)",
      gender: "女",
      height: "172 cm",
      weight: "50 kg",
      figure: "纤细高挑沙漏型",
      skinTone: "fair",
      avatarEmoji: "👩🏻",
      suitCategory: "法式风衣 / 连衣裙 / 廓形西服",
      bust: 84,
      waist: 62,
      hips: 88,
      shoulderWidth: 38
    },
    {
      id: "model_m2",
      name: "Leo (街潮少年)",
      gender: "男",
      height: "178 cm",
      weight: "68 kg",
      figure: "阳光运动型",
      skinTone: "warm",
      avatarEmoji: "👱🏻‍♂️",
      suitCategory: "街头卫衣 / 机能夹克 / 宽松短T",
      bust: 94,
      waist: 75,
      hips: 92,
      shoulderWidth: 44
    },
    {
      id: "model_f2",
      name: "周琳 (微胖大码模特)",
      gender: "女",
      height: "166 cm",
      weight: "69 kg",
      figure: "微丰自信曲线型",
      skinTone: "warm",
      avatarEmoji: "👩🏼",
      suitCategory: "显瘦收腰风衣 / 廓形卫衣 / 休闲装",
      bust: 98,
      waist: 82,
      hips: 104,
      shoulderWidth: 41
    }
  ]
};

// 导出挂载到全局
if (typeof window !== 'undefined') {
  window.FASHION_PRESETS = FASHION_PRESETS;
}

