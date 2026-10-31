"""
Programmatic Video Generation Pipeline (Remotion-based)
Code-driven automated video rendering and timeline assembly pipeline (Redacted Demo).
Usage: python demo_run.py
"""
import time
import json

def parse_markdown_to_remotion_timeline(script_markdown):
    """Parses markdown video script into frame-level Remotion timeline data."""
    lines = [l.strip() for l in script_markdown.strip().split("\n") if l.strip()]
    timeline = []
    fps = 30
    current_frame = 0

    for i, line in enumerate(lines, 1):
        # Speech pacing: approx 2.5 words per second
        word_count = len(line.split())
        duration_sec = max(2.5, word_count / 2.5)
        frame_duration = int(duration_sec * fps)
        
        scene = {
            "scene_id": f"SCENE_{i:02d}",
            "text": line,
            "word_count": word_count,
            "start_frame": current_frame,
            "end_frame": current_frame + frame_duration,
            "duration_sec": round(duration_sec, 2),
            "transition": "FADE_IN_OUT" if i > 1 else "NONE"
        }
        timeline.append(scene)
        current_frame += frame_duration
    
    return timeline, current_frame

def main():
    print("=" * 70)
    print("🎬 [Code-Driven Video] Launching Remotion script timeline parser and renderer...")
    print("💡 Mode: Markdown Script ➔ Automated Storyboard Timeline ➔ React Pure Code Rendering")
    print("=" * 70)
    time.sleep(0.4)

    raw_script = """
    Why do expensive multi-million dollar enterprise ERPs often turn into shelfware?
    Because monolithic software is too rigid; any workflow change breaks the system.
    True agility starts with zero-cost non-invasive bypasses that grow with business.
    Python handles dirty data locally, keeping complexity hidden and shop floors simple.
    """

    print("📄 Parsing Markdown script voiceover text...\n")
    timeline, total_frames = parse_markdown_to_remotion_timeline(raw_script)

    for sc in timeline:
        time.sleep(0.15)
        print(f"[{sc['scene_id']}] Frame Range: [{sc['start_frame']:04d} - {sc['end_frame']:04d}] ({sc['duration_sec']:4.1f}s) | Transition: {sc['transition']:<11} | Text: {sc['text']}")

    total_sec = total_frames / 30.0
    print("\n" + "=" * 70)
    print(f"📊 Video Total Frames: {total_frames} frames | Estimated Runtime: {total_sec:.2f}s (@ 30 FPS)")
    print("⚙️  Invoking Remotion Headless Renderer (Chromium Canvas)...")
    time.sleep(0.6)
    print("✅ [RENDER SUCCESS] Output Video: -> dist/enterprise_digital_ai_ep01.mp4 (H.264 / AAC)")
    print("=" * 70)

if __name__ == "__main__":
    main()
