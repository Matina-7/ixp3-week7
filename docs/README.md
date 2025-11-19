# Through the Window
## Interactive Narrative Horror Experience

An immersive horror narrative that uses eye-tracking technology to create a reactive storytelling experience. Your gaze controls what you see, what happens, and how the story unfolds.

## Project Overview

"Through the Window" is an experimental interactive narrative that leverages WebGazer.js for real-time eye tracking, creating a unique horror experience where the user's attention directly influences the narrative and visual elements.

## Features

- **Eye Tracking Integration**: Real-time gaze tracking using WebGazer.js
- **Reactive Narrative**: Story elements respond to where you look
- **Multiple Scenes**: Progressive horror experience across three distinct scenes
- **Ambient Audio**: Atmospheric sound design
- **Visual Feedback**: Gaze indicators and responsive UI elements

## Project Structure

```
/docs
├── _config.yml                 # Jekyll configuration
├── index.html                  # Main entry point
├── assets/
│   ├── css/
│   │   ├── style.css          # Main styles
│   │   └── style.scss         # SCSS source
│   ├── js/
│   │   ├── main.js            # Application entry point
│   │   └── webgazer.min.js    # Eye tracking library (add this)
│   ├── sounds/
│   │   └── ambient.mp3        # Background audio (add this)
│   └── videos/
│       ├── feed1.mp4          # Security feed videos (add these)
│       └── feed2.mp4
├── scripts/
│   ├── scene1.js              # Scene 1: The Watcher's Entrance
│   ├── scene2.js              # Scene 2: The Observation
│   ├── scene3.js              # Scene 3: The Revelation
│   ├── eyeTracker.js          # Eye tracking module
│   └── utils.js               # Utility functions
└── images/
    └── (icons, loading.gif, etc.)
```

## Setup Instructions

### 1. Install WebGazer.js

See `assets/js/WEBGAZER_README.md` for instructions on obtaining the WebGazer library.

### 2. Add Media Assets

- Place ambient audio in `assets/sounds/ambient.mp3`
- Add security feed videos in `assets/videos/`
- Add loading gif and icons in `images/`

### 3. Run Locally

#### Option A: Using Jekyll
```bash
cd docs
bundle install
bundle exec jekyll serve
```

#### Option B: Simple HTTP Server
```bash
cd docs
python -m http.server 8000
# or
npx http-server
```

#### Option C: GitHub Pages
Push to GitHub and enable GitHub Pages in repository settings.

### 4. Camera Permissions

The experience requires camera access for eye tracking. Users will be prompted to allow camera access when the page loads.

## Scene Descriptions

### Scene 1: The Watcher's Entrance
The user encounters a mysterious figure. Looking at it for 3 seconds triggers progression to the next scene.

### Scene 2: The Observation
Split-screen view where the user's gaze determines what is shown. Observing different areas reveals different aspects of the narrative.

### Scene 3: The Revelation
The climactic scene where the entity becomes aware of being watched. Its eyes follow the user's gaze.

## Technical Requirements

- Modern web browser (Chrome, Firefox, Edge)
- Webcam
- HTTPS connection (required for camera access)

## Browser Compatibility

- ✅ Chrome/Chromium (Recommended)
- ✅ Firefox
- ✅ Edge
- ⚠️ Safari (limited WebRTC support)

## Development

### File Organization

- **index.html**: Main HTML structure and loading sequence
- **main.js**: Application orchestration and scene management
- **eyeTracker.js**: WebGazer integration and gaze tracking
- **scene[1-3].js**: Individual scene logic
- **utils.js**: Helper functions used across modules
- **style.css/scss**: Visual styling

### Adding New Scenes

1. Create a new scene file in `scripts/` (e.g., `scene4.js`)
2. Follow the pattern in existing scene files
3. Add scene HTML structure to `index.html`
4. Scene will auto-load when previous scene completes

## Troubleshooting

### Eye Tracking Not Working
- Ensure WebGazer.js is loaded (check browser console)
- Grant camera permissions
- Ensure good lighting conditions
- Complete calibration process

### Videos Not Playing
- Check video file formats (MP4/H.264)
- Verify file paths in HTML
- Check browser console for errors

### Audio Not Playing
- User interaction may be required before audio plays
- Check volume settings
- Verify file format compatibility

## Privacy & Ethics

This project uses webcam access for eye tracking. All processing happens locally in the browser. No video data is transmitted or stored. Users must explicitly grant camera permissions.

## License

This project is part of an educational/experimental creative coding project.

## Credits

- **WebGazer.js**: Eye tracking library by Brown University HCI Group
- **Project**: Created for interactive narrative experimentation

## Future Enhancements

- [ ] Additional scenes and narrative branches
- [ ] Persistent choices affecting story outcome
- [ ] Improved calibration process
- [ ] Mobile device support (if feasible)
- [ ] Analytics for gaze patterns (optional, privacy-conscious)
- [ ] Multiple endings based on gaze behavior

---

**Note**: This is a horror experience. It may contain suspenseful imagery and sounds. Not recommended for those sensitive to horror content.
