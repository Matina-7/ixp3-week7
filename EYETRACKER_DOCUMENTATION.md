# Eye Tracker Module Documentation

## Overview

The Eye Tracker module (`eyeTracker.js`) provides real-time gaze tracking capabilities for the Window interactive narrative project using WebGazer.js. It enables gaze-based interactions such as detecting when users look at specific areas of the screen for extended periods.

## Features

✅ **Real-time eye movement tracking** using WebGazer.js
✅ **Stable gaze coordinates** with noise filtering (sliding window averaging)
✅ **Visual gaze indicator** that follows the user's eyes
✅ **Duration-based detection** - trigger events when gazing at areas for specified time
✅ **Face detection warnings** - alerts when user's face is not detected
✅ **Calibration system** - built-in 9-point calibration for accuracy
✅ **Console logging** - real-time gaze coordinates output

## Installation

The module is already integrated into the project. The following files have been updated:

- `/scripts/eyeTracker.js` - Main eye tracker module
- `/js/main.js` - Integration code
- `/index.html` - WebGazer.js library included
- `/css/style.css` - Eye tracker styles

## Quick Start

The eye tracker is automatically initialized when the page loads. You don't need to do anything to start tracking!

```javascript
// Eye tracker starts automatically on page load
// Look for this console message:
// [EyeTracker] Initialized and running...
// [Main] Eye Tracker ready
```

## Usage Examples

### Basic Usage (Already Implemented)

The first feed window is already being watched. When you gaze at it for 6 seconds:
- A narrative message appears: "It's watching you back."
- The feed window glows red
- An alert pops up

### Adding More Watch Areas

```javascript
import { watchArea } from '../scripts/eyeTracker.js';

// Watch the second feed window for 5 seconds
const feed2 = document.querySelector('#feed2');
watchArea('feed2', feed2, 5000, (areaId, duration) => {
    console.log(`User looked at ${areaId} for ${duration}ms`);
    alert('You found something!');
});

// Watch a custom element for 3 seconds
const customElement = document.querySelector('.custom-area');
watchArea('custom-area', customElement, 3000, () => {
    // Trigger custom behavior
    showSecretMessage();
});
```

### Using the Calibration Tool

For better accuracy, calibrate the eye tracker:

```javascript
// Open browser console and run:
window.eyeTracker.calibrate();
```

This will:
1. Display a calibration overlay with 9 points
2. Prompt you to click each point while looking at it
3. Improve tracking accuracy based on your eye position

### Stopping the Eye Tracker

```javascript
// From console:
window.eyeTracker.stop();
```

## API Reference

### Core Functions

#### `initEyeTracker(options)`

Initialize and start the eye tracker.

**Parameters:**
- `options.showVideoPreview` (boolean) - Show webcam preview (default: false)
- `options.smoothing` (boolean) - Enable smoothing (default: true)
- `options.calibrationPoints` (number) - Number of calibration points (default: 9)

**Returns:** Promise<boolean>

**Example:**
```javascript
await initEyeTracker({
    showVideoPreview: true,  // Show camera feed in corner
    smoothing: true
});
```

#### `watchArea(areaId, element, duration, callback)`

Watch a specific DOM element for gaze duration.

**Parameters:**
- `areaId` (string) - Unique identifier for the area
- `element` (HTMLElement) - DOM element to watch
- `duration` (number) - Time in milliseconds to trigger (default: 6000)
- `callback` (function) - Function to call when duration is met

**Returns:** Object with `stop()` method

**Example:**
```javascript
const watcher = watchArea('myArea', element, 4000, (id, duration) => {
    console.log(`Gazed at ${id} for ${duration}ms`);
});

// Stop watching this area
watcher.stop();
```

#### `stopEyeTracker()`

Stop the eye tracker completely.

**Example:**
```javascript
stopEyeTracker();
```

#### `startCalibration()`

Display calibration interface for improved accuracy.

**Example:**
```javascript
startCalibration();
```

### Utility Functions

#### `pauseEyeTracker()`

Pause tracking without stopping WebGazer.

#### `resumeEyeTracker()`

Resume tracking after pause.

#### `isTrackingActive()`

Check if tracking is currently active.

**Returns:** boolean

#### `getCurrentGaze()`

Get the current gaze position.

**Returns:** Object `{x, y, stable}` or null

## Configuration

### Constants (Exported)

```javascript
import {
    BUFFER_SIZE,         // 10 - Number of samples for averaging
    STABILITY_THRESHOLD, // 50 - Pixel variation for stability
    POLL_INTERVAL        // 100 - Milliseconds between checks
} from '../scripts/eyeTracker.js';
```

### Customizing Behavior

You can modify these values in `eyeTracker.js`:

```javascript
const BUFFER_SIZE = 10;          // More samples = smoother but slower
const STABILITY_THRESHOLD = 50;   // Lower = stricter stability requirement
const POLL_INTERVAL = 100;        // Lower = more frequent updates
```

## Console Output

### Expected Messages

**Successful Initialization:**
```
[EyeTracker] Initializing...
[EyeTracker] Initialized and running...
[Main] Eye Tracker ready
```

**Gaze Tracking:**
```
gaze: (430, 280)
gaze: (435, 282)
gaze: (438, 281)
```

**Area Detection:**
```
[EyeTracker] Watching area #feed1 (trigger after 6000ms)
[EyeTracker] Started gazing at area #feed1
[EyeTracker] User fixated on area #feed1 for 6024ms
```

**Face Detection Lost:**
```
[EyeTracker] No face detected
```

**Calibration:**
```
[EyeTracker] Starting calibration...
[EyeTracker] Look at each point and click when ready
[EyeTracker] Calibration complete!
```

## Visual Elements

### Gaze Indicator

A red circular indicator follows your gaze:
- **Red circle** with inner dot
- **Position** follows your eyes in real-time
- **Smooth transitions** for better UX
- **Pulsing animation** for visibility

### Webcam Preview (Optional)

When enabled (`showVideoPreview: true`):
- **Location:** Bottom-right corner
- **Size:** 200x150px
- **Style:** Red border with glow effect
- **Opacity:** 70% (100% on hover)

### Calibration Overlay

9-point calibration grid:
- **Dark overlay** with green text
- **Interactive points** that change color when clicked
- **Progress tracking** - only active points are bright

## Troubleshooting

### Camera Permission Denied

**Problem:** Eye tracker can't access camera
**Solution:** Allow camera access when prompted by browser

### No Face Detected

**Problem:** Tracking stops working
**Solutions:**
- Ensure good lighting
- Face the camera directly
- Remove glasses if causing issues
- Recalibrate using `window.eyeTracker.calibrate()`

### Inaccurate Tracking

**Problem:** Gaze indicator doesn't match where you're looking
**Solutions:**
- Run calibration: `window.eyeTracker.calibrate()`
- Ensure camera has clear view of your face
- Adjust screen angle and distance

### Eye Tracker Not Starting

**Problem:** Console shows initialization errors
**Solutions:**
- Check that WebGazer.js is loaded
- Verify browser supports getUserMedia
- Check console for specific errors

## Browser Compatibility

### Supported Browsers

✅ Chrome/Edge (Recommended)
✅ Firefox
✅ Safari (macOS/iOS)
✅ Opera

### Requirements

- **Camera access** - Required for eye tracking
- **HTTPS or localhost** - Required for camera permissions
- **Modern browser** - ES6 module support

## Performance Tips

1. **Reduce poll interval** only if needed - higher values save CPU
2. **Hide video preview** in production for better performance
3. **Limit watched areas** - tracking many areas can impact performance
4. **Close other camera apps** - only one app can use camera at a time

## Privacy & Security

- **Local processing** - All eye tracking happens in the browser
- **No data transmission** - Gaze data never leaves your device
- **User consent** - Camera permission required
- **Data storage** - WebGazer saves calibration data locally for accuracy

## Integration with Narrative Scenes

### Example: Scene 2 - "Being Watched Back"

```javascript
// When user gazes at specific feed for too long
watchArea('suspiciousFeed', feedElement, 8000, () => {
    // Feed becomes self-aware
    feedElement.classList.add('sentient');
    showNarrative("Did you feel that? It knows you're watching.");

    // Reverse the surveillance
    setTimeout(() => {
        activateReverseMode();
    }, 2000);
});
```

### Example: Scene 3 - "Hidden Clues"

```javascript
// Hide secret messages that only appear when gazed at
const secretAreas = document.querySelectorAll('.secret');

secretAreas.forEach((area, index) => {
    watchArea(`secret-${index}`, area, 3000, () => {
        area.classList.add('revealed');
        collectClue(index);
    });
});
```

## Testing Checklist

- [ ] Camera permission granted
- [ ] Gaze indicator appears and follows eyes
- [ ] Console shows gaze coordinates `gaze: (x, y)`
- [ ] Gazing at feed1 for 6 seconds triggers alert
- [ ] "It's watching you back" message appears
- [ ] Feed1 border turns red and glows
- [ ] Calibration works when called
- [ ] Face detection warning appears when looking away

## Advanced Usage

### Custom Gaze Processing

```javascript
import { getCurrentGaze } from '../scripts/eyeTracker.js';

// Get current gaze every second
setInterval(() => {
    const gaze = getCurrentGaze();
    if (gaze && gaze.stable) {
        processGazeData(gaze.x, gaze.y);
    }
}, 1000);
```

### Dynamic Area Watching

```javascript
// Add areas dynamically
function addWatchableElement(element, message) {
    const id = `dynamic-${Date.now()}`;

    watchArea(id, element, 5000, () => {
        showMessage(message);
    });

    return id;
}
```

### Heatmap Generation

```javascript
let gazeHistory = [];

// Collect gaze data
setInterval(() => {
    const gaze = getCurrentGaze();
    if (gaze && gaze.stable) {
        gazeHistory.push({ x: gaze.x, y: gaze.y, time: Date.now() });
    }
}, 500);

// Generate heatmap from history
function generateHeatmap() {
    // Process gazeHistory to create visualization
    createHeatmapVisualization(gazeHistory);
}
```

## Console Commands Reference

Open browser console and try these commands:

```javascript
// Check if eye tracker is ready
window.eyeTracker.isReady()

// Start calibration
window.eyeTracker.calibrate()

// Stop eye tracking
window.eyeTracker.stop()

// Access internal functions (if needed)
import { getCurrentGaze } from '../scripts/eyeTracker.js'
getCurrentGaze()
```

## Future Enhancements

Potential features for future versions:
- Blink detection
- Attention span metrics
- Multi-user tracking
- Gaze heatmap visualization
- Pupil dilation tracking (if WebGazer adds support)
- Eye fatigue detection

## Credits

- **WebGazer.js** - https://webgazer.cs.brown.edu/
- **Project:** Window - Interactive Narrative
- **Module:** Eye Tracker v1.0
- **Developer:** Claude Code Assistant

## Support

For issues or questions:
1. Check console for error messages
2. Review this documentation
3. Verify browser compatibility
4. Test calibration
5. Check camera permissions

---

**Happy Eye Tracking! 👁️**
