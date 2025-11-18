/**
 * Scene 1: The Watcher's Entrance
 * Initial scene where the user encounters the mysterious presence
 */

const Scene1 = {
    initialized: false,
    sceneElement: null,
    watcherElement: null,
    gazeTimer: 0,
    gazeDuration: 0,
    requiredGazeDuration: 3000, // 3 seconds

    /**
     * Initialize Scene 1
     */
    init() {
        if (this.initialized) {
            this.show();
            return;
        }

        Utils.log('Initializing Scene 1: The Watcher\'s Entrance');

        this.sceneElement = document.getElementById('scene1');
        this.setupScene();
        this.setupGazeTracking();

        this.initialized = true;
    },

    /**
     * Set up the scene content
     */
    setupScene() {
        const content = this.sceneElement.querySelector('.scene-content');
        content.innerHTML = '';

        // Create scene layout
        const layout = Utils.createElement('div', {
            class: 'scene1-layout',
            style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
            }
        });

        // Add narrative text
        const narrativeText = Utils.createElement('div', {
            class: 'narrative-text',
            style: {
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#e0e0e0',
                fontSize: '24px',
                textAlign: 'center',
                maxWidth: '80%',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }
        }, 'Something is watching you...');

        // Create the watcher element (initially hidden)
        this.watcherElement = Utils.createElement('div', {
            class: 'watcher',
            style: {
                position: 'absolute',
                right: '5%',
                bottom: '10%',
                width: '150px',
                height: '200px',
                background: 'linear-gradient(to bottom, #1a1a1a, #000)',
                borderRadius: '50% 50% 0 0',
                opacity: '0',
                transition: 'opacity 2s ease',
                boxShadow: '0 0 20px rgba(139, 0, 0, 0.5)'
            }
        });

        // Add eyes to the watcher
        const eyes = Utils.createElement('div', {
            class: 'watcher-eyes',
            style: {
                position: 'absolute',
                top: '30%',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '30px'
            }
        });

        for (let i = 0; i < 2; i++) {
            const eye = Utils.createElement('div', {
                class: 'eye',
                style: {
                    width: '20px',
                    height: '20px',
                    background: '#8b0000',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px #8b0000',
                    animation: 'blink 4s infinite'
                }
            });
            eyes.appendChild(eye);
        }

        // Add blink animation
        if (!document.getElementById('scene1-styles')) {
            const style = document.createElement('style');
            style.id = 'scene1-styles';
            style.textContent = `
                @keyframes blink {
                    0%, 49%, 51%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        this.watcherElement.appendChild(eyes);

        // Add instruction text
        const instructionText = Utils.createElement('div', {
            class: 'instruction-text',
            style: {
                position: 'absolute',
                bottom: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(224, 224, 224, 0.7)',
                fontSize: '16px',
                textAlign: 'center'
            }
        }, 'Look at the figure for 3 seconds to continue...');

        layout.appendChild(narrativeText);
        layout.appendChild(this.watcherElement);
        layout.appendChild(instructionText);
        content.appendChild(layout);

        // Fade in the watcher after a delay
        setTimeout(() => {
            this.watcherElement.style.opacity = '0.8';
        }, 2000);
    },

    /**
     * Set up gaze tracking for this scene
     */
    setupGazeTracking() {
        if (!EyeTracker.initialized) {
            console.warn('Eye tracker not initialized, using click fallback');
            this.setupClickFallback();
            return;
        }

        this.gazeCallback = (gazeData) => {
            if (!this.watcherElement) return;

            const rect = this.watcherElement.getBoundingClientRect();
            const isGazing = Utils.isPointInRect(gazeData, {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height
            });

            if (isGazing) {
                this.onGazeEnter();
            } else {
                this.onGazeExit();
            }
        };

        EyeTracker.onGaze(this.gazeCallback);
    },

    /**
     * Set up click fallback for when eye tracker is unavailable
     */
    setupClickFallback() {
        if (this.watcherElement) {
            this.watcherElement.style.cursor = 'pointer';
            this.watcherElement.addEventListener('click', () => {
                this.transitionToNextScene();
            });
        }
    },

    /**
     * Handle gaze entering the watcher
     */
    onGazeEnter() {
        if (!this.gazeTimer) {
            this.gazeTimer = Date.now();
            Utils.log('Gaze entered watcher');
        }

        const elapsed = Date.now() - this.gazeTimer;
        this.gazeDuration = elapsed;

        // Visual feedback
        if (this.watcherElement) {
            const progress = Math.min(elapsed / this.requiredGazeDuration, 1);
            this.watcherElement.style.opacity = 0.8 + (progress * 0.2);
            this.watcherElement.style.boxShadow = `0 0 ${20 + progress * 30}px rgba(139, 0, 0, ${0.5 + progress * 0.5})`;
        }

        // Check if gaze duration met
        if (elapsed >= this.requiredGazeDuration) {
            this.transitionToNextScene();
        }
    },

    /**
     * Handle gaze exiting the watcher
     */
    onGazeExit() {
        if (this.gazeTimer) {
            Utils.log('Gaze exited watcher');
            this.gazeTimer = 0;
            this.gazeDuration = 0;

            // Reset visual feedback
            if (this.watcherElement) {
                this.watcherElement.style.opacity = '0.8';
                this.watcherElement.style.boxShadow = '0 0 20px rgba(139, 0, 0, 0.5)';
            }
        }
    },

    /**
     * Transition to the next scene
     */
    async transitionToNextScene() {
        Utils.log('Scene 1 complete, transitioning...');

        // Remove gaze callback
        if (this.gazeCallback) {
            EyeTracker.offGaze(this.gazeCallback);
        }

        // Fade out watcher
        if (this.watcherElement) {
            await Utils.fadeOut(this.watcherElement, 1000);
        }

        // Transition to next scene
        if (window.app) {
            window.app.nextScene();
        }
    },

    /**
     * Show the scene
     */
    show() {
        if (this.sceneElement) {
            this.sceneElement.classList.remove('hidden');
            this.sceneElement.classList.add('active');
        }
    },

    /**
     * Hide the scene
     */
    hide() {
        if (this.sceneElement) {
            this.sceneElement.classList.remove('active');
            this.sceneElement.classList.add('hidden');
        }
    },

    /**
     * Clean up scene resources
     */
    cleanup() {
        if (this.gazeCallback) {
            EyeTracker.offGaze(this.gazeCallback);
        }
        this.gazeTimer = 0;
        this.gazeDuration = 0;
    }
};

// Make Scene1 globally accessible
window.Scene1 = Scene1;
