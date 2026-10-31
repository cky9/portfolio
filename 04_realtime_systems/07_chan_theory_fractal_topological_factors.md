# Chan Theory Bi/Segment and Pivot Multi-Dimensional Quantitative Factor Model (Sanitized Version)

> **Author / Quantitative Algorithm Engineer**: Quantitative Strategy & Algorithmic Research Team
> **Core Algorithms**: Top/Bottom Fractal Resolution · Chan Theory Bi/Segment Standardization Logic · Automated Trend Pivot Extraction · Multi-Dimensional Factor Resonance

---

## I. Project Background and Theoretical Foundation

Chan Theory is a technical analysis framework grounded in morphology and dynamics. Manual drawing of Bi and identification of pivots are highly susceptible to subjective bias. This project subjects the core concepts of Chan Theory to rigorous **standardized mathematical resolution**, translating them into fully objective quantitative code.

```mermaid
graph TD
    K[Inclusion-Relationship K-Line Processing] --> FX[Top and Bottom Fractal Identification]
    FX --> Bi[Standardized Bi Engine]
    Bi --> Seg[Segment Engine]
    Seg --> Pivot[Trend Pivot Extraction (Chan Pivot)]
    Pivot --> Signal[Automated 1B/2B/3B Buy/Sell Point Discrimination]
```

---

## II. Core Resolution Modules

### 1. K-Line Inclusion-Relationship Processing (Inclusion Processing)
Continuous K-lines are merged strictly according to the high-high-low-low (upward element) and low-high-low-low (downward element) principle, eliminating noise interference.

### 2. Standardized Bi and Segment Resolution (Bi & Segment Engine)
- **Top/Bottom Fractals**: Among 5 adjacent K-lines that have undergone inclusion processing, the middle one is the highest (lowest) with the two sides decreasing (increasing) sequentially.
- **Bi Validity Conditions**: At least 1 independent K-line must separate the top and bottom fractals (classic definition), or the overlapping-interval constraint must be satisfied.

### 3. Trend Pivot Extraction (Chan Pivot Engine)
Automatically resolve the overlapping portion of three consecutive Bi over the price range ($[Z_g, Z_d]$):
$$ \text{Pivot Range} = [\max(D_1, D_2, D_3), \min(G_1, G_2, G_3)] $$

---

## III. Engineering Results

1. **Objective and Unbiased**: Transforms the originally ambiguous technical analysis theory into 100% repeatably verifiable pure Python code.
2. **Multi-Dimensional Factor Integration**: Combines Chan Theory pivots with moving-average deviation and MACD momentum divergence to achieve an exceptionally high quantitative win rate.

*(Note: This model algorithm document has been sanitized.)*
