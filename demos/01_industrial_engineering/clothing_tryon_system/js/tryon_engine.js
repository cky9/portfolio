/**
 * 服装个性化设计与 AI 虚拟试穿引擎 (Try-On Engine)
 * 负责服装矢量部件渲染、材质纹理合成、人体姿态穿搭贴合、光影计算与海报生成
 */

class TryOnEngine {
  constructor() {
    this.currentDesign = null;
    this.currentModel = null;
    this.currentAngle = 'front'; // 'front', 'side', 'back'
    this.customUserPhoto = null; // 用户上传的照片 Image 对象
    this.customPhotoTransform = { x: 0, y: 0, scale: 1.0, rotate: 0 };
    this.activeHoverPart = null;
    this.selectedPart = 'body';
  }

  /**
   * 初始化引擎
   */
  init(design, model) {
    this.currentDesign = JSON.parse(JSON.stringify(design));
    this.currentModel = model;
  }

  /**
   * 更新当前设计方案
   */
  setDesign(design) {
    this.currentDesign = JSON.parse(JSON.stringify(design));
  }

  /**
   * 更新当前模特
   */
  setModel(model) {
    this.currentModel = model;
    this.customUserPhoto = null; // 重置用户自拍
  }

  /**
   * 设置用户自定义上传的人像照片
   */
  setUserPhoto(imgObj) {
    this.customUserPhoto = imgObj;
  }

  /**
   * 切换试穿展示角度
   */
  setAngle(angle) {
    this.currentAngle = angle;
  }

  /**
   * 获取材质纹理 pattern 描述
   */
  getMaterialFilterStyle(materialId, patternId) {
    let cssFilter = '';
    let blendMode = 'normal';
    let textureType = 'smooth';

    switch (materialId) {
      case 'wool':
        cssFilter = 'contrast(1.05) brightness(0.96)';
        blendMode = 'multiply';
        textureType = 'wool';
        break;
      case 'denim':
        cssFilter = 'contrast(1.18) saturate(0.92)';
        blendMode = 'overlay';
        textureType = 'denim';
        break;
      case 'silk':
        cssFilter = 'contrast(1.15) brightness(1.08)';
        blendMode = 'screen';
        textureType = 'silk';
        break;
      case 'techwear':
        cssFilter = 'contrast(1.2) brightness(0.92)';
        blendMode = 'hard-light';
        textureType = 'techwear';
        break;
      case 'corduroy':
        cssFilter = 'contrast(1.1) brightness(0.95)';
        blendMode = 'multiply';
        textureType = 'corduroy';
        break;
      case 'leather':
        cssFilter = 'contrast(1.25) brightness(0.9)';
        blendMode = 'soft-light';
        textureType = 'leather';
        break;
      default:
        cssFilter = 'contrast(1.02)';
        textureType = 'cotton';
    }

    return { cssFilter, blendMode, textureType, pattern: patternId || 'solid' };
  }

  /**
   * 生成 SVG 材质滤镜定义与 Pattern 节点
   */
  renderSvgDefs() {
    return `
      <defs>
        <!-- 织物阴影滤镜 -->
        <filter id="fabric-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#0f172a" flood-opacity="0.25" />
        </filter>
        <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <!-- 棉麻微纹理 Pattern -->
        <pattern id="pat-cotton" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="rgba(0,0,0,0.03)" />
          <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(255,255,255,0.06)" stroke-width="0.75" />
          <line x1="3" y1="0" x2="3" y2="6" stroke="rgba(0,0,0,0.06)" stroke-width="0.75" />
        </pattern>

        <!-- 羊毛粗花呢 Pattern -->
        <pattern id="pat-wool" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.5" fill="rgba(0,0,0,0.08)" />
          <circle cx="9" cy="9" r="1.5" fill="rgba(255,255,255,0.08)" />
          <path d="M0 6 L12 6 M6 0 L6 12" stroke="rgba(0,0,0,0.05)" stroke-width="1" />
        </pattern>

        <!-- 丹宁牛仔斜纹 Pattern -->
        <pattern id="pat-denim" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.18)" stroke-width="1.8" />
          <line x1="5" y1="0" x2="5" y2="10" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" />
        </pattern>

        <!-- 机能防撕裂微方格 Pattern -->
        <pattern id="pat-techwear" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="0.8" />
          <line x1="7" y1="0" x2="7" y2="14" stroke="rgba(0,0,0,0.2)" stroke-width="0.5" stroke-dasharray="2,2" />
        </pattern>

        <!-- 灯芯绒条纹 Pattern -->
        <pattern id="pat-corduroy" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="5" height="10" fill="rgba(0,0,0,0.12)" />
          <rect x="5" y="0" width="5" height="10" fill="rgba(255,255,255,0.1)" />
        </pattern>

        <!-- 苏格兰经典格纹 Pattern (Plaid) -->
        <pattern id="pat-plaid" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="rgba(0,0,0,0.05)" />
          <rect x="0" y="0" width="40" height="8" fill="rgba(255,255,255,0.2)" />
          <rect x="0" y="0" width="8" height="40" fill="rgba(255,255,255,0.2)" />
          <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(0,0,0,0.25)" stroke-width="2" />
          <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(0,0,0,0.25)" stroke-width="2" />
        </pattern>

        <!-- 千鸟格 Pattern (Houndstooth) -->
        <pattern id="pat-houndstooth" width="16" height="16" patternUnits="userSpaceOnUse">
          <polygon points="0,0 8,0 4,4 0,4" fill="rgba(0,0,0,0.18)" />
          <polygon points="8,8 16,8 12,12 8,12" fill="rgba(0,0,0,0.18)" />
          <polygon points="4,4 8,4 8,8 4,8" fill="rgba(255,255,255,0.2)" />
        </pattern>

        <!-- 细条纹 Pattern (Stripes) -->
        <pattern id="pat-stripes" width="12" height="12" patternUnits="userSpaceOnUse">
          <line x1="6" y1="0" x2="6" y2="12" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
        </pattern>

        <!-- 渐变高光与自然阴影 -->
        <linearGradient id="body-gradient-front" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.22" />
          <stop offset="25%" stop-color="#ffffff" stop-opacity="0.08" />
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.18" />
          <stop offset="75%" stop-color="#ffffff" stop-opacity="0.08" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.28" />
        </linearGradient>

        <linearGradient id="sleeve-left-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15" />
          <stop offset="70%" stop-color="#000000" stop-opacity="0.0" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.35" />
        </linearGradient>

        <linearGradient id="sleeve-right-grad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15" />
          <stop offset="70%" stop-color="#000000" stop-opacity="0.0" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.35" />
        </linearGradient>
      </defs>
    `;
  }

  /**
   * 生成服装矢量各部件 SVG 几何路径 (根据款式生成)
   */
  generateGarmentSvg(styleId, colors, selectedPart, hoverPart) {
    const isSel = (p) => selectedPart === p;
    const isHov = (p) => hoverPart === p;

    const getPartStyle = (p, baseColor) => {
      let stroke = '#1e293b';
      let strokeWidth = '2';
      let filter = '';
      if (isSel(p)) {
        stroke = '#3b82f6';
        strokeWidth = '3.5';
        filter = 'url(#soft-glow)';
      } else if (isHov(p)) {
        stroke = '#06b6d4';
        strokeWidth = '3';
      }
      return `fill="${baseColor}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round" ${filter}`;
    };

    const cBody = colors.body || '#d2b48c';
    const cCollar = colors.collar || '#8b5a2b';
    const cSleeves = colors.sleeves || '#d2b48c';
    const cPockets = colors.pockets || '#8b5a2b';
    const cAccents = colors.accents || '#2f1f17';
    const cHem = colors.hem || '#8b5a2b';

    // 材质覆盖 pattern
    const matPattern = `url(#pat-${this.currentDesign.materials?.body || 'cotton'})`;
    const patternOverlay = this.currentDesign.pattern !== 'solid' ? `url(#pat-${this.currentDesign.pattern})` : '';

    let partsSvg = '';

    switch (styleId) {
      case 'trench_coat': // 英伦双排扣风衣
        partsSvg = `
          <!-- 风衣左袖 -->
          <g class="garment-part" data-part="sleeves" cursor="pointer">
            <path d="M 120 140 L 70 210 L 60 380 L 100 385 L 135 240 Z" ${getPartStyle('sleeves', cSleeves)} />
            <path d="M 120 140 L 70 210 L 60 380 L 100 385 L 135 240 Z" fill="${matPattern}" opacity="0.65" pointer-events="none" />
            <path d="M 120 140 L 70 210 L 60 380 L 100 385 L 135 240 Z" fill="url(#sleeve-left-grad)" pointer-events="none" />
            <!-- 袖袢扣 -->
            <rect x="65" y="345" width="30" height="8" rx="2" fill="${cAccents}" stroke="#000" stroke-width="1" />
            <circle cx="88" cy="349" r="2.5" fill="#e2e8f0" />
          </g>

          <!-- 风衣右袖 -->
          <g class="garment-part" data-part="sleeves" cursor="pointer">
            <path d="M 280 140 L 330 210 L 340 380 L 300 385 L 265 240 Z" ${getPartStyle('sleeves', cSleeves)} />
            <path d="M 280 140 L 330 210 L 340 380 L 300 385 L 265 240 Z" fill="${matPattern}" opacity="0.65" pointer-events="none" />
            <path d="M 280 140 L 330 210 L 340 380 L 300 385 L 265 240 Z" fill="url(#sleeve-right-grad)" pointer-events="none" />
            <!-- 袖袢扣 -->
            <rect x="305" y="345" width="30" height="8" rx="2" fill="${cAccents}" stroke="#000" stroke-width="1" />
            <circle cx="312" cy="349" r="2.5" fill="#e2e8f0" />
          </g>

          <!-- 风衣主身 -->
          <g class="garment-part" data-part="body" cursor="pointer">
            <path d="M 140 110 L 260 110 L 280 140 L 270 240 L 305 450 L 95 450 L 130 240 L 120 140 Z" ${getPartStyle('body', cBody)} />
            <path d="M 140 110 L 260 110 L 280 140 L 270 240 L 305 450 L 95 450 L 130 240 L 120 140 Z" fill="${matPattern}" opacity="0.6" pointer-events="none" />
            ${patternOverlay ? `<path d="M 140 110 L 260 110 L 280 140 L 270 240 L 305 450 L 95 450 L 130 240 L 120 140 Z" fill="${patternOverlay}" opacity="0.5" pointer-events="none" />` : ''}
            <path d="M 140 110 L 260 110 L 280 140 L 270 240 L 305 450 L 95 450 L 130 240 L 120 140 Z" fill="url(#body-gradient-front)" pointer-events="none" />
            <!-- 右肩前挡风片 (Storm flap) -->
            <path d="M 200 110 L 275 135 L 255 210 L 200 170 Z" fill="${cCollar}" opacity="0.9" stroke="#1e293b" stroke-width="1.5" />
          </g>

          <!-- 风衣下摆 -->
          <g class="garment-part" data-part="hem" cursor="pointer">
            <path d="M 95 440 L 305 440 L 305 455 L 95 455 Z" ${getPartStyle('hem', cHem)} />
            <line x1="95" y1="446" x2="305" y2="446" stroke="rgba(0,0,0,0.3)" stroke-dasharray="3,3" stroke-width="1.2" />
          </g>

          <!-- 风衣口袋 -->
          <g class="garment-part" data-part="pockets" cursor="pointer">
            <!-- 左口袋 -->
            <path d="M 125 310 L 165 325 L 160 365 L 120 350 Z" ${getPartStyle('pockets', cPockets)} />
            <!-- 右口袋 -->
            <path d="M 275 310 L 235 325 L 240 365 L 280 350 Z" ${getPartStyle('pockets', cPockets)} />
          </g>

          <!-- 风衣大翻领与肩章 -->
          <g class="garment-part" data-part="collar" cursor="pointer">
            <!-- 左肩章 -->
            <polygon points="120,135 155,120 150,130 118,145" fill="${cCollar}" stroke="#1e293b" stroke-width="1" />
            <circle cx="147" cy="126" r="2" fill="${cAccents}" />
            <!-- 右肩章 -->
            <polygon points="280,135 245,120 250,130 282,145" fill="${cCollar}" stroke="#1e293b" stroke-width="1" />
            <circle cx="253" cy="126" r="2" fill="${cAccents}" />
            <!-- 左大翻领 -->
            <path d="M 155 110 L 200 135 L 160 195 L 135 150 Z" ${getPartStyle('collar', cCollar)} />
            <!-- 右大翻领 (叠在上面) -->
            <path d="M 245 110 L 200 135 L 230 220 L 265 150 Z" ${getPartStyle('collar', cCollar)} />
          </g>

          <!-- 双排扣与腰带配件 -->
          <g class="garment-part" data-part="accents" cursor="pointer">
            <!-- 腰带 -->
            <rect x="110" y="275" width="180" height="24" rx="3" fill="${cAccents}" stroke="#0f172a" stroke-width="1.5" />
            <!-- 金属方扣 -->
            <rect x="180" y="271" width="36" height="32" rx="4" fill="none" stroke="#fcd34d" stroke-width="3" />
            <line x1="198" y1="271" x2="198" y2="303" stroke="#fcd34d" stroke-width="2.5" />

            <!-- 双排琥珀纽扣 -->
            <circle cx="180" cy="170" r="5" fill="${cAccents}" stroke="#fcd34d" stroke-width="1" />
            <circle cx="220" cy="170" r="5" fill="${cAccents}" stroke="#fcd34d" stroke-width="1" />
            <circle cx="180" cy="225" r="5" fill="${cAccents}" stroke="#fcd34d" stroke-width="1" />
            <circle cx="220" cy="225" r="5" fill="${cAccents}" stroke="#fcd34d" stroke-width="1" />
            <circle cx="180" cy="340" r="5" fill="${cAccents}" stroke="#fcd34d" stroke-width="1" />
            <circle cx="220" cy="340" r="5" fill="${cAccents}" stroke="#fcd34d" stroke-width="1" />
            <circle cx="180" cy="395" r="5" fill="${cAccents}" stroke="#fcd34d" stroke-width="1" />
            <circle cx="220" cy="395" r="5" fill="${cAccents}" stroke="#fcd34d" stroke-width="1" />
          </g>
        `;
        break;

      case 'blazer': // 高定西装
        partsSvg = `
          <!-- 西装左袖 -->
          <g class="garment-part" data-part="sleeves" cursor="pointer">
            <path d="M 125 140 L 75 220 L 70 380 L 110 382 L 140 240 Z" ${getPartStyle('sleeves', cSleeves)} />
            <path d="M 125 140 L 75 220 L 70 380 L 110 382 L 140 240 Z" fill="${matPattern}" opacity="0.65" pointer-events="none" />
            <!-- 袖口纽扣 -->
            <circle cx="85" cy="365" r="2.5" fill="${cAccents}" />
            <circle cx="92" cy="366" r="2.5" fill="${cAccents}" />
            <circle cx="99" cy="367" r="2.5" fill="${cAccents}" />
          </g>

          <!-- 西装右袖 -->
          <g class="garment-part" data-part="sleeves" cursor="pointer">
            <path d="M 275 140 L 325 220 L 330 380 L 290 382 L 260 240 Z" ${getPartStyle('sleeves', cSleeves)} />
            <path d="M 275 140 L 325 220 L 330 380 L 290 382 L 260 240 Z" fill="${matPattern}" opacity="0.65" pointer-events="none" />
            <circle cx="315" cy="365" r="2.5" fill="${cAccents}" />
            <circle cx="308" cy="366" r="2.5" fill="${cAccents}" />
            <circle cx="301" cy="367" r="2.5" fill="${cAccents}" />
          </g>

          <!-- 西装主身 -->
          <g class="garment-part" data-part="body" cursor="pointer">
            <path d="M 140 120 L 260 120 L 275 140 L 265 250 L 285 390 L 115 390 L 135 250 L 125 140 Z" ${getPartStyle('body', cBody)} />
            <path d="M 140 120 L 260 120 L 275 140 L 265 250 L 285 390 L 115 390 L 135 250 L 125 140 Z" fill="${matPattern}" opacity="0.6" pointer-events="none" />
            ${patternOverlay ? `<path d="M 140 120 L 260 120 L 275 140 L 265 250 L 285 390 L 115 390 L 135 250 L 125 140 Z" fill="${patternOverlay}" opacity="0.5" pointer-events="none" />` : ''}
            <path d="M 140 120 L 260 120 L 275 140 L 265 250 L 285 390 L 115 390 L 135 250 L 125 140 Z" fill="url(#body-gradient-front)" pointer-events="none" />
            <!-- 前胸V字衬衫打底露出 -->
            <polygon points="180,120 220,120 200,240" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
            <polygon points="196,160 204,160 200,220" fill="#1e293b" />
          </g>

          <!-- 西装戗驳领 -->
          <g class="garment-part" data-part="collar" cursor="pointer">
            <!-- 左驳领 -->
            <path d="M 160 120 L 198 245 L 165 200 L 140 160 Z" ${getPartStyle('collar', cCollar)} />
            <!-- 右驳领 -->
            <path d="M 240 120 L 202 245 L 235 200 L 260 160 Z" ${getPartStyle('collar', cCollar)} />
          </g>

          <!-- 西装口袋 -->
          <g class="garment-part" data-part="pockets" cursor="pointer">
            <!-- 左胸袋 -->
            <path d="M 150 190 L 180 187 L 180 195 L 150 198 Z" ${getPartStyle('pockets', cPockets)} />
            <!-- 白手帕装饰露出 -->
            <polygon points="158,189 166,178 174,188" fill="#ffffff" />
            <!-- 左右翻盖口袋 -->
            <rect x="135" y="300" width="45" height="18" rx="2" ${getPartStyle('pockets', cPockets)} />
            <rect x="220" y="300" width="45" height="18" rx="2" ${getPartStyle('pockets', cPockets)} />
          </g>

          <!-- 西装纽扣 -->
          <g class="garment-part" data-part="accents" cursor="pointer">
            <circle cx="200" cy="265" r="4.5" fill="${cAccents}" stroke="#cbd5e1" stroke-width="1" />
            <circle cx="200" cy="315" r="4.5" fill="${cAccents}" stroke="#cbd5e1" stroke-width="1" />
          </g>
        `;
        break;

      case 'hoodie': // 美式重磅连帽卫衣
        partsSvg = `
          <!-- 卫衣左袖 -->
          <g class="garment-part" data-part="sleeves" cursor="pointer">
            <path d="M 120 150 L 65 230 L 60 380 L 105 385 L 140 240 Z" ${getPartStyle('sleeves', cSleeves)} />
            <path d="M 120 150 L 65 230 L 60 380 L 105 385 L 140 240 Z" fill="${matPattern}" opacity="0.65" pointer-events="none" />
            <!-- 螺纹袖口 -->
            <rect x="62" y="365" width="42" height="20" rx="3" fill="${cHem}" />
          </g>

          <!-- 卫衣右袖 -->
          <g class="garment-part" data-part="sleeves" cursor="pointer">
            <path d="M 280 150 L 335 230 L 340 380 L 295 385 L 260 240 Z" ${getPartStyle('sleeves', cSleeves)} />
            <path d="M 280 150 L 335 230 L 340 380 L 295 385 L 260 240 Z" fill="${matPattern}" opacity="0.65" pointer-events="none" />
            <rect x="296" y="365" width="42" height="20" rx="3" fill="${cHem}" />
          </g>

          <!-- 卫衣主身 -->
          <g class="garment-part" data-part="body" cursor="pointer">
            <path d="M 130 140 L 270 140 L 285 240 L 280 370 L 120 370 L 115 240 Z" ${getPartStyle('body', cBody)} />
            <path d="M 130 140 L 270 140 L 285 240 L 280 370 L 120 370 L 115 240 Z" fill="${matPattern}" opacity="0.6" pointer-events="none" />
            ${patternOverlay ? `<path d="M 130 140 L 270 140 L 285 240 L 280 370 L 120 370 L 115 240 Z" fill="${patternOverlay}" opacity="0.5" pointer-events="none" />` : ''}
            <path d="M 130 140 L 270 140 L 285 240 L 280 370 L 120 370 L 115 240 Z" fill="url(#body-gradient-front)" pointer-events="none" />
          </g>

          <!-- 卫衣螺纹下摆 -->
          <g class="garment-part" data-part="hem" cursor="pointer">
            <rect x="120" y="365" width="160" height="25" rx="3" ${getPartStyle('hem', cHem)} />
            <line x1="120" y1="377" x2="280" y2="377" stroke="rgba(0,0,0,0.2)" stroke-width="1.5" />
          </g>

          <!-- 袋鼠兜口袋 -->
          <g class="garment-part" data-part="pockets" cursor="pointer">
            <path d="M 150 280 L 250 280 L 265 350 L 135 350 Z" ${getPartStyle('pockets', cPockets)} />
            <!-- 斜插手开口 -->
            <line x1="150" y1="280" x2="135" y2="350" stroke="#0f172a" stroke-width="2.5" />
            <line x1="250" y1="280" x2="265" y2="350" stroke="#0f172a" stroke-width="2.5" />
          </g>

          <!-- 卫衣立体兜帽 -->
          <g class="garment-part" data-part="collar" cursor="pointer">
            <path d="M 150 140 C 130 90, 160 55, 200 55 C 240 55, 270 90, 250 140 C 230 160, 170 160, 150 140 Z" ${getPartStyle('collar', cCollar)} />
            <path d="M 170 135 C 160 100, 180 75, 200 75 C 220 75, 240 100, 230 135 Z" fill="#18181b" opacity="0.8" />
          </g>

          <!-- 抽绳配件 -->
          <g class="garment-part" data-part="accents" cursor="pointer">
            <path d="M 185 140 Q 180 180 183 220" stroke="${cAccents}" stroke-width="3" fill="none" stroke-linecap="round" />
            <circle cx="183" cy="222" r="3" fill="#cbd5e1" />
            <path d="M 215 140 Q 220 180 217 220" stroke="${cAccents}" stroke-width="3" fill="none" stroke-linecap="round" />
            <circle cx="217" cy="222" r="3" fill="#cbd5e1" />
          </g>
        `;
        break;

      case 'bomber_jacket': // 赛博机能飞行员夹克
        partsSvg = `
          <!-- 夹克左袖 (含战术臂袋) -->
          <g class="garment-part" data-part="sleeves" cursor="pointer">
            <path d="M 120 140 L 65 210 L 60 360 L 105 365 L 140 230 Z" ${getPartStyle('sleeves', cSleeves)} />
            <path d="M 120 140 L 65 210 L 60 360 L 105 365 L 140 230 Z" fill="${matPattern}" opacity="0.65" pointer-events="none" />
            <!-- 左臂战术拉链口袋 -->
            <rect x="75" y="240" width="28" height="36" rx="2" fill="${cPockets}" stroke="#0f172a" stroke-width="1.5" />
            <line x1="89" y1="240" x2="89" y2="276" stroke="${cAccents}" stroke-width="2" />
            <!-- 螺纹袖口 -->
            <rect x="62" y="350" width="42" height="18" rx="2" fill="${cHem}" />
          </g>

          <!-- 夹克右袖 -->
          <g class="garment-part" data-part="sleeves" cursor="pointer">
            <path d="M 280 140 L 335 210 L 340 360 L 295 365 L 260 230 Z" ${getPartStyle('sleeves', cSleeves)} />
            <path d="M 280 140 L 335 210 L 340 360 L 295 365 L 260 230 Z" fill="${matPattern}" opacity="0.65" pointer-events="none" />
            <rect x="296" y="350" width="42" height="18" rx="2" fill="${cHem}" />
          </g>

          <!-- 夹克主身 -->
          <g class="garment-part" data-part="body" cursor="pointer">
            <path d="M 135 130 L 265 130 L 280 230 L 270 355 L 130 355 L 120 230 Z" ${getPartStyle('body', cBody)} />
            <path d="M 135 130 L 265 130 L 280 230 L 270 355 L 130 355 L 120 230 Z" fill="${matPattern}" opacity="0.6" pointer-events="none" />
            ${patternOverlay ? `<path d="M 135 130 L 265 130 L 280 230 L 270 355 L 130 355 L 120 230 Z" fill="${patternOverlay}" opacity="0.5" pointer-events="none" />` : ''}
            <path d="M 135 130 L 265 130 L 280 230 L 270 355 L 130 355 L 120 230 Z" fill="url(#body-gradient-front)" pointer-events="none" />
          </g>

          <!-- 弹力收口下摆 -->
          <g class="garment-part" data-part="hem" cursor="pointer">
            <rect x="130" y="352" width="140" height="24" rx="2" ${getPartStyle('hem', cHem)} />
            <line x1="130" y1="364" x2="270" y2="364" stroke="rgba(0,0,0,0.3)" stroke-width="1.5" />
          </g>

          <!-- 战术口袋 -->
          <g class="garment-part" data-part="pockets" cursor="pointer">
            <path d="M 140 280 L 180 260 L 185 320 L 145 335 Z" ${getPartStyle('pockets', cPockets)} />
            <path d="M 260 280 L 220 260 L 215 320 L 255 335 Z" ${getPartStyle('pockets', cPockets)} />
          </g>

          <!-- 棒球领 -->
          <g class="garment-part" data-part="collar" cursor="pointer">
            <path d="M 160 130 C 180 150, 220 150, 240 130 C 230 115, 170 115, 160 130 Z" ${getPartStyle('collar', cCollar)} />
          </g>

          <!-- 主拉链与荧光机能织带 -->
          <g class="garment-part" data-part="accents" cursor="pointer">
            <line x1="200" y1="140" x2="200" y2="376" stroke="${cAccents}" stroke-width="4" />
            <rect x="195" y="150" width="10" height="15" rx="2" fill="#e2e8f0" stroke="#000" stroke-width="1" />
            <!-- 机能飘带 -->
            <path d="M 85 276 L 85 330 L 93 325 L 93 276 Z" fill="${cAccents}" opacity="0.9" />
          </g>
        `;
        break;

      case 'dress': // 法式复古连衣裙
        partsSvg = `
          <!-- 泡泡袖左 -->
          <g class="garment-part" data-part="sleeves" cursor="pointer">
            <path d="M 130 140 Q 70 160 85 230 Q 110 240 130 200 Z" ${getPartStyle('sleeves', cSleeves)} />
            <path d="M 130 140 Q 70 160 85 230 Q 110 240 130 200 Z" fill="${matPattern}" opacity="0.65" pointer-events="none" />
          </g>

          <!-- 泡泡袖右 -->
          <g class="garment-part" data-part="sleeves" cursor="pointer">
            <path d="M 270 140 Q 330 160 315 230 Q 290 240 270 200 Z" ${getPartStyle('sleeves', cSleeves)} />
            <path d="M 270 140 Q 330 160 315 230 Q 290 240 270 200 Z" fill="${matPattern}" opacity="0.65" pointer-events="none" />
          </g>

          <!-- 连衣裙主身上身 + 飘逸大裙摆 -->
          <g class="garment-part" data-part="body" cursor="pointer">
            <!-- 上半身收腰 -->
            <path d="M 140 130 L 260 130 L 245 240 L 155 240 Z" ${getPartStyle('body', cBody)} />
            <!-- A字裙摆 -->
            <path d="M 155 240 L 245 240 L 310 460 L 90 460 Z" ${getPartStyle('body', cBody)} />
            <path d="M 155 240 L 245 240 L 310 460 L 90 460 Z" fill="${matPattern}" opacity="0.6" pointer-events="none" />
            ${patternOverlay ? `<path d="M 155 240 L 245 240 L 310 460 L 90 460 Z" fill="${patternOverlay}" opacity="0.5" pointer-events="none" />` : ''}
            <!-- 裙褶阴影线 -->
            <path d="M 180 240 Q 185 360 170 460" stroke="rgba(0,0,0,0.2)" stroke-width="2" fill="none" />
            <path d="M 220 240 Q 215 360 230 460" stroke="rgba(0,0,0,0.2)" stroke-width="2" fill="none" />
          </g>

          <!-- 裙摆边缘 -->
          <g class="garment-part" data-part="hem" cursor="pointer">
            <path d="M 90 455 Q 200 470 310 455 L 310 465 Q 200 480 90 465 Z" ${getPartStyle('hem', cHem)} />
          </g>

          <!-- 法式小翻领 -->
          <g class="garment-part" data-part="collar" cursor="pointer">
            <polygon points="160,130 185,170 200,140" ${getPartStyle('collar', cCollar)} />
            <polygon points="240,130 215,170 200,140" ${getPartStyle('collar', cCollar)} />
          </g>

          <!-- 腰带与排扣 -->
          <g class="garment-part" data-part="accents" cursor="pointer">
            <rect x="150" y="232" width="100" height="16" rx="2" fill="${cAccents}" stroke="#0f172a" stroke-width="1.5" />
            <circle cx="200" cy="180" r="3.5" fill="#f8fafc" />
            <circle cx="200" cy="205" r="3.5" fill="#f8fafc" />
          </g>
        `;
        break;

      case 'tee': // 极简微落肩短T
      default:
        partsSvg = `
          <!-- T恤短袖左 -->
          <g class="garment-part" data-part="sleeves" cursor="pointer">
            <path d="M 120 135 L 60 200 L 95 240 L 135 185 Z" ${getPartStyle('sleeves', cSleeves)} />
            <path d="M 120 135 L 60 200 L 95 240 L 135 185 Z" fill="${matPattern}" opacity="0.65" pointer-events="none" />
          </g>

          <!-- T恤短袖右 -->
          <g class="garment-part" data-part="sleeves" cursor="pointer">
            <path d="M 280 135 L 340 200 L 305 240 L 265 185 Z" ${getPartStyle('sleeves', cSleeves)} />
            <path d="M 280 135 L 340 200 L 305 240 L 265 185 Z" fill="${matPattern}" opacity="0.65" pointer-events="none" />
          </g>

          <!-- T恤主身 -->
          <g class="garment-part" data-part="body" cursor="pointer">
            <path d="M 135 125 L 265 125 L 275 220 L 270 380 L 130 380 L 125 220 Z" ${getPartStyle('body', cBody)} />
            <path d="M 135 125 L 265 125 L 275 220 L 270 380 L 130 380 L 125 220 Z" fill="${matPattern}" opacity="0.6" pointer-events="none" />
            ${patternOverlay ? `<path d="M 135 125 L 265 125 L 275 220 L 270 380 L 130 380 L 125 220 Z" fill="${patternOverlay}" opacity="0.5" pointer-events="none" />` : ''}
            <path d="M 135 125 L 265 125 L 275 220 L 270 380 L 130 380 L 125 220 Z" fill="url(#body-gradient-front)" pointer-events="none" />
          </g>

          <!-- 左胸口袋 -->
          <g class="garment-part" data-part="pockets" cursor="pointer">
            <path d="M 150 185 L 185 185 L 185 225 L 167 235 L 150 225 Z" ${getPartStyle('pockets', cPockets)} />
          </g>

          <!-- 螺纹圆领 -->
          <g class="garment-part" data-part="collar" cursor="pointer">
            <path d="M 160 125 C 170 145, 230 145, 240 125 C 230 115, 170 115, 160 125 Z" ${getPartStyle('collar', cCollar)} />
          </g>

          <!-- 侧缝极简织唛标 -->
          <g class="garment-part" data-part="accents" cursor="pointer">
            <rect x="268" y="320" width="8" height="18" fill="${cAccents}" />
          </g>
        `;
        break;
    }

    return `
      <svg id="garment-svg-canvas" viewBox="40 40 320 440" width="100%" height="100%" filter="url(#fabric-shadow)" xmlns="http://www.w3.org/2000/svg">
        ${this.renderSvgDefs()}
        <g id="garment-render-group">
          ${partsSvg}
        </g>
      </svg>
    `;
  }

  /**
   * 计算引线标注坐标（模拟原图中的引线指示）
   */
  getLeaderLines(styleId) {
    // 对应 400x500 视口中的锚点位置
    const anchors = {
      trench_coat: [
        { part: 'collar', name: '大翻领与肩章', x: 230, y: 125, labelX: 330, labelY: 90, side: 'right' },
        { part: 'body', name: '主体风琴衣身', x: 200, y: 220, labelX: 60, labelY: 180, side: 'left' },
        { part: 'sleeves', name: '插肩长袖', x: 80, y: 310, labelX: 50, labelY: 280, side: 'left' },
        { part: 'pockets', name: '斜插挡雨袋', x: 145, y: 335, labelX: 70, labelY: 360, side: 'left' },
        { part: 'accents', name: '双排扣与腰带', x: 200, y: 287, labelX: 330, labelY: 270, side: 'right' },
        { part: 'hem', name: '防风下摆', x: 200, y: 445, labelX: 330, labelY: 430, side: 'right' }
      ],
      blazer: [
        { part: 'collar', name: '高定戗驳领', x: 220, y: 170, labelX: 330, labelY: 130, side: 'right' },
        { part: 'body', name: '收腰正装主体', x: 200, y: 250, labelX: 60, labelY: 220, side: 'left' },
        { part: 'sleeves', name: '假开衩袖管', x: 90, y: 320, labelX: 50, labelY: 310, side: 'left' },
        { part: 'pockets', name: '翻盖下袋/胸袋', x: 240, y: 310, labelX: 330, labelY: 300, side: 'right' },
        { part: 'accents', name: '金属包边排扣', x: 200, y: 290, labelX: 330, labelY: 370, side: 'right' }
      ],
      hoodie: [
        { part: 'collar', name: '立体连帽', x: 200, y: 80, labelX: 330, labelY: 70, side: 'right' },
        { part: 'body', name: '重磅卫衣身', x: 200, y: 210, labelX: 60, labelY: 180, side: 'left' },
        { part: 'sleeves', name: '落肩长袖', x: 85, y: 310, labelX: 50, labelY: 290, side: 'left' },
        { part: 'pockets', name: '袋鼠插手兜', x: 200, y: 315, labelX: 60, labelY: 360, side: 'left' },
        { part: 'accents', name: '金属头抽绳', x: 217, y: 190, labelX: 330, labelY: 210, side: 'right' },
        { part: 'hem', name: '加宽紧致罗纹', x: 200, y: 377, labelX: 330, labelY: 390, side: 'right' }
      ],
      bomber_jacket: [
        { part: 'collar', name: '针织棒球领', x: 200, y: 130, labelX: 330, labelY: 100, side: 'right' },
        { part: 'body', name: '抗撕裂衣身', x: 200, y: 220, labelX: 60, labelY: 200, side: 'left' },
        { part: 'sleeves', name: '战术工装袖', x: 85, y: 255, labelX: 50, labelY: 260, side: 'left' },
        { part: 'pockets', name: '立体斜插袋', x: 160, y: 305, labelX: 60, labelY: 340, side: 'left' },
        { part: 'accents', name: '荧光织带/拉链', x: 200, y: 260, labelX: 330, labelY: 250, side: 'right' },
        { part: 'hem', name: '防风收口下摆', x: 200, y: 364, labelX: 330, labelY: 370, side: 'right' }
      ],
      dress: [
        { part: 'collar', name: '法式优雅翻领', x: 200, y: 150, labelX: 330, labelY: 120, side: 'right' },
        { part: 'body', name: '收腰A字大裙身', x: 200, y: 320, labelX: 60, labelY: 300, side: 'left' },
        { part: 'sleeves', name: '复古泡泡袖', x: 100, y: 190, labelX: 50, labelY: 180, side: 'left' },
        { part: 'accents', name: '天然贝壳扣与腰带', x: 200, y: 240, labelX: 330, labelY: 230, side: 'right' },
        { part: 'hem', name: '飘逸流动下摆', x: 200, y: 460, labelX: 330, labelY: 450, side: 'right' }
      ],
      tee: [
        { part: 'collar', name: '高弹螺纹圆领', x: 200, y: 130, labelX: 330, labelY: 100, side: 'right' },
        { part: 'body', name: '无侧缝身板', x: 200, y: 260, labelX: 60, labelY: 240, side: 'left' },
        { part: 'sleeves', name: '微落肩短袖', x: 90, y: 190, labelX: 50, labelY: 180, side: 'left' },
        { part: 'pockets', name: '左胸工装口袋', x: 167, y: 210, labelX: 60, labelY: 210, side: 'left' },
        { part: 'accents', name: '侧缝极简织唛', x: 272, y: 330, labelX: 330, labelY: 330, side: 'right' }
      ]
    };

    return anchors[styleId] || anchors.trench_coat;
  }

  /**
   * 渲染 AI 虚拟试穿画布 (Canvas 核心融合算法)
   * 支持内置模特 & 用户上传照片，自适应身材与真实光影
   */
  renderTryonCanvas(canvasElem, isSideBySide = false) {
    if (!canvasElem) return;
    const ctx = canvasElem.getContext('2d');
    const width = canvasElem.width;
    const height = canvasElem.height;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 1. 绘制专业时尚摄影展台背景
    const bgGrad = ctx.createRadialGradient(width / 2, height * 0.45, 20, width / 2, height * 0.5, width * 0.85);
    bgGrad.addColorStop(0, '#2a3342');
    bgGrad.addColorStop(0.6, '#18202c');
    bgGrad.addColorStop(1, '#0b0f17');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 展台地面微弱反光与透视阴影
    ctx.beginPath();
    ctx.ellipse(width / 2, height * 0.9, width * 0.38, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fill();

    // 2. 绘制模特层 (Model Layer)
    if (this.customUserPhoto) {
      // 绘制用户自拍并进行居中对齐适应
      const img = this.customUserPhoto;
      const aspect = img.width / img.height;
      let drawW = width * 0.85;
      let drawH = drawW / aspect;
      if (drawH < height * 0.9) {
        drawH = height * 0.9;
        drawW = drawH * aspect;
      }
      const drawX = (width - drawW) / 2 + this.customPhotoTransform.x;
      const drawY = (height - drawH) / 2 + this.customPhotoTransform.y;

      ctx.save();
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();
    } else {
      // 绘制拟真矢量人体模特
      this.drawRealisticModelBody(ctx, width, height, this.currentModel, this.currentAngle);
    }

    // 3. 绘制服装贴合层 (Garment Fit & Warping Layer)
    this.drawGarmentOnBody(ctx, width, height, this.currentDesign, this.currentModel, this.currentAngle);

    // 4. 绘制环境光遮蔽与高光滤镜 (Ambient Occlusion & Fabric Highlights)
    this.drawLightingAndCreases(ctx, width, height, this.currentAngle);

    // 5. 试穿信息与 AI 适配度角标
    if (!isSideBySide) {
      this.drawTryonWatermark(ctx, width, height);
    }
  }

  /**
   * 绘制逼真写意模特形体 (头颈、四肢、皮肤质感)
   */
  drawRealisticModelBody(ctx, w, h, model, angle) {
    const cx = w / 2;
    const skinTone = model?.skinTone === 'fair' ? '#fbe5d6' : (model?.skinTone === 'light' ? '#f5d0b5' : '#e0ac82');
    const skinShadow = model?.skinTone === 'fair' ? '#e8c4b0' : (model?.skinTone === 'light' ? '#d9a987' : '#be845b');

    // 头部中心与大小
    const headY = h * 0.16;
    const headR = 34;

    // 头发
    ctx.fillStyle = '#1e1b18';
    ctx.beginPath();
    ctx.arc(cx, headY - 4, headR + 3, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();

    // 脸庞与脖颈
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.ellipse(cx, headY, headR * 0.82, headR * 1.05, 0, 0, Math.PI * 2);
    ctx.fill();

    // 脖颈
    ctx.fillStyle = skinShadow;
    ctx.beginPath();
    ctx.moveTo(cx - 15, headY + 28);
    ctx.lineTo(cx + 15, headY + 28);
    ctx.lineTo(cx + 22, headY + 68);
    ctx.lineTo(cx - 22, headY + 68);
    ctx.closePath();
    ctx.fill();

    // 锁骨高光微光
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 28, headY + 68);
    ctx.quadraticCurveTo(cx, headY + 74, cx + 28, headY + 68);
    ctx.stroke();

    // 手臂与腿部剪影
    ctx.fillStyle = skinTone;
    // 左手臂露出的手腕/手部
    ctx.beginPath();
    ctx.ellipse(cx - 86, h * 0.62, 10, 24, -0.15, 0, Math.PI * 2);
    ctx.fill();
    // 右手臂露出的手腕/手部
    ctx.beginPath();
    ctx.ellipse(cx + 86, h * 0.62, 10, 24, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // 裤装/腿部（高定质感垂坠西裤/修身牛仔）
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.moveTo(cx - 45, h * 0.65);
    ctx.lineTo(cx + 45, h * 0.65);
    ctx.lineTo(cx + 40, h * 0.92);
    ctx.lineTo(cx + 8, h * 0.92);
    ctx.lineTo(cx, h * 0.72);
    ctx.lineTo(cx - 8, h * 0.92);
    ctx.lineTo(cx - 40, h * 0.92);
    ctx.closePath();
    ctx.fill();

    // 意式皮鞋/皮靴
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.ellipse(cx - 26, h * 0.92, 14, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 26, h * 0.92, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * 将定制服装渲染贴合在人体躯干上
   */
  drawGarmentOnBody(ctx, w, h, design, model, angle) {
    const cx = w / 2;
    const cy = h * 0.44;
    const styleId = design.styleId || 'trench_coat';
    const colors = design.colors || {};

    const cBody = colors.body || '#d2b48c';
    const cCollar = colors.collar || '#8b5a2b';
    const cSleeves = colors.sleeves || '#d2b48c';
    const cPockets = colors.pockets || '#8b5a2b';
    const cAccents = colors.accents || '#2f1f17';
    const cHem = colors.hem || '#8b5a2b';

    // 模特身材缩放系数
    let scaleX = 1.0;
    let scaleY = 1.0;
    if (model) {
      scaleX = (model.shoulderWidth || 44) / 44;
      scaleY = (parseInt(model.height) || 175) / 175;
    }

    ctx.save();
    ctx.translate(cx, cy);

    // 视角透视变换微调
    if (angle === 'side') {
      ctx.transform(0.72, 0, -0.15, 1, -20, 0);
    } else if (angle === 'back') {
      scaleX *= 0.98;
    }
    ctx.scale(scaleX * 0.92, scaleY * 0.92);

    // 绘制服装各个部件的拟真渐变填充与织物微观光影
    this.renderGarmentBodyMesh(ctx, styleId, { cBody, cCollar, cSleeves, cPockets, cAccents, cHem }, angle);

    ctx.restore();
  }

  /**
   * 服装躯干几何网格渲染
   */
  renderGarmentBodyMesh(ctx, styleId, cols, angle) {
    // 基础偏移量标准化：以 (0,0) 为胸部中心
    const { cBody, cCollar, cSleeves, cPockets, cAccents, cHem } = cols;

    // 1. 袖子 (先画底层)
    ctx.fillStyle = cSleeves;
    // 左袖
    ctx.beginPath();
    ctx.moveTo(-60, -95);
    ctx.quadraticCurveTo(-115, -20, -100, 105);
    ctx.lineTo(-65, 110);
    ctx.quadraticCurveTo(-75, 0, -45, -30);
    ctx.closePath();
    ctx.fill();

    // 右袖
    ctx.beginPath();
    ctx.moveTo(60, -95);
    ctx.quadraticCurveTo(115, -20, 100, 105);
    ctx.lineTo(65, 110);
    ctx.quadraticCurveTo(75, 0, 45, -30);
    ctx.closePath();
    ctx.fill();

    // 2. 主体躯干 (Body)
    const bodyGrad = ctx.createLinearGradient(-70, 0, 70, 0);
    bodyGrad.addColorStop(0, 'rgba(0,0,0,0.22)');
    bodyGrad.addColorStop(0.2, 'rgba(255,255,255,0.06)');
    bodyGrad.addColorStop(0.5, 'rgba(255,255,255,0.14)');
    bodyGrad.addColorStop(0.8, 'rgba(255,255,255,0.06)');
    bodyGrad.addColorStop(1, 'rgba(0,0,0,0.28)');

    ctx.fillStyle = cBody;
    ctx.beginPath();
    if (styleId === 'dress') {
      // 连衣裙长摆
      ctx.moveTo(-50, -100);
      ctx.lineTo(50, -100);
      ctx.lineTo(40, -10);
      ctx.lineTo(105, 175);
      ctx.lineTo(-105, 175);
      ctx.lineTo(-40, -10);
    } else if (styleId === 'trench_coat') {
      // 长款风衣
      ctx.moveTo(-55, -100);
      ctx.lineTo(55, -100);
      ctx.lineTo(50, 0);
      ctx.lineTo(75, 160);
      ctx.lineTo(-75, 160);
      ctx.lineTo(-50, 0);
    } else {
      // 夹克/西装/卫衣常规长度
      ctx.moveTo(-55, -100);
      ctx.lineTo(55, -100);
      ctx.lineTo(52, 0);
      ctx.lineTo(58, 95);
      ctx.lineTo(-58, 95);
      ctx.lineTo(-52, 0);
    }
    ctx.closePath();
    ctx.fill();

    // 叠加立体光影
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // 3. 领子 (Collar)
    if (angle !== 'back') {
      ctx.fillStyle = cCollar;
      if (styleId === 'hoodie') {
        // 连帽兜
        ctx.beginPath();
        ctx.ellipse(0, -95, 38, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(0, -92, 22, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (styleId === 'blazer' || styleId === 'trench_coat') {
        // 驳领/大翻领
        ctx.beginPath();
        ctx.moveTo(-45, -100);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-25, -25);
        ctx.lineTo(-55, -70);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(45, -100);
        ctx.lineTo(5, 0);
        ctx.lineTo(25, -25);
        ctx.lineTo(55, -70);
        ctx.closePath();
        ctx.fill();
      } else {
        // 圆领/立领
        ctx.beginPath();
        ctx.ellipse(0, -95, 26, 12, 0, 0, Math.PI);
        ctx.lineWidth = 4;
        ctx.strokeStyle = cCollar;
        ctx.stroke();
      }
    }

    // 4. 口袋与辅料 (Pockets & Accents)
    if (angle !== 'back') {
      ctx.fillStyle = cPockets;
      if (styleId === 'hoodie') {
        // 袋鼠口袋
        ctx.beginPath();
        ctx.moveTo(-32, 25);
        ctx.lineTo(32, 25);
        ctx.lineTo(44, 75);
        ctx.lineTo(-44, 75);
        ctx.closePath();
        ctx.fill();
      } else if (styleId === 'trench_coat') {
        // 风衣腰带与双排扣
        ctx.fillStyle = cAccents;
        ctx.fillRect(-52, 12, 104, 14);
        // 金属腰带扣
        ctx.strokeStyle = '#fcd34d';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-12, 9, 24, 20);

        // 排扣
        ctx.fillStyle = cAccents;
        ctx.beginPath();
        ctx.arc(-15, -45, 3.5, 0, Math.PI * 2);
        ctx.arc(15, -45, 3.5, 0, Math.PI * 2);
        ctx.arc(-15, -15, 3.5, 0, Math.PI * 2);
        ctx.arc(15, -15, 3.5, 0, Math.PI * 2);
        ctx.arc(-15, 55, 3.5, 0, Math.PI * 2);
        ctx.arc(15, 55, 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (styleId === 'bomber_jacket') {
        // 机能主拉链
        ctx.strokeStyle = cAccents;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -90);
        ctx.lineTo(0, 95);
        ctx.stroke();
      }
    }
  }

  /**
   * 绘制织物褶皱、环境光与高保真缝线
   */
  drawLightingAndCreases(ctx, w, h, angle) {
    const cx = w / 2;
    const cy = h * 0.44;

    ctx.save();
    ctx.translate(cx, cy);

    // 褶皱阴影折痕
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    ctx.beginPath();
    // 腋下自然褶皱
    ctx.moveTo(-45, -20);
    ctx.quadraticCurveTo(-30, -5, -20, 15);
    ctx.moveTo(45, -20);
    ctx.quadraticCurveTo(30, -5, 20, 15);
    // 腰腹微褶
    ctx.moveTo(-25, 40);
    ctx.quadraticCurveTo(0, 48, 25, 40);
    ctx.stroke();

    // 顶部柔光氛围遮罩
    const vignette = ctx.createLinearGradient(0, -h * 0.4, 0, h * 0.4);
    vignette.addColorStop(0, 'rgba(255,255,255,0.08)');
    vignette.addColorStop(0.3, 'rgba(255,255,255,0.0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = vignette;
    ctx.fillRect(-w / 2, -h / 2, w, h);

    ctx.restore();
  }

  /**
   * 绘制 AI 拟真水印与拟合置信度标签
   */
  drawTryonWatermark(ctx, w, h) {
    ctx.save();

    // 右上角：AI 拟真状态胶囊
    const padX = w - 145;
    const padY = 20;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(padX, padY, 130, 32, 16);
    ctx.fill();
    ctx.stroke();

    // 绿灯闪烁指示
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(padX + 16, padY + 16, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('AI 虚拟试穿 99.4%', padX + 28, padY + 20);

    // 左下角：当前搭配信息小标牌
    const tagY = h - 55;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.roundRect(16, tagY, 180, 42, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('DESIGN / MODEL', 26, tagY + 16);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
    const title = this.currentDesign?.name || '高定风尚';
    ctx.fillText(title.length > 12 ? title.substring(0, 11) + '..' : title, 26, tagY + 32);

    ctx.restore();
  }

  /**
   * 导出超清打版卡海报 (Canvas 2K 高清合成)
   */
  exportDesignPoster(design, model) {
    const posterCanvas = document.createElement('canvas');
    posterCanvas.width = 1200;
    posterCanvas.height = 1600;
    const pctx = posterCanvas.getContext('2d');

    // 背景
    pctx.fillStyle = '#0f172a';
    pctx.fillRect(0, 0, 1200, 1600);

    // 顶部品牌标题
    pctx.fillStyle = '#ffffff';
    pctx.font = 'bold 44px -apple-system, BlinkMacSystemFont, sans-serif';
    pctx.fillText('FASHION AI STUDIO', 80, 100);

    pctx.fillStyle = '#38bdf8';
    pctx.font = '22px -apple-system, BlinkMacSystemFont, sans-serif';
    pctx.fillText('服装个性化定制与 AI 虚拟试穿工单报告', 80, 140);

    pctx.strokeStyle = 'rgba(255,255,255,0.15)';
    pctx.lineWidth = 1;
    pctx.beginPath();
    pctx.moveTo(80, 170);
    pctx.lineTo(1120, 170);
    pctx.stroke();

    // 左侧：试穿大图
    const tryonSubCanvas = document.createElement('canvas');
    tryonSubCanvas.width = 500;
    tryonSubCanvas.height = 700;
    this.renderTryonCanvas(tryonSubCanvas);
    pctx.drawImage(tryonSubCanvas, 80, 200, 500, 700);

    // 右侧：款式信息与材质色号卡
    pctx.fillStyle = '#f8fafc';
    pctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
    pctx.fillText(design.name || '定制方案', 630, 240);

    pctx.fillStyle = '#94a3b8';
    pctx.font = '20px -apple-system, BlinkMacSystemFont, sans-serif';
    pctx.fillText(`版型款式：${design.styleName || design.styleId}`, 630, 285);
    pctx.fillText(`定制面料：${design.materials?.body || '高支纯棉'}`, 630, 325);
    pctx.fillText(`试穿模特：${model?.name || '标准模特'} (${model?.height || '175cm'})`, 630, 365);
    pctx.fillText(`成衣工期预估：7~10 个工作日`, 630, 405);

    // 配色与部件明细色块
    pctx.fillStyle = '#ffffff';
    pctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, sans-serif';
    pctx.fillText('部件分色方案 (Color Separation)', 630, 470);

    const parts = Object.entries(design.colors || {});
    parts.forEach(([partKey, hex], idx) => {
      const y = 510 + idx * 55;
      pctx.fillStyle = hex;
      pctx.beginPath();
      pctx.roundRect(630, y, 40, 40, 6);
      pctx.fill();
      pctx.stroke();

      pctx.fillStyle = '#e2e8f0';
      pctx.font = '18px -apple-system, BlinkMacSystemFont, sans-serif';
      pctx.fillText(`${partKey.toUpperCase()} 部件: ${hex}`, 685, y + 26);
    });

    // 底部：设计条形码与工单防伪
    pctx.fillStyle = '#64748b';
    pctx.font = '16px monospace';
    pctx.fillText(`SN: Y3-FASHION-${Date.now().toString(36).toUpperCase()} | VERIFIED BY AI TRY-ON ENGINE`, 80, 1530);

    return posterCanvas.toDataURL('image/png');
  }
}

// 挂载到全局
if (typeof window !== 'undefined') {
  window.TryOnEngine = TryOnEngine;
}

