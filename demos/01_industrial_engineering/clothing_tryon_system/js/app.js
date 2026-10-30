/**
 * 服装个性化设计与 AI 虚拟试穿平台 - 主应用控制器
 */

document.addEventListener('DOMContentLoaded', () => {
  // 全局状态管理
  const state = {
    currentStyle: FASHION_PRESETS.styles[0],
    currentModel: FASHION_PRESETS.models[0],
    activeStep: 2, // 1: 选款, 2: 定制, 3: 模特, 4: 试穿, 5: 对比
    currentAngle: 'front',
    selectedPart: 'body',
    hoverPart: null,
    designState: {
      id: null,
      name: '定制风尚方案',
      styleId: FASHION_PRESETS.styles[0].id,
      styleName: FASHION_PRESETS.styles[0].name,
      colors: { ...FASHION_PRESETS.styles[0].defaultColors },
      materials: {
        body: FASHION_PRESETS.styles[0].defaultMaterial,
        collar: FASHION_PRESETS.styles[0].defaultMaterial
      },
      pattern: FASHION_PRESETS.styles[0].defaultPattern,
      fit: 'regular',
      tags: ['高定设计', 'AI拟合']
    },
    compareList: [],
    savedDesigns: []
  };

  // 初始化试穿引擎
  const tryonEngine = new TryOnEngine();
  tryonEngine.init(state.designState, state.currentModel);

  // DOM 元素引用
  const dom = {
    // 流程步骤
    stepItems: document.querySelectorAll('.step-item'),
    
    // 款式列表
    styleList: document.getElementById('style-scroll-list'),
    
    // 定制画布与引线
    canvasViewport: document.getElementById('canvas-viewport'),
    calloutOverlay: document.getElementById('callout-overlay'),
    partTabs: document.getElementById('part-tabs'),
    materialSelect: document.getElementById('material-select'),
    patternSelect: document.getElementById('pattern-select'),
    paletteSwatches: document.getElementById('palette-swatches'),
    customColorInput: document.getElementById('custom-color-input'),
    selectedPartLabel: document.getElementById('selected-part-label'),
    
    // 快捷按钮
    btnRandomPalette: document.getElementById('btn-random-palette'),
    btnResetDesign: document.getElementById('btn-reset-design'),
    
    // 手机屏幕试穿
    tryonCanvas: document.getElementById('tryon-canvas'),
    angleBtns: document.querySelectorAll('.angle-btn'),
    modelChips: document.getElementById('model-thumbnails'),
    photoUploadInput: document.getElementById('photo-upload-input'),
    
    // 顶部操作
    btnCompareModal: document.getElementById('btn-compare-modal'),
    btnSaveDesign: document.getElementById('btn-save-design'),
    btnExportPoster: document.getElementById('btn-export-poster'),
    btnOpenLibrary: document.getElementById('btn-open-library'),
    
    // 对比弹窗
    compareModal: document.getElementById('compare-modal'),
    btnCloseCompare: document.getElementById('btn-close-compare'),
    compareGrid: document.getElementById('compare-grid'),
    btnAddToCompare: document.getElementById('btn-add-to-compare'),
    
    // 方案库弹窗
    libraryModal: document.getElementById('library-modal'),
    btnCloseLibrary: document.getElementById('btn-close-library'),
    libraryGrid: document.getElementById('library-grid')
  };

  // 设置试穿 Canvas 分辨率
  function resizeCanvas() {
    if (dom.tryonCanvas) {
      dom.tryonCanvas.width = 380;
      dom.tryonCanvas.height = 540;
    }
  }
  resizeCanvas();

  // 1. 初始化款式列表
  function renderStyleCards() {
    dom.styleList.innerHTML = '';
    FASHION_PRESETS.styles.forEach(style => {
      const card = document.createElement('div');
      card.className = `style-card ${style.id === state.currentStyle.id ? 'active' : ''}`;
      card.innerHTML = `
        <div class="style-card-header">
          <span class="style-card-title">${style.name}</span>
          <span class="style-card-cat">${style.gender === 'men' ? '男士' : (style.gender === 'women' ? '女士' : '中性')}</span>
        </div>
        <p class="style-card-desc">${style.desc}</p>
        <div class="style-card-meta">
          <span>✓ ${style.parts.length} 个拆解定制部件</span>
        </div>
      `;
      card.addEventListener('click', () => {
        selectStyle(style);
      });
      dom.styleList.appendChild(card);
    });
  }

  // 切换款式
  function selectStyle(style) {
    state.currentStyle = style;
    state.designState.styleId = style.id;
    state.designState.styleName = style.name;
    state.designState.colors = { ...style.defaultColors };
    state.designState.materials = { body: style.defaultMaterial, collar: style.defaultMaterial };
    state.designState.pattern = style.defaultPattern;
    state.selectedPart = style.parts[0] || 'body';

    tryonEngine.setDesign(state.designState);

    renderStyleCards();
    renderPartTabs();
    renderCustomizerCanvas();
    renderTryonView();
  }

  // 2. 渲染部件选择 Tabs
  function renderPartTabs() {
    dom.partTabs.innerHTML = '';
    const parts = state.currentStyle.parts || ['body'];
    const names = state.currentStyle.partNames || {};

    parts.forEach(part => {
      const btn = document.createElement('button');
      btn.className = `part-tab-btn ${part === state.selectedPart ? 'active' : ''}`;
      btn.textContent = names[part] || part;
      btn.addEventListener('click', () => {
        state.selectedPart = part;
        updatePartSelection();
      });
      dom.partTabs.appendChild(btn);
    });

    updatePartSelectionLabel();
  }

  function updatePartSelectionLabel() {
    const names = state.currentStyle.partNames || {};
    if (dom.selectedPartLabel) {
      dom.selectedPartLabel.textContent = names[state.selectedPart] || state.selectedPart;
    }
  }

  function updatePartSelection() {
    document.querySelectorAll('.part-tab-btn').forEach(btn => {
      const names = state.currentStyle.partNames || {};
      btn.classList.toggle('active', btn.textContent === (names[state.selectedPart] || state.selectedPart));
    });
    updatePartSelectionLabel();
    renderCustomizerCanvas();
  }

  // 3. 渲染调色板与材质选项
  function renderPalette() {
    dom.paletteSwatches.innerHTML = '';
    // 精选流行色组合
    const primaryPal = FASHION_PRESETS.colorPalettes[0].colors.concat(FASHION_PRESETS.colorPalettes[1].colors.slice(0, 4));
    
    primaryPal.forEach(col => {
      const swatch = document.createElement('div');
      swatch.className = 'swatch-color';
      swatch.style.backgroundColor = col.hex;
      swatch.title = `${col.name} (${col.hex})`;
      swatch.addEventListener('click', () => {
        applyColorToPart(col.hex);
      });
      dom.paletteSwatches.appendChild(swatch);
    });

    // 材质下拉
    dom.materialSelect.innerHTML = '';
    FASHION_PRESETS.materials.forEach(mat => {
      const opt = document.createElement('option');
      opt.value = mat.id;
      opt.textContent = `${mat.name} - ${mat.weight}`;
      dom.materialSelect.appendChild(opt);
    });
    dom.materialSelect.value = state.designState.materials?.body || 'cotton';

    dom.materialSelect.addEventListener('change', (e) => {
      state.designState.materials.body = e.target.value;
      tryonEngine.setDesign(state.designState);
      renderCustomizerCanvas();
      renderTryonView();
    });

    // 印花下拉
    dom.patternSelect.innerHTML = '';
    FASHION_PRESETS.patterns.forEach(pat => {
      const opt = document.createElement('option');
      opt.value = pat.id;
      opt.textContent = pat.name;
      dom.patternSelect.appendChild(opt);
    });
    dom.patternSelect.value = state.designState.pattern || 'solid';

    dom.patternSelect.addEventListener('change', (e) => {
      state.designState.pattern = e.target.value;
      tryonEngine.setDesign(state.designState);
      renderCustomizerCanvas();
      renderTryonView();
    });

    // 自定义拾色器
    if (dom.customColorInput) {
      dom.customColorInput.addEventListener('input', (e) => {
        applyColorToPart(e.target.value);
      });
    }
  }

  function applyColorToPart(hex) {
    if (!state.designState.colors) state.designState.colors = {};
    state.designState.colors[state.selectedPart] = hex;

    tryonEngine.setDesign(state.designState);
    renderCustomizerCanvas();
    renderTryonView();
  }

  // 4. 渲染中央矢量服装画布与引线指示层
  function renderCustomizerCanvas() {
    const svgHtml = tryonEngine.generateGarmentSvg(
      state.currentStyle.id,
      state.designState.colors,
      state.selectedPart,
      state.hoverPart
    );

    // 包装并放置在视口
    dom.canvasViewport.innerHTML = svgHtml;

    // 绑定部件点击与悬停事件
    const partElements = dom.canvasViewport.querySelectorAll('.garment-part');
    partElements.forEach(elem => {
      const partKey = elem.getAttribute('data-part');

      elem.addEventListener('mouseenter', () => {
        state.hoverPart = partKey;
        highlightLeaderLine(partKey, true);
      });

      elem.addEventListener('mouseleave', () => {
        state.hoverPart = null;
        highlightLeaderLine(partKey, false);
      });

      elem.addEventListener('click', () => {
        state.selectedPart = partKey;
        updatePartSelection();
      });
    });

    // 渲染引线覆盖层
    renderLeaderLines();
  }

  // 渲染引线指示标注 (仿原图手绘示意图中的引线指示)
  function renderLeaderLines() {
    dom.calloutOverlay.innerHTML = '';
    const linesData = tryonEngine.getLeaderLines(state.currentStyle.id);
    const viewportRect = dom.canvasViewport.getBoundingClientRect();

    linesData.forEach(item => {
      const tag = document.createElement('div');
      tag.className = `callout-tag ${item.part === state.selectedPart ? 'active' : ''}`;
      tag.id = `callout-${item.part}`;

      // 计算位置百分比
      const leftPct = (item.labelX / 400) * 100;
      const topPct = (item.labelY / 500) * 100;
      tag.style.left = `${leftPct}%`;
      tag.style.top = `${topPct}%`;

      const names = state.currentStyle.partNames || {};
      const displayName = names[item.part] || item.name;

      tag.innerHTML = `
        <span class="callout-dot"></span>
        <span>${displayName}</span>
      `;

      tag.addEventListener('mouseenter', () => {
        state.hoverPart = item.part;
        renderCustomizerCanvas();
      });

      tag.addEventListener('mouseleave', () => {
        state.hoverPart = null;
        renderCustomizerCanvas();
      });

      tag.addEventListener('click', () => {
        state.selectedPart = item.part;
        updatePartSelection();
      });

      dom.calloutOverlay.appendChild(tag);
    });
  }

  function highlightLeaderLine(partKey, isHover) {
    const tag = document.getElementById(`callout-${partKey}`);
    if (tag) {
      if (isHover) tag.classList.add('pulse-target');
      else tag.classList.remove('pulse-target');
    }
  }

  // 5. 渲染右侧 AI 虚拟试穿视图 (Canvas)
  function renderTryonView() {
    tryonEngine.renderTryonCanvas(dom.tryonCanvas);
  }

  // 模特缩略图初始化
  function renderModelChips() {
    dom.modelChips.innerHTML = '';
    FASHION_PRESETS.models.forEach(model => {
      const chip = document.createElement('div');
      chip.className = `model-chip ${model.id === state.currentModel.id ? 'active' : ''}`;
      chip.innerHTML = `
        <span class="model-chip-emoji">${model.avatarEmoji}</span>
        <span class="model-chip-name">${model.name.split(' ')[0]}</span>
      `;
      chip.addEventListener('click', () => {
        state.currentModel = model;
        tryonEngine.setModel(model);
        document.querySelectorAll('.model-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderTryonView();
      });
      dom.modelChips.appendChild(chip);
    });
  }

  // 角度切换 Front / Side / Back
  dom.angleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.angleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const angle = btn.getAttribute('data-angle');
      state.currentAngle = angle;
      tryonEngine.setAngle(angle);
      renderTryonView();
    });
  });

  // 用户上传人像照片
  dom.photoUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        tryonEngine.setUserPhoto(img);
        renderTryonView();
        // 取消模特的激活态
        document.querySelectorAll('.model-chip').forEach(c => c.classList.remove('active'));
        alert('照片上传成功！AI 试穿贴合引擎已自适应匹配您的人像。');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // 随机灵感配色
  dom.btnRandomPalette.addEventListener('click', () => {
    const allColors = FASHION_PRESETS.colorPalettes.flatMap(p => p.colors);
    const getRandomColor = () => allColors[Math.floor(Math.random() * allColors.length)].hex;

    const parts = state.currentStyle.parts;
    parts.forEach(p => {
      state.designState.colors[p] = getRandomColor();
    });

    tryonEngine.setDesign(state.designState);
    renderCustomizerCanvas();
    renderTryonView();
  });

  // 重置设计
  dom.btnResetDesign.addEventListener('click', () => {
    state.designState.colors = { ...state.currentStyle.defaultColors };
    state.designState.materials = { body: state.currentStyle.defaultMaterial };
    state.designState.pattern = state.currentStyle.defaultPattern;
    tryonEngine.setDesign(state.designState);
    renderCustomizerCanvas();
    renderTryonView();
  });

  // 6. 保存方案与方案库
  dom.btnSaveDesign.addEventListener('click', async () => {
    const designName = prompt('请输入该定制方案的专属名称：', `${state.currentStyle.name} - ${new Date().toLocaleDateString()}`);
    if (!designName) return;

    state.designState.name = designName;
    state.designState.id = `design-${Date.now()}`;
    state.designState.createdAt = new Date().toLocaleString();

    try {
      const resp = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.designState)
      });
      const res = await resp.json();
      if (res.success) {
        alert('方案已成功保存到您的时尚方案库！');
        loadSavedDesigns();
      }
    } catch (err) {
      console.warn('API 保存失败，自动降级至本地 localStorage：', err);
      const local = JSON.parse(localStorage.getItem('y3_fashion_designs') || '[]');
      local.unshift(state.designState);
      localStorage.setItem('y3_fashion_designs', JSON.stringify(local));
      alert('方案已保存在本地浏览器方案库！');
    }
  });

  // 加载方案库
  async function loadSavedDesigns() {
    try {
      const resp = await fetch('/api/designs');
      const res = await resp.json();
      if (res.success) {
        state.savedDesigns = res.data;
      }
    } catch (err) {
      state.savedDesigns = JSON.parse(localStorage.getItem('y3_fashion_designs') || '[]');
    }
  }
  loadSavedDesigns();

  // 打开方案库
  dom.btnOpenLibrary.addEventListener('click', () => {
    renderLibraryGrid();
    dom.libraryModal.classList.add('show');
  });

  dom.btnCloseLibrary.addEventListener('click', () => {
    dom.libraryModal.classList.remove('show');
  });

  function renderLibraryGrid() {
    dom.libraryGrid.innerHTML = '';
    if (!state.savedDesigns.length) {
      dom.libraryGrid.innerHTML = '<p style="color:var(--text-muted);grid-column: 1/-1;text-align:center;padding:40px;">暂无保存的方案，快来设计并保存第一个作品吧！</p>';
      return;
    }

    state.savedDesigns.forEach(design => {
      const card = document.createElement('div');
      card.className = 'compare-card';
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h4 style="color:#ffffff;">${design.name}</h4>
          <span style="font-size:11px;color:#38bdf8;">${design.createdAt || ''}</span>
        </div>
        <p style="font-size:12px;color:var(--text-sub);">${design.styleName || design.styleId}</p>
        <div style="display:flex;gap:6px;margin:8px 0;">
          ${Object.values(design.colors || {}).map(c => `<span style="width:16px;height:16px;border-radius:50%;background:${c};display:inline-block;border:1px solid #ffffff40;"></span>`).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-top:auto;">
          <button class="btn-primary load-design-btn" style="flex:1;padding:6px;font-size:12px;">加载应用</button>
        </div>
      `;

      card.querySelector('.load-design-btn').addEventListener('click', () => {
        loadSpecificDesign(design);
        dom.libraryModal.classList.remove('show');
      });

      dom.libraryGrid.appendChild(card);
    });
  }

  function loadSpecificDesign(design) {
    const style = FASHION_PRESETS.styles.find(s => s.id === design.styleId) || FASHION_PRESETS.styles[0];
    state.currentStyle = style;
    state.designState = JSON.parse(JSON.stringify(design));
    tryonEngine.setDesign(state.designState);

    renderStyleCards();
    renderPartTabs();
    renderCustomizerCanvas();
    renderTryonView();
  }

  // 7. 多方案并排对比功能 (4. 多方案对比)
  dom.btnCompareModal.addEventListener('click', () => {
    renderCompareCards();
    dom.compareModal.classList.add('show');
  });

  dom.btnCloseCompare.addEventListener('click', () => {
    dom.compareModal.classList.remove('show');
  });

  dom.btnAddToCompare.addEventListener('click', () => {
    const snapshot = JSON.parse(JSON.stringify(state.designState));
    snapshot.compareId = `cmp-${Date.now()}`;
    snapshot.name = `${snapshot.styleName} (${state.compareList.length + 1}号对比案)`;

    if (state.compareList.length >= 4) {
      state.compareList.shift(); // 最多支持 4 个并排
    }
    state.compareList.push(snapshot);
    renderCompareCards();
    alert('已将当前设计加入并排对比！');
  });

  function renderCompareCards() {
    dom.compareGrid.innerHTML = '';
    // 如果对比列表为空，把当前方案自动放入
    const listToRender = state.compareList.length ? state.compareList : [JSON.parse(JSON.stringify(state.designState))];

    listToRender.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'compare-card';

      const canvasId = `compare-canvas-${idx}`;
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h4 style="color:#ffffff;">方案 ${String.fromCharCode(65 + idx)}: ${item.name}</h4>
          <span class="panel-badge">对比中</span>
        </div>
        <div class="compare-canvas-box">
          <canvas id="${canvasId}" width="260" height="240"></canvas>
        </div>
        <table class="compare-info-table">
          <tr><td>基础版型</td><td>${item.styleName || item.styleId}</td></tr>
          <tr><td>主要面料</td><td>${item.materials?.body || '棉麻混纺'}</td></tr>
          <tr><td>印花纹理</td><td>${item.pattern || '经典素色'}</td></tr>
          <tr><td>推荐场合</td><td>商务通勤 / 社交时尚</td></tr>
          <tr><td>透气保暖</td><td>★★★★☆</td></tr>
          <tr><td>工期预估</td><td>5 ~ 7 天</td></tr>
        </table>
      `;

      dom.compareGrid.appendChild(card);

      // 异步渲染并排试穿缩略图
      setTimeout(() => {
        const cElem = document.getElementById(canvasId);
        if (cElem) {
          const tempEngine = new TryOnEngine();
          tempEngine.init(item, state.currentModel);
          tempEngine.renderTryonCanvas(cElem, true);
        }
      }, 50);
    });
  }

  // 8. 导出高清工单海报 (5. 保存与分享)
  dom.btnExportPoster.addEventListener('click', () => {
    const posterDataUrl = tryonEngine.exportDesignPoster(state.designState, state.currentModel);
    const link = document.createElement('a');
    link.download = `FashionStudio_${state.designState.styleId}_${Date.now()}.png`;
    link.href = posterDataUrl;
    link.click();
  });

  // 初始启动执行
  renderStyleCards();
  renderPartTabs();
  renderPalette();
  renderCustomizerCanvas();
  renderModelChips();
  renderTryonView();

  console.log('👗 服装个性化设计与 AI 虚拟试穿平台 (Fashion AI Studio) 初始化就绪！');
});

