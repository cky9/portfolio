> **[ 🌐 English Version | 🇨🇳 [中文文档 (Chinese Version)](./README_ZH.md) ]**

# 🎥 Zero-Budget Worker Time & Motion Takt Analysis Tool (IE Motion Study)

> **Business value**: Traditional time standards and IE motion analysis in physical manufacturing require purchasing expensive motion-capture equipment or spending massive manual effort with stopwatches. This project needs only a $15 phone stand to record video, runs a vision-based skeletal tracking algorithm on pure CPU, and automatically extracts worker assembly takt and calculates standard time (SMV).

## 🚀 Quick Out-of-the-Box Trial Run (Zero Dependency Demo)
No tedious configuration required—built-in simulated data, runs directly on a single machine:
```bash
python demo_run.py
```

## 🛠️ Production-Grade Capabilities
- **Dual-mode adaptive**:
  - If `mediapipe` and `opencv-python` are installed, pass in a local recording to perform real-device 21-keypoint trajectory extraction and rendering;
  - In lightweight test environments, it automatically runs high-precision simulated inference with extremely low system overhead.
- **Core algorithms**: Two-hand skeletal Euclidean distance fluctuation solving, speed-extremum motion-element segmentation, IE allowance-rate standard time (SMV) conversion.
