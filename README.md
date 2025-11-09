# Window - Interactive Narrative Experience

An immersive browser-based narrative experience exploring themes of surveillance, observation, and privacy in the digital age.

## Concept

**Theme: "Peeping and Being Peeped At"**

Window is an interactive narrative that subverts the viewer's expectations. Users begin by observing what appears to be a standard surveillance monitoring system with multiple camera feeds. However, as the experience progresses, the system gradually reveals its true nature: the observer has become the observed.

The narrative culminates in a simulated system invasion and visual collapse, forcing users to confront questions about digital privacy, surveillance, and the illusion of control in our connected world.

## Narrative Flow

### Stage 1: The Observer (0-13s)
- User is presented with a professional surveillance monitoring interface
- Four camera feeds show different locations (hallway, entrance, office, backup)
- User assumes the role of observer, watching static scenes

### Stage 2: The Glitch (13-27s)
- CAM-04 appears to malfunction
- System attempts to "reconnect"
- Camera feed activates, revealing the user's own webcam
- Label changes to "YOUR LOCATION" in red

### Stage 3: The Revelation (27-46s)
- Narrative text reveals the twist: "That's... you."
- System warnings begin appearing
- User realizes they were being watched all along
- Status changes from "ONLINE" to "COMPROMISED"

### Stage 4: The Invasion (46-55s)
- Terminal overlay appears with system intrusion messages
- Displays user data (IP, browser, screen resolution, time)
- Warning messages intensify
- Visual glitch effects increase

### Stage 5: The Collapse (55s+)
- Camera feeds begin corrupting and collapsing
- System interface breaks down
- Final message appears: "WHO IS WATCHING WHOM?"
- Complete visual dissolution

## Features

### Visual Design
- Monospace terminal aesthetic with green-on-black color scheme
- CRT monitor effects with scanlines and static overlay
- Real-time clock and timestamp displays
- Professional surveillance interface design

### Interactive Elements
- **Live Webcam Integration**: Uses browser getUserMedia API to capture user's camera
- **Progressive Narrative**: Timed text overlays that guide the story
- **Dynamic Warnings**: System alert messages that appear in real-time
- **Terminal Simulation**: Fake system intrusion sequence with scrolling terminal output

### Technical Effects
- Glitch animations and color distortions
- Corruption and inversion filters
- Collapse animations with scale transformations
- Pulsing and blinking status indicators
- Responsive grid layout for camera feeds

## File Structure

```
/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # All styling and animations
├── js/
│   └── main.js         # Narrative logic and interactivity
├── assets/             # Directory for additional resources
└── README.md           # This file
```

## Technical Requirements

- Modern web browser with JavaScript enabled
- Camera permissions (optional but recommended for full experience)
- Recommended browsers: Chrome, Firefox, Edge, Safari

## Usage

1. Open `index.html` in a web browser
2. Allow camera access when prompted (for full experience)
3. Sit back and experience the narrative
4. The experience runs automatically for approximately 60 seconds

## Privacy Notice

This experience requests camera access to demonstrate the narrative theme. The camera feed is:
- Only displayed locally in your browser
- Never recorded or transmitted
- Immediately released when the page is closed

If you decline camera access, the experience will continue with a fallback message.

## Implementation Notes

### JavaScript Structure
- **init()**: Initializes the experience and starts narrative timers
- **showNarrative()**: Displays timed text overlays
- **activateUserCamera()**: Handles webcam access and integration
- **startWarnings()**: Triggers system warning messages
- **startGlitch()**: Activates visual corruption effects
- **startInvasion()**: Displays terminal intrusion sequence
- **systemCollapse()**: Final breakdown sequence

### CSS Animations
- `pulse`: Status indicator blinking
- `static`: Monitor static effect
- `glitchBg`: Background glitch colors
- `corruption`: Feed corruption with hue rotation
- `collapse`: Visual breakdown animation
- `glitchText`: Text distortion effect

### Timing System
All narrative events are controlled through the `narrativeStages` array with precise timing:
- Each stage has a delay (when to trigger)
- Text to display
- Duration (how long to show text)
- Optional action callback

## Customization

### Adjusting Timing
Modify the `narrativeStages` array in `js/main.js`:
```javascript
{
    delay: 3000,        // When to trigger (ms)
    text: "Your text",  // What to display
    duration: 4000,     // How long to show (ms)
    action: () => {}    // Optional function to call
}
```

### Changing Colors
Edit CSS variables in `css/style.css`:
- Primary color: `#00ff00` (green)
- Background: `#0a0a0a` (near-black)
- Error color: `#ff0000` (red)
- Warning color: `#ffaa00` (orange)

### Adding Terminal Messages
Extend the `terminalMessages` array in `js/main.js`:
```javascript
{
    text: "Your message",
    type: "normal",    // "normal", "warning", or "error"
    delay: 1000        // When to display (ms)
}
```

## Themes Explored

- **Surveillance Culture**: The normalization of constant monitoring
- **Digital Privacy**: The erosion of privacy in connected spaces
- **Power Dynamics**: Who controls the gaze and who is subjected to it
- **Observer Effect**: The act of observation changes the observed
- **System Trust**: Questioning the neutrality of technological systems

## Educational Context

This project is designed for:
- Digital art and media courses
- Interactive storytelling workshops
- Web development education
- Critical media studies
- Privacy and surveillance discussions

## Credits

**Concept**: Window - Peeping and Being Peeped At
**Implementation**: Interactive web narrative
**Technologies**: HTML5, CSS3, JavaScript, getUserMedia API

## License

This project is created for educational and artistic purposes.

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (may require HTTPS for camera access)
- Mobile browsers: Limited support (camera orientation may vary)

## Known Limitations

- Camera access requires user permission
- Some browsers require HTTPS for camera access in production
- Mobile devices may have different camera orientations
- Experience is timed and not pause-able by design

## Future Enhancements

Potential additions:
- Multiple narrative branches based on user interaction
- Audio elements (system beeps, voice warnings)
- More sophisticated visual effects
- User choice points that affect the outcome
- Analytics to track user engagement patterns
- Microphone visualization during invasion sequence

---

**Experience Duration**: ~60 seconds
**Interaction Level**: Passive observation with optional camera permission
**Best Experienced**: Alone, in a quiet space, with headphones ready