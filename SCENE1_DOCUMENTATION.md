# Scene 1: The Watcher's Entrance - Complete Documentation

## Overview

Scene 1 creates a sense of eavesdropping, control, and potential unease by presenting the user as a watcher viewing surveillance camera feeds. The scene establishes the voyeuristic perspective that will be subverted in later scenes.

## Narrative Intent

- **Perspective**: User enters as a "watcher" observing surveillance feeds
- **Mood**: Mysterious, controlling, slightly unsettling
- **Purpose**: Establish the surveillance aesthetic and create a sense of power/control
- **Foreshadowing**: Sets up the reversal that occurs in later scenes

## Technical Implementation

### 1. Loading Screen Sequence

**File**: `index.html` (lines 12-15), `css/style.css` (lines 15-52), `js/scene1.js` (lines 73-99)

#### Features:
- Black background on page load
- Typewriter effect using Typed.js library
- Electric sound effect on each line completion
- Automatic progression to feed display

#### Text Sequence:
1. "INITIALIZING SURVEILLANCE SYSTEM..."
2. "ESTABLISHING SECURE CONNECTION..."
3. "LOADING CAMERA FEEDS..."
4. "CONNECTION ESTABLISHED."
5. "SYSTEM ONLINE."

#### Implementation Details:
```javascript
// Typed.js configuration in scene1.js:73-99
- typeSpeed: 40 (characters per millisecond)
- Electric sound plays via AudioContext on each line completion
- 1-second delay after completion before transitioning
```

### 2. Feed Window Grid

**File**: `index.html` (lines 26-105), `css/style.css` (lines 101-142)

#### Layout:
- **Grid**: 3 columns × 2 rows
- **Gap**: 15px between windows
- **Total Feeds**: 6 surveillance cameras

#### Camera Labels:
1. CAM-01 // HALLWAY
2. CAM-02 // ENTRANCE
3. CAM-03 // OFFICE
4. CAM-04 // STAIRWELL
5. CAM-05 // PARKING
6. CAM-06 // LOBBY

#### Sequential Reveal:
- Windows light up one after another with 400ms delay between each
- Each reveal accompanied by electric sound effect
- Fade-in and scale animation (0.95 → 1.0)
- Videos auto-play when revealed

### 3. Visual Effects

#### Hover Effects:
**File**: `css/style.css` (lines 135-142)

- **Border**: Changes from green (#00ff00) to red (#ff0000)
- **Glow**: Red shadow (0 0 20px rgba(255, 0, 0, 0.6))
- **Brightness**: Video brightness increases to 1.3
- **Effect**: Simulates automatic camera exposure adjustment

#### Static Overlay:
**File**: `css/style.css` (lines 205-237)

- Scanline effect with green tint
- Animated noise overlay
- Creates authentic surveillance camera aesthetic

#### Video Styling:
**File**: `css/style.css` (lines 160-169)

- Slight grayscale filter (20%)
- Reduced brightness (0.9)
- Smooth transitions on hover

### 4. Click Interaction - Fullscreen Mode

**File**: `index.html` (lines 128-139), `js/scene1.js` (lines 175-210)

#### Activation:
- Click any feed window to enter fullscreen mode
- Calls `scene1.playFeed(feedId)` function

#### HUD Display:
**File**: `css/style.css` (lines 547-641)

Components:
1. **REC Indicator** (top-left)
   - Pulsing red dot
   - "REC" text in red
   - Animation: 1.5s pulse cycle

2. **Timestamp** (top-center)
   - Format: MM/DD/YYYY HH:MM:SS
   - Updates every second
   - Green monospace font

3. **Close Button** (top-right)
   - Circle with "✕" symbol
   - Hover effect: red background
   - Click or ESC key to close

#### Fullscreen Video:
- Contains to viewport (object-fit: contain)
- Black background
- Seamless loop playback
- Inherits video source from clicked feed

### 5. Audio Effects

**File**: `js/scene1.js` (lines 28-59)

#### Electric Sound:
- **Technology**: Web Audio API (AudioContext)
- **Type**: Sawtooth wave oscillator
- **Frequency**: 100-300 Hz (randomized)
- **Duration**: 50ms
- **Volume**: 0.1 (10%)

#### Trigger Points:
1. Each line completion in loading sequence
2. Each feed window reveal
3. Entering fullscreen mode
4. Exiting fullscreen mode

### 6. JavaScript Architecture

**File**: `js/scene1.js`

#### Module Structure:
```javascript
const scene1 = {
    audioContext: null,           // Web Audio API context
    currentFullscreenFeed: null,  // Active feed in fullscreen
    timestampInterval: null,      // Interval for timestamp updates

    // Methods:
    init()                        // Initialize Scene 1
    initAudio()                   // Setup Web Audio API
    playElectricSound()           // Generate electric sound
    startLoadingSequence()        // Begin typewriter effect
    endLoadingSequence()          // Transition to feeds
    revealFeedWindows()           // Sequential feed reveal
    playFeed(feedId)              // Enter fullscreen mode
    closeFullscreen()             // Exit fullscreen mode
    startTimestampUpdate()        // Begin timestamp updates
    stopTimestampUpdate()         // Stop timestamp updates
    updateTimestamp()             // Update HUD timestamp
    updateFeedTimestamps()        // Update all feed timestamps
}
```

#### Event Listeners:
- `DOMContentLoaded` → Initialize scene1
- Click on feed window → Enter fullscreen
- ESC key → Exit fullscreen
- Interval timer → Update timestamps

### 7. Video Management

**File**: `videos/` directory

#### Required Files:
- feed1.webm / feed1.mp4 (Hallway)
- feed2.webm / feed2.mp4 (Entrance)
- feed3.webm / feed3.mp4 (Office)
- feed4.webm / feed4.mp4 (Stairwell)
- feed5.webm / feed5.mp4 (Parking)
- feed6.webm / feed6.mp4 (Lobby)

#### Format Support:
- Primary: WebM (generated by included tool)
- Fallback: MP4
- Browser automatically selects supported format

#### Video Generator Tool:
**File**: `generate-placeholder-videos.html`

- Browser-based video generator
- Creates 5-second surveillance-style animations
- Uses HTML5 Canvas + MediaRecorder API
- Generates WebM format with surveillance effects:
  - Grayscale aesthetic
  - Static/noise overlay
  - Scanlines
  - Scene-specific animations
  - Camera labels and timestamps

## File Structure

```
/ixp3-week7/
├── index.html                          # Main HTML (Scene 1 structure)
├── css/
│   └── style.css                       # Scene 1 styles (lines 15-641)
├── js/
│   ├── scene1.js                       # Scene 1 logic (NEW)
│   └── main.js                         # Main app logic (existing)
├── videos/
│   ├── README.md                       # Video requirements guide
│   ├── feed1.webm / feed1.mp4
│   ├── feed2.webm / feed2.mp4
│   ├── feed3.webm / feed3.mp4
│   ├── feed4.webm / feed4.mp4
│   ├── feed5.webm / feed5.mp4
│   └── feed6.webm / feed6.mp4
├── generate-placeholder-videos.html   # Video generator tool
└── SCENE1_DOCUMENTATION.md            # This file
```

## Key CSS Classes

| Class | Purpose | File Location |
|-------|---------|---------------|
| `.loading-screen` | Initial black screen with typewriter | style.css:15-28 |
| `.feed-window` | Individual camera feed container | style.css:118-127 |
| `.feed-window.active` | Revealed feed window | style.css:129-132 |
| `.feed-video` | Video element styling | style.css:161-169 |
| `#fullscreen-feed` | Fullscreen overlay container | style.css:548-558 |
| `.hud-rec` | REC indicator component | style.css:577-581 |
| `.rec-dot` | Pulsing red dot | style.css:583-600 |

## User Flow

1. **Page Load** → Black screen appears
2. **0.5s delay** → Typewriter text begins
3. **~10s** → Loading messages complete
4. **~11s** → Loading screen fades out
5. **~12s** → Feed windows begin revealing (one every 400ms)
6. **~14.5s** → All 6 feeds visible and playing
7. **User hovers** → Feed border glows red, brightness increases
8. **User clicks feed** → Enters fullscreen with HUD
9. **User clicks close/ESC** → Returns to grid view

## Performance Considerations

- **Videos**: Compressed, looping, muted for autoplay
- **Audio**: Lightweight Web Audio API (no audio files needed)
- **Animations**: CSS-based for GPU acceleration
- **Grid**: CSS Grid for efficient layout
- **Loading**: Lazy initialization of audio context

## Browser Compatibility

- **Typed.js**: All modern browsers
- **Web Audio API**: Chrome, Firefox, Safari, Edge
- **CSS Grid**: All modern browsers
- **Video formats**: WebM (Chrome, Firefox) / MP4 (Safari, Edge fallback)
- **MediaRecorder** (for video generator): Chrome, Firefox, Edge

## Accessibility Considerations

- Videos are muted by default (required for autoplay)
- ESC key provides alternative to close button
- High contrast green/red color scheme
- Monospace font for readability
- No essential information in audio (electric sounds are decorative)

## Future Enhancements (Optional)

1. Add video error handling and fallback images
2. Implement preloading indicator for videos
3. Add volume control for electric sounds
4. Mobile responsiveness improvements
5. Add keyboard navigation between feeds
6. Implement actual surveillance footage integration
7. Add ability to pause/resume videos

## Testing Checklist

- [ ] Loading screen appears on page load
- [ ] Typewriter text displays all 5 messages
- [ ] Electric sounds play during loading (with user interaction)
- [ ] Feed windows reveal sequentially
- [ ] All 6 videos start playing
- [ ] Hover effects work (red glow, brightness)
- [ ] Click opens fullscreen mode
- [ ] HUD displays correctly (REC, timestamp, close button)
- [ ] Timestamp updates every second
- [ ] Close button exits fullscreen
- [ ] ESC key exits fullscreen
- [ ] Returns to grid view properly
- [ ] All timestamps display correctly

## Troubleshooting

### Videos don't play
- **Cause**: Missing video files or autoplay restrictions
- **Solution**: Generate videos using `generate-placeholder-videos.html` or add user interaction to enable autoplay

### No sound effects
- **Cause**: Web Audio API requires user interaction
- **Solution**: Audio context activates after user clicks (this is browser security, working as intended)

### Loading screen doesn't fade
- **Cause**: JavaScript not loading
- **Solution**: Check browser console for errors, ensure scene1.js loads before main.js

### Fullscreen doesn't work
- **Cause**: Video source not found
- **Solution**: Ensure videos are in /videos/ directory with correct names

## API Reference

### `scene1.playFeed(feedId)`
Opens a feed in fullscreen mode.

**Parameters:**
- `feedId` (string|number): ID of the feed to play (1-6)

**Example:**
```javascript
scene1.playFeed(3); // Opens CAM-03 in fullscreen
```

### `scene1.closeFullscreen()`
Closes fullscreen mode and returns to grid view.

**Example:**
```javascript
scene1.closeFullscreen(); // Returns to grid
```

### `scene1.playElectricSound()`
Plays a brief electric/glitch sound effect.

**Example:**
```javascript
scene1.playElectricSound(); // Plays 50ms electric sound
```

## Credits

- **Typed.js**: Matt Boldt (https://github.com/mattboldt/typed.js/)
- **Web Audio API**: W3C Standard
- **Design**: Surveillance/cyberpunk aesthetic
- **Narrative**: WINDOW interactive experience
