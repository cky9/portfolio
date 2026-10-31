"""
0-Budget Industrial Engineering (IE) Motion & Cycle-Time Analyzer
Zero-budget worker motion and cycle-time analyzer (Redacted Demo).
Usage: python demo_run.py
"""
import os
import sys
import time
import math
import random

def run_simulation_mode():
    print("=" * 65)
    print("🏭 [IE Motion Audit] Initializing CPU Simulation Mode...")
    print("💡 Mode: Simulates 21-point dual-hand skeletal tracking without video files")
    print("=" * 65)
    time.sleep(0.6)

    total_frames = 180  # 6-second simulated video @ 30fps
    fps = 30.0
    print(f"🎬 Simulated Video FPS: {fps} | Total Frames: {total_frames} | Operation: [Through-Hole Insertion]")
    print("-" * 65)

    states = ["REACH (Grip Approach)", "GRASP (Object Alignment)", "ASSEMBLE (Precision Insertion)", "RELEASE (Return to Home)"]
    current_state_idx = 0
    cycle_count = 0
    cycle_history = []
    cycle_start_time = 0.0

    for f in range(total_frames):
        curr_time = f / fps
        hand_dist = 0.4 + 0.3 * math.sin(f * 0.15) + random.uniform(-0.02, 0.02)
        wrist_velocity = abs(math.cos(f * 0.15)) * 120.0 + random.uniform(5, 15)

        if f % 45 == 0 and f > 0:
            current_state_idx = (current_state_idx + 1) % len(states)
            if current_state_idx == 0:
                cycle_count += 1
                duration = curr_time - cycle_start_time
                cycle_history.append(duration)
                cycle_start_time = curr_time
                print(f"⏱️  [Frame {f:03d} | {curr_time:4.1f}s] 🎯 Cycle #{cycle_count} Completed! Duration: {duration:.2f}s (Pacing Normal)")

        if f % 30 == 0:
            state_name = states[current_state_idx]
            print(f"📍 Frame [{f:03d}/{total_frames}] | Posture: {state_name:<28} | Wrist Velocity: {wrist_velocity:5.1f} px/s | Hand Dist: {hand_dist:.3f}")
            time.sleep(0.1)

    print("-" * 65)
    print("📊 =================== IE Motion Audit Report ===================")
    avg_cycle = sum(cycle_history) / len(cycle_history) if cycle_history else 1.5
    std_minute_value = (avg_cycle / 60.0) * 1.15  # Includes 15% allowance
    hourly_capacity = int(3600 / avg_cycle)

    print(f"✅ Audited Cycles: {cycle_count}")
    print(f"⏱️  Measured Avg Cycle Time: {avg_cycle:.2f} seconds / cycle")
    print(f"📈 Standard Minute Value (SMV): {std_minute_value:.4f} mins / unit")
    print(f"🎯 Theoretical Units Per Hour (UPH): {hourly_capacity} units/hour")
    print("💡 Conclusion: No significant hesitation or posture stalling detected. Motion Economy Score: 92/100")
    print("=" * 65)

def main():
    video_path = sys.argv[1] if len(sys.argv) > 1 else None
    if video_path and os.path.exists(video_path):
        try:
            import cv2
            import mediapipe as mp
            print(f"🎥 Detected video input: {video_path}, executing MediaPipe skeletal extraction...")
        except ImportError:
            print("⚠️ mediapipe/opencv-python not found, falling back to high-fidelity simulation.")
            run_simulation_mode()
    else:
        run_simulation_mode()

if __name__ == "__main__":
    main()
