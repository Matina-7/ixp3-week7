# Eye Tracker Quick Start Guide

## 🚀 Getting Started

The eye tracker is **already integrated** and will start automatically when you open the page!

## ✅ What's Already Working

1. **Auto-initialization** - Starts when page loads
2. **Real-time gaze tracking** - Red indicator follows your eyes
3. **Console output** - See gaze coordinates: `gaze: (x, y)`
4. **Test area configured** - First feed window (CAM-01) triggers after 6 seconds

## 🎯 Test the Eye Tracker

1. **Open the page** in a modern browser (Chrome recommended)
2. **Allow camera access** when prompted
3. **Look at the first camera feed** (top-left) for 6 seconds
4. **Watch for the trigger**: "It's watching you back."

## 🎮 Console Commands

Open browser console (F12) and try:

```javascript
// Check if ready
window.eyeTracker.isReady()

// Calibrate for better accuracy
window.eyeTracker.calibrate()

// Stop tracking
window.eyeTracker.stop()
```

## 📊 What You'll See

### In Console:
```
[EyeTracker] Initializing...
[EyeTracker] Initialized and running...
[Main] Eye Tracker ready
gaze: (430, 280)
gaze: (435, 282)
[EyeTracker] Started gazing at area #feed1
[EyeTracker] User fixated on area #feed1 for 6024ms
```

### On Screen:
- **Red circle indicator** following your gaze
- **Narrative message** when gazing at feed for 6 seconds
- **Red glow effect** on the watched feed
- **Alert popup** with message

## 🔧 Calibration (Recommended)

For best accuracy:

1. Open console (F12)
2. Type: `window.eyeTracker.calibrate()`
3. Click each red point while looking at it
4. Points turn green when clicked
5. Calibration complete!

## 🎨 Adding Custom Watch Areas

```javascript
import { watchArea } from '../scripts/eyeTracker.js';

// Watch any element
const myElement = document.querySelector('#myElement');
watchArea('myArea', myElement, 5000, () => {
    alert('You found it!');
});
```

## 📁 Files Modified

- ✅ `/scripts/eyeTracker.js` - Main module (NEW)
- ✅ `/js/main.js` - Integration code (UPDATED)
- ✅ `/index.html` - WebGazer.js library (UPDATED)
- ✅ `/css/style.css` - Styles (UPDATED)

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| No gaze indicator | Allow camera access |
| Inaccurate tracking | Run calibration |
| "No face detected" | Face the camera, improve lighting |
| Not working | Check browser console for errors |

## 📖 Full Documentation

See `EYETRACKER_DOCUMENTATION.md` for complete API reference and advanced usage.

## 🎬 Integration Example

```javascript
// In your scene file
const secretArea = document.querySelector('.secret-zone');

watchArea('secret', secretArea, 4000, (id, duration) => {
    // User gazed at secret area for 4 seconds
    revealSecret();
    showNarrative("You found the hidden message...");
});
```

## 🔥 Key Features

- ✅ Real-time tracking (100ms updates)
- ✅ Stability filtering (sliding window, 10 samples)
- ✅ Visual feedback (gaze indicator)
- ✅ Duration detection (customizable)
- ✅ Face detection alerts
- ✅ Calibration system
- ✅ Easy API

## 🚦 Status Indicators

| Message | Meaning |
|---------|---------|
| `[EyeTracker] Initialized and running...` | ✅ Ready to track |
| `gaze: (x, y)` | ✅ Tracking active |
| `[EyeTracker] No face detected` | ⚠️ Can't see your face |
| `User fixated on area...` | 🎯 Event triggered |

## 💡 Tips

1. **Good lighting** improves accuracy
2. **Calibrate** for better precision
3. **Stable position** reduces noise
4. **Face camera** directly
5. **Check console** for real-time feedback

---

**Ready to go! Start tracking! 👁️**
