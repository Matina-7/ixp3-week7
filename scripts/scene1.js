/**
 * Scene 1: The Watcher's Entrance
 * Creates a sense of eavesdropping, control, and potential unease
 *
 * Main Export: scene1_init() - Initialize and start Scene 1
 */

// ============================================================================
// Global State Management
// ============================================================================

const scene1State = {
    audioContext: null,              // Web Audio API context for sound effects
    currentFullscreenFeed: null,     // Currently active fullscreen feed ID
    timestampInterval: null,         // Interval for timestamp updates
    backgroundSound: null,           // Background ambient sound
    backgroundGain: null,            // Volume control for background sound
    isFullscreen: false              // Fullscreen state flag
};

// ============================================================================
// Audio System - Sound Effects and Background Audio
// ============================================================================

/**
 * Initialize Web Audio API for sound effects
 */
function initAudio() {
    try {
        // Create audio context (required for all audio effects)
        scene1State.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('[Scene1] Audio context initialized');

        // Initialize background ambient sound
        initBackgroundSound();
    } catch (error) {
        console.warn('[Scene1] Web Audio API not supported', error);
    }
}

/**
 * Initialize background ambient sound (current/wind loop)
 */
function initBackgroundSound() {
    if (!scene1State.audioContext) return;

    // Create oscillator for ambient background sound
    const oscillator = scene1State.audioContext.createOscillator();
    const gainNode = scene1State.audioContext.createGain();
    const filter = scene1State.audioContext.createBiquadFilter();

    // Configure oscillator (wind/current sound simulation)
    oscillator.type = 'brown'; // Brown noise for wind effect
    oscillator.frequency.value = 30; // Low frequency rumble

    // Configure low-pass filter for muffled effect
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 1;

    // Configure gain (volume control)
    gainNode.gain.value = 0.02; // Very low volume (2%)

    // Connect audio nodes: oscillator → filter → gain → output
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(scene1State.audioContext.destination);

    // Store references for later control
    scene1State.backgroundSound = oscillator;
    scene1State.backgroundGain = gainNode;

    // Start playing background sound
    oscillator.start();
    console.log('[Scene1] Background ambient sound started');
}

/**
 * Increase background sound volume (for fullscreen immersion)
 */
function increaseBackgroundVolume() {
    if (!scene1State.backgroundGain) return;

    // Smoothly increase volume to 5%
    const currentTime = scene1State.audioContext.currentTime;
    scene1State.backgroundGain.gain.linearRampToValueAtTime(0.05, currentTime + 0.5);
    console.log('[Scene1] Background volume increased for fullscreen');
}

/**
 * Decrease background sound volume (return to normal)
 */
function decreaseBackgroundVolume() {
    if (!scene1State.backgroundGain) return;

    // Smoothly decrease volume back to 2%
    const currentTime = scene1State.audioContext.currentTime;
    scene1State.backgroundGain.gain.linearRampToValueAtTime(0.02, currentTime + 0.5);
    console.log('[Scene1] Background volume decreased to normal');
}

/**
 * Play electric/glitch sound effect
 * Used for: line completion, feed reveal, fullscreen transitions
 */
function playElectricSound() {
    if (!scene1State.audioContext) return;

    // Create oscillator for electric crackle
    const oscillator = scene1State.audioContext.createOscillator();
    const gainNode = scene1State.audioContext.createGain();

    // Connect nodes: oscillator → gain → output
    oscillator.connect(gainNode);
    gainNode.connect(scene1State.audioContext.destination);

    // Configure electric crackle sound
    oscillator.frequency.value = 100 + Math.random() * 200; // Random 100-300Hz
    oscillator.type = 'sawtooth'; // Harsh sawtooth wave

    // Quick fade in/out envelope
    const now = scene1State.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.05);

    // Play sound (50ms duration)
    oscillator.start(now);
    oscillator.stop(now + 0.05);
}

// ============================================================================
// Loading Sequence - Typewriter Effect
// ============================================================================

/**
 * Start the loading sequence with typewriter effect
 * Displays system initialization messages with typing animation
 */
function startLoadingSequence() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');

    console.log('[Scene1] Starting loading sequence');

    // Define loading messages
    const lines = [
        'INITIALIZING SURVEILLANCE SYSTEM...',
        'ESTABLISHING SECURE CONNECTION...',
        'LOADING CAMERA FEEDS...',
        'CONNECTION ESTABLISHED.',
        'SYSTEM ONLINE.'
    ];

    // Initialize Typed.js for typewriter effect
    const typed = new Typed('#loading-text', {
        strings: lines,                // Messages to type
        typeSpeed: 40,                 // Typing speed (ms per character)
        backSpeed: 0,                  // No backspace effect
        backDelay: 300,                // Delay before next line
        startDelay: 500,               // Initial delay
        showCursor: true,              // Show blinking cursor
        cursorChar: '█',               // Cursor character

        // Callback: executed after each line is typed
        onStringTyped: (arrayPos, self) => {
            playElectricSound(); // Play sound on line completion
            console.log(`[Scene1] Line ${arrayPos + 1} typed`);
        },

        // Callback: executed when all typing is complete
        onComplete: (self) => {
            console.log('[Scene1] Loading sequence complete');
            // Wait 1 second, then transition to feed grid
            setTimeout(() => {
                endLoadingSequence();
            }, 1000);
        }
    });
}

/**
 * End loading sequence and transition to feed grid
 * Timing: ~3 seconds total for smooth transition
 */
function endLoadingSequence() {
    const loadingScreen = document.getElementById('loading-screen');
    const gridContainer = document.getElementById('grid-container');

    console.log('[Scene1] Ending loading sequence, showing feed grid');

    // Fade out loading screen (1 second transition)
    loadingScreen.classList.add('fade-out');

    // After fade out, show feed grid and reveal windows
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        gridContainer.classList.remove('hidden');
        gridContainer.classList.add('show');

        console.log('[Scene1] Feed grid visible, starting window reveal');

        // Begin revealing feed windows sequentially
        revealFeedWindows();
    }, 1000);
}

// ============================================================================
// Feed Window Management
// ============================================================================

/**
 * Reveal feed windows sequentially with animation
 * Each window fades in with 400ms delay between windows
 */
function revealFeedWindows() {
    const feedWindows = document.querySelectorAll('.feed-window');

    console.log(`[Scene1] Revealing ${feedWindows.length} feed windows`);

    feedWindows.forEach((window, index) => {
        setTimeout(() => {
            // Play electric sound effect
            playElectricSound();

            // Activate window (triggers fade-in animation)
            window.classList.add('active');
            console.log(`[Scene1] Feed window ${index + 1} revealed`);

            // Start video playback
            const video = window.querySelector('.feed-video');
            if (video) {
                video.play().catch(err => {
                    console.warn(`[Scene1] Video autoplay failed for feed ${index + 1}:`, err);
                });
            }

            // Add click event listener for fullscreen
            window.addEventListener('click', () => {
                const feedId = window.dataset.feedId;
                playFeed(feedId);
            });

        }, index * 400); // Stagger by 400ms
    });
}

// ============================================================================
// Fullscreen Mode - Video Playback
// ============================================================================

/**
 * Map feed ID to video source
 * @param {string|number} feedId - Feed ID (1-6)
 * @returns {string} Video source path
 */
function getFeedVideoSource(feedId) {
    // Video path mapping (placeholder paths)
    const videoMap = {
        '1': 'videos/feed1.webm',
        '2': 'videos/feed2.webm',
        '3': 'videos/feed3.webm',
        '4': 'videos/feed4.webm',
        '5': 'videos/feed5.webm',
        '6': 'videos/feed6.webm'
    };

    return videoMap[feedId.toString()] || 'videos/feed1.webm';
}

/**
 * Play a feed in fullscreen mode
 * @param {string|number} feedId - The ID of the feed to play (1-6)
 */
function playFeed(feedId) {
    console.log(`[Scene1] Playing feed ${feedId} in fullscreen`);

    // Get elements
    const feedWindow = document.getElementById(`feed${feedId}`);
    if (!feedWindow) {
        console.error(`[Scene1] Feed window ${feedId} not found`);
        return;
    }

    const sourceVideo = feedWindow.querySelector('.feed-video');
    const fullscreenFeed = document.getElementById('fullscreen-feed');
    const fullscreenVideo = document.getElementById('fullscreen-video');

    // Get video source from the feed window
    let videoSource = getFeedVideoSource(feedId);

    // Try to get actual source from video element
    if (sourceVideo && sourceVideo.currentSrc) {
        videoSource = sourceVideo.currentSrc;
    } else if (sourceVideo) {
        const sourceElement = sourceVideo.querySelector('source');
        if (sourceElement && sourceElement.src) {
            videoSource = sourceElement.src;
        }
    }

    console.log(`[Scene1] Video source: ${videoSource}`);

    // Set fullscreen video source
    fullscreenVideo.src = videoSource;

    // Show fullscreen overlay with smooth transition
    fullscreenFeed.classList.add('active');
    document.body.classList.add('fullscreen');

    // Play video
    fullscreenVideo.play().catch(err => {
        console.warn('[Scene1] Fullscreen video playback failed:', err);
    });

    // Update state
    scene1State.currentFullscreenFeed = feedId;
    scene1State.isFullscreen = true;

    // Increase background sound volume for immersion
    increaseBackgroundVolume();

    // Start updating timestamp in HUD
    startTimestampUpdate();

    // Play transition sound effect
    playElectricSound();

    console.log(`[Scene1] Fullscreen mode activated for feed ${feedId}`);
}

/**
 * Close fullscreen feed and return to grid view
 */
function closeFullscreen() {
    console.log('[Scene1] Closing fullscreen mode');

    // Get elements
    const fullscreenFeed = document.getElementById('fullscreen-feed');
    const fullscreenVideo = document.getElementById('fullscreen-video');

    // Hide fullscreen overlay
    fullscreenFeed.classList.remove('active');
    document.body.classList.remove('fullscreen');

    // Stop video playback and clear source
    fullscreenVideo.pause();
    fullscreenVideo.src = '';

    // Decrease background sound volume
    decreaseBackgroundVolume();

    // Stop timestamp updates
    stopTimestampUpdate();

    // Update state
    scene1State.currentFullscreenFeed = null;
    scene1State.isFullscreen = false;

    // Play transition sound effect
    playElectricSound();

    console.log('[Scene1] Returned to grid view');
}

// Make closeFullscreen globally accessible for onclick handler
window.closeFullscreen = closeFullscreen;

// ============================================================================
// Timestamp Management - HUD Display
// ============================================================================

/**
 * Start updating the HUD timestamp (every second)
 */
function startTimestampUpdate() {
    // Update immediately
    updateTimestamp();

    // Then update every second
    scene1State.timestampInterval = setInterval(() => {
        updateTimestamp();
    }, 1000);

    console.log('[Scene1] Timestamp updates started');
}

/**
 * Stop updating the HUD timestamp
 */
function stopTimestampUpdate() {
    if (scene1State.timestampInterval) {
        clearInterval(scene1State.timestampInterval);
        scene1State.timestampInterval = null;
        console.log('[Scene1] Timestamp updates stopped');
    }
}

/**
 * Update the HUD timestamp display
 * Format: REC YYYY/MM/DD HH:MM:SS
 */
function updateTimestamp() {
    const timestampElement = document.getElementById('fullscreen-time');
    if (!timestampElement) return;

    // Get current date and time
    const now = new Date();

    // Format date: YYYY/MM/DD
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}/${month}/${day}`;

    // Format time: HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    // Update display: REC YYYY/MM/DD HH:MM:SS
    timestampElement.textContent = `REC ${dateString} ${timeString}`;
}

/**
 * Update all feed window timestamps
 */
function updateFeedTimestamps() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    document.querySelectorAll('.timestamp').forEach(ts => {
        ts.textContent = timeString;
    });
}

// ============================================================================
// Event Listeners - Keyboard and Global Events
// ============================================================================

/**
 * Setup keyboard event listeners
 */
function setupKeyboardListeners() {
    // ESC key to exit fullscreen
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && scene1State.isFullscreen) {
            e.preventDefault();
            closeFullscreen();
            console.log('[Scene1] ESC key pressed - exiting fullscreen');
        }
    });

    console.log('[Scene1] Keyboard listeners initialized');
}

// ============================================================================
// Scene Initialization - Main Entry Point
// ============================================================================

/**
 * Initialize Scene 1 - Main entry point
 * Call this function to start Scene 1
 */
export function scene1_init() {
    console.log('='.repeat(60));
    console.log('[Scene1] Initializing Scene 1: The Watcher\'s Entrance');
    console.log('='.repeat(60));

    // Initialize audio system
    initAudio();

    // Setup keyboard event listeners
    setupKeyboardListeners();

    // Start loading sequence
    startLoadingSequence();

    // Start updating feed timestamps every second
    setInterval(() => {
        updateFeedTimestamps();
    }, 1000);

    console.log('[Scene1] Scene 1 initialization complete');
    console.log('[Scene1] Ready for user interaction');
}

// ============================================================================
// Module Exports
// ============================================================================

// Export functions for potential external use
export {
    playFeed,
    closeFullscreen,
    playElectricSound
};

console.log('[Scene1] Module loaded successfully');
