"""
Battlefield PoC: Flexible Batch Dynamic Quotation Algorithm
Discrete hardware/garment small-batch flexible scheduling & intelligent quotation (4-hour rapid closed loop).
Usage: python demo_run.py
"""
import time

def calculate_flex_quote(batch_size, base_smv, material_cost_per_unit, setup_hours=1.5):
    """
    Flexible pricing model based on Standard Minute Value (SMV).
    batch_size: Batch quantity in units
    base_smv: Standard Minute Value per piece
    material_cost_per_unit: Raw material cost per unit
    setup_hours: Line changeover and machine calibration time (Setup Overhead)
    """
    hourly_rate = 65.0  # Comprehensive workshop hourly labor rate ($/hour)
    
    # Amortize setup cost over batch size
    setup_cost_total = setup_hours * hourly_rate
    setup_cost_per_unit = setup_cost_total / batch_size
    
    # Pure manufacturing labor cost
    labor_cost_per_unit = (base_smv / 60.0) * hourly_rate
    
    # Total factory cost & tiered margin (small-batch premium)
    factory_cost = material_cost_per_unit + labor_cost_per_unit + setup_cost_per_unit
    margin = 0.35 if batch_size < 50 else (0.25 if batch_size < 500 else 0.18)
    
    final_unit_price = factory_cost * (1.0 + margin)
    return round(final_unit_price, 2), round(setup_cost_per_unit, 2), round(labor_cost_per_unit, 2)

def main():
    print("=" * 70)
    print("🧪 [Battlefield Agile PoC] Discrete Manufacturing Small-Batch Flexible Pricing Engine")
    print("💡 Hypothesis: Can an algorithm solve small-batch changeover overhead in 4 hours?")
    print("=" * 70)
    time.sleep(0.4)

    test_batches = [10, 50, 200, 1000]
    smv = 4.2  # 4.2 minutes standard time per piece
    mat_cost = 15.0  # Base material cost: $15.00

    print(f"📋 Baseline: SMV = {smv} mins | Material Cost = ${mat_cost:.2f} | Setup = 1.5 hours\n")

    for qty in test_batches:
        price, setup_share, labor_share = calculate_flex_quote(qty, smv, mat_cost)
        print(f"📦 Batch Size: {qty:4d} units ➔ Recommended Unit Price: ${price:6.2f} (Setup Amortization: ${setup_share:5.2f} | Labor: ${labor_share:4.2f})")

    print("\n" + "=" * 70)
    print("🎉 PoC Verified: Dynamically reflects small-batch changeover premiums, protecting factory gross margins!")
    print("=" * 70)

if __name__ == "__main__":
    main()
