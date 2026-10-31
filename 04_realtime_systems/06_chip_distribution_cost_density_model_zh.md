# 筹码分布与成本峰值密度量化模型（脱敏版）

> **作者/量化架构师**：Quantitative Trading & Factor Engineering Team  
> **核心算法**：换手率衰减模型 · 成本筹码峰值密度 · 获利盘比例算力 · 坑底 UP 动能背离识别

---

## 一、 模型背景与数学原理

在股票与量化交易中，筹码分布（Chips Distribution）反映了市场全量持有者的持仓成本结构。筹码峰值的聚集与扩散直接决定了阻力位与支撑位的强度。

本项目基于每日换手率与历史价格衰减函数，构建了 **“动态筹码峰值密度与坑底 UP 动能背离”** 量化因子模型。

```mermaid
graph TD
    Data[日线/分钟级 K 线与换手率] --> Decay[换手率衰减衰减概率算子]
    Decay --> Dense[筹码成本集中度与峰值密度计算]
    Dense --> Factor1[筹码获利盘比例 (Profit Ratio)]
    Dense --> Factor2[筹码集中度 (Chip Concentration)]
    Factor1 & Factor2 --> Divergence[坑底 UP 动能背离模型]
    Divergence --> Signal[量化买卖点与风控信号]
```

---

## 二、 核心算法与代码实现

```python
# 脱敏算法示意：筹码分布峰值密度计算
import numpy as np

def calculate_chip_distribution(prices, volumes, turnover_rates, bins=100):
    """
    基于历史换手率衰减计算筹码分布
    """
    price_min, price_max = np.min(prices), np.max(prices)
    price_bins = np.linspace(price_min, price_max, bins)
    chip_heap = np.zeros(bins)
    
    decay_factor = 1.0
    for price, volume, turnover in zip(reversed(prices), reversed(volumes), reversed(turnover_rates)):
        # 换手率衰减逻辑
        effective_turnover = min(turnover, 1.0)
        idx = np.digitize(price, price_bins) - 1
        if 0 <= idx < bins:
            chip_heap[idx] += volume * decay_factor
        decay_factor *= (1.0 - effective_turnover)
        if decay_factor < 0.01:
            break
            
    chip_density = chip_heap / (np.sum(chip_heap) + 1e-8)
    return price_bins, chip_density
```

---

## 三、 工程价值

1. **精确度极高**：通过衰减因子修正了传统静态筹码指标的滞后性。
2. **信号清晰**：有效识别筹码单峰密集、双峰形态及突破拉升点，为量化策略提供坚实支撑。

*(注：本模型文档已作数学公式与内部参数脱敏处理)*
