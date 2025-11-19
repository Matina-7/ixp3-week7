# WebGazer.js Integration

## Required: webgazer.min.js

This project requires the WebGazer.js library for eye-tracking functionality.

## Installation

### Option 1: Download from CDN
Download the minified version from:
```
https://webgazer.cs.brown.edu/webgazer.js
```

Save it as `webgazer.min.js` in this directory.

### Option 2: Use CDN (Alternative)
Instead of downloading, you can update `index.html` to load from CDN:

```html
<script src="https://webgazer.cs.brown.edu/webgazer.js"></script>
```

### Option 3: NPM Installation
If using a build system:

```bash
npm install webgazer
```

Then copy the built file to this directory.

## About WebGazer.js

WebGazer.js is an eye tracking library that uses common webcams to infer the eye-gaze locations of web visitors on a page in real time.

- **Website**: https://webgazer.cs.brown.edu/
- **GitHub**: https://github.com/brownhci/WebGazer
- **License**: GPL-3.0

## Testing

To test if WebGazer is working:
1. Open the browser console
2. Type: `typeof webgazer`
3. Should return: `"object"` (not "undefined")

## Privacy Note

WebGazer requires camera permissions. Ensure users are informed and consent to camera access for eye tracking.
