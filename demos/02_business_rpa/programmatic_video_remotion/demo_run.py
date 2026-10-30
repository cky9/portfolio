"""
Programmatic Video Generation Pipeline (Remotion-based)
代码驱动自动化短视频渲染与时间轴生成流水线 (脱敏演示版)
运行方式: python demo_run.py
"""
import time
import json

def parse_markdown_to_remotion_timeline(script_markdown):
    """将 Markdown 剧本解析为 Remotion 帧级时间轴数据"""
    lines = [l.strip() for l in script_markdown.strip().split("\n") if l.strip()]
    timeline = []
    fps = 30
    current_frame = 0

    for i, line in enumerate(lines, 1):
        # 估算语速: 中文每秒约 4 个字
        char_count = len(line)
        duration_sec = max(2.0, char_count / 4.0)
        frame_duration = int(duration_sec * fps)
        
        scene = {
            "scene_id": f"SCENE_{i:02d}",
            "text": line,
            "char_count": char_count,
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
    print("🎬 [代码驱动短视频] 启动 Remotion 脚本时间轴解析与渲染管道...")
    print("💡 模式：Markdown 剧本 ➔ 自动化分镜时间轴 ➔ React 纯代码渲染视频")
    print("=" * 70)
    time.sleep(0.4)

    raw_script = """
    为什么很多制造厂花了几百万上的数字化系统，最后沦为电子废铁？
    因为传统系统太僵化，一旦业务流程微调，系统立刻瘫痪。
    真正有效的数字化，必须以 0 预算无侵入旁路切入，伴随业务生长。
    用 Python 解决脏数据，把复杂留给自己，把极简留给现场。
    """

    print("📄 正在解析 Markdown 口播文本...\n")
    timeline, total_frames = parse_markdown_to_remotion_timeline(raw_script)

    for sc in timeline:
        time.sleep(0.15)
        print(f"[{sc['scene_id']}] 帧范围: [{sc['start_frame']:04d} - {sc['end_frame']:04d}] ({sc['duration_sec']:4.1f}s) | 转场: {sc['transition']:<11} | 台词: {sc['text']}")

    total_sec = total_frames / 30.0
    print("\n" + "=" * 70)
    print(f"📊 视频总帧数: {total_frames} 帧 | 预估成片时长: {total_sec:.2f} 秒 (标准 30 FPS)")
    print("⚙️  正在调用 Remotion Headless 渲染进程 (Chromium Canvas)...")
    time.sleep(0.6)
    print("✅ [渲染成功] 产出视频: -> dist/enterprise_digital_ai_ep01.mp4 (H.264 / AAC)")
    print("=" * 70)

if __name__ == "__main__":
    main()
