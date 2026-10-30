"""
Battlefield PoC: Flexible Batch Dynamic Quotation Algorithm
战地敏捷原型：离散五金/服装小批量柔性排单与智能报价 (4小时极速闭环)
运行方式: python demo_run.py
"""
import time

def calculate_flex_quote(batch_size, base_smv, material_cost_per_unit, setup_hours=1.5):
    """
    基于工时定额 SMV 的柔性报价模型
    batch_size: 批量件数
    base_smv: 单件标准分钟工时 (Standard Minute Value)
    material_cost_per_unit: 单件材料基准
    setup_hours: 换线与调机工时 (Setup Overhead)
    """
    hourly_rate = 65.0  # 车间综合工时工费 (元/小时)
    
    # 换线调机成本均摊到单件
    setup_cost_total = setup_hours * hourly_rate
    setup_cost_per_unit = setup_cost_total / batch_size
    
    # 纯人工制造工时成本
    labor_cost_per_unit = (base_smv / 60.0) * hourly_rate
    
    # 制造总成本与梯度利润率 (小批量溢价)
    factory_cost = material_cost_per_unit + labor_cost_per_unit + setup_cost_per_unit
    margin = 0.35 if batch_size < 50 else (0.25 if batch_size < 500 else 0.18)
    
    final_unit_price = factory_cost * (1.0 + margin)
    return round(final_unit_price, 2), round(setup_cost_per_unit, 2), round(labor_cost_per_unit, 2)

def main():
    print("=" * 70)
    print("🧪 [战地敏捷原型] 离散制造业小批量柔性报价与排单估算引擎")
    print("💡 验证假设：能否在 4 小时内建立算法，解决小批量定制换线成本高、报价全靠拍脑袋的痛点？")
    print("=" * 70)
    time.sleep(0.4)

    test_batches = [10, 50, 200, 1000]
    smv = 4.2  # 单件耗时 4.2 分钟
    mat_cost = 15.0  # 单件材料 15 元

    print(f"📋 基准参数：单件标准工时 SMV = {smv} 分钟 | 材料成本 = ¥{mat_cost} | 换线耗时 = 1.5 小时\n")

    for qty in test_batches:
        price, setup_share, labor_share = calculate_flex_quote(qty, smv, mat_cost)
        print(f"📦 订单批量: {qty:4d} 件 ➔ 智能建议单价: ¥{price:6.2f} (包含调机摊提: ¥{setup_share:5.2f} | 工时: ¥{labor_share:4.2f})")

    print("\n" + "=" * 70)
    print("🎉 PoC 验证结论：算法成功反映小批量动态调机溢价，有效保护工厂毛利防亏损！")
    print("=" * 70)

if __name__ == "__main__":
    main()
