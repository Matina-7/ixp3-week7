/**
 * Scene 1: The Watcher's Entrance
 * Creates a sense of eavesdropping, control, and potential unease
 */

const scene1 = {
    audioContext: null,
    currentFullscreenFeed: null,
    timestampInterval: null,

    /**
     * Initialize Scene 1
     */
    init() {
        console.log('Scene 1: Initializing...');

        // Initialize audio context
        this.initAudio();

        // Start the loading sequence
        this.startLoadingSequence();
    },

    /**
     * Initialize Web Audio API for sound effects
     */
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Audio context initialized');
        } catch (error) {
            console.warn('Web Audio API not supported', error);
        }
    },

    /**
     * Play electric/glitch sound effect
     */
    playElectricSound() {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // Create a brief electric crackle sound
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Random frequency for variation
        oscillator.frequency.value = 100 + Math.random() * 200;
        oscillator.type = 'sawtooth';

        // Quick fade in/out
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.05);

        oscillator.start(now);
        oscillator.stop(now + 0.05);
    },

    /**
     * Start the loading sequence with typewriter effect
     */
    startLoadingSequence() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingText = document.getElementById('loading-text');

        // Typewriter text lines
        const lines = [
            'INITIALIZING SURVEILLANCE SYSTEM...',
            'ESTABLISHING SECURE CONNECTION...',
            'LOADING CAMERA FEEDS...',
            'CONNECTION ESTABLISHED.',
            'SYSTEM ONLINE.'
        ];

        // Use Typed.js for typewriter effect
        const typed = new Typed('#loading-text', {
            strings: lines,
            typeSpeed: 40,
            backSpeed: 0,
            backDelay: 300,
            startDelay: 500,
            showCursor: true,
            cursorChar: '█',
            onStringTyped: (arrayPos, self) => {
                // Play electric sound on each line completion
                this.playElectricSound();
            },
            onComplete: (self) => {
                // After typing is complete, fade out loading screen
                setTimeout(() => {
                    this.endLoadingSequence();
                }, 1000);
            }
        });
    },

    /**
     * End loading sequence and show feed windows
     */
    endLoadingSequence() {
        const loadingScreen = document.getElementById('loading-screen');
        const gridContainer = document.getElementById('grid-container');
        const systemHeader = document.getElementById('system-header');

        // Fade out loading screen
        loadingScreen.classList.add('fade-out');

        // Show grid container and header
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            gridContainer.classList.remove('hidden');
            gridContainer.classList.add('show');

            // Reveal feed windows one by one
            this.revealFeedWindows();
        }, 1000);
    },

    /**
     * Reveal feed windows sequentially
     */
    revealFeedWindows() {
        const feedWindows = document.querySelectorAll('.feed-window');

        feedWindows.forEach((window, index) => {
            setTimeout(() => {
                // Play electric sound
                this.playElectricSound();

                // Activate the window
                window.classList.add('active');

                // Start playing the video
                const video = window.querySelector('.feed-video');
                if (video) {
                    video.play().catch(err => {
                        console.warn(`Video autoplay failed for feed ${index + 1}:`, err);
                    });
                }

                // Add click handler
                window.addEventListener('click', () => {
                    const feedId = window.dataset.feedId;
                    this.playFeed(feedId);
                });

            }, index * 400); // Stagger by 400ms
        });
    },

    /**
     * Play a feed in fullscreen mode
     * @param {string|number} feedId - The ID of the feed to play
     */
    playFeed(feedId) {
        console.log(`Playing feed: ${feedId}`);

        const feedWindow = document.getElementById(`feed${feedId}`);
        if (!feedWindow) {
            console.error(`Feed window ${feedId} not found`);
            return;
        }

        const sourceVideo = feedWindow.querySelector('.feed-video');
        const fullscreenFeed = document.getElementById('fullscreen-feed');
        const fullscreenVideo = document.getElementById('fullscreen-video');

        // Set the video source
        if (sourceVideo && sourceVideo.src) {
            fullscreenVideo.src = sourceVideo.src;
        } else {
            // Fallback to source element
            const sourceElement = sourceVideo ? sourceVideo.querySelector('source') : null;
            if (sourceElement && sourceElement.src) {
                fullscreenVideo.src = sourceElement.src;
            }
        }

        // Show fullscreen overlay
        fullscreenFeed.classList.add('active');
        fullscreenVideo.play();

        // Store current feed
        this.currentFullscreenFeed = feedId;

        // Start updating timestamp
        this.startTimestampUpdate();

        // Play transition sound
        this.playElectricSound();
    },

    /**
     * Close fullscreen feed
     */
    closeFullscreen() {
        const fullscreenFeed = document.getElementById('fullscreen-feed');
        const fullscreenVideo = document.getElementById('fullscreen-video');

        // Hide fullscreen overlay
        fullscreenFeed.classList.remove('active');
        fullscreenVideo.pause();
        fullscreenVideo.src = '';

        // Stop timestamp update
        this.stopTimestampUpdate();

        // Clear current feed
        this.currentFullscreenFeed = null;

        // Play transition sound
        this.playElectricSound();
    },

    /**
     * Start updating the HUD timestamp
     */
    startTimestampUpdate() {
        this.updateTimestamp();
        this.timestampInterval = setInterval(() => {
            this.updateTimestamp();
        }, 1000);
    },

    /**
     * Stop updating the HUD timestamp
     */
    stopTimestampUpdate() {
        if (this.timestampInterval) {
            clearInterval(this.timestampInterval);
            this.timestampInterval = null;
        }
    },

    /**
     * Update the HUD timestamp display
     */
    updateTimestamp() {
        const timestampElement = document.getElementById('fullscreen-time');
        if (!timestampElement) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        timestampElement.textContent = `${dateString} ${timeString}`;
    },

    /**
     * Update all feed timestamps
     */
    updateFeedTimestamps() {
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
};

// Initialize Scene 1 when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    scene1.init();

    // Update feed timestamps every second
    setInterval(() => {
        scene1.updateFeedTimestamps();
    }, 1000);
});

// Also allow ESC key to close fullscreen
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && scene1.currentFullscreenFeed !== null) {
        scene1.closeFullscreen();
    }
});
