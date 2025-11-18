/**
 * Scene 2: The Observation
 * Scene where user's gaze controls what happens in the environment
 */

const Scene2 = {
    initialized: false,
    sceneElement: null,
    videoFeeds: [],
    activeZone: null,
    observationTime: 0,

    /**
     * Initialize Scene 2
     */
    init() {
        if (this.initialized) {
            this.show();
            return;
        }

        Utils.log('Initializing Scene 2: The Observation');

        this.sceneElement = document.getElementById('scene2');
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
            class: 'scene2-layout',
            style: {
                width: '100%',
                height: '100%',
                position: 'relative',
                background: '#000'
            }
        });

        // Add narrative text
        const narrativeText = Utils.createElement('div', {
            class: 'narrative-text',
            style: {
                position: 'absolute',
                top: '5%',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#e0e0e0',
                fontSize: '20px',
                textAlign: 'center',
                zIndex: '10',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }
        }, 'Where you look determines what you see...');

        // Create split view zones
        const leftZone = Utils.createElement('div', {
            class: 'observation-zone left-zone',
            style: {
                position: 'absolute',
                left: '0',
                top: '0',
                width: '50%',
                height: '100%',
                background: '#1a1a1a',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.5s ease'
            }
        }, '<div style="color: #888; font-size: 18px;">Security Feed A</div>');

        const rightZone = Utils.createElement('div', {
            class: 'observation-zone right-zone',
            style: {
                position: 'absolute',
                right: '0',
                top: '0',
                width: '50%',
                height: '100%',
                background: '#1a1a1a',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all 0.5s ease'
            }
        }, '<div style="color: #888; font-size: 18px;">Security Feed B</div>');

        layout.appendChild(narrativeText);
        layout.appendChild(leftZone);
        layout.appendChild(rightZone);
        content.appendChild(layout);

        // Fade in narrative text
        setTimeout(() => {
            Utils.fadeOut(narrativeText, 2000);
        }, 3000);
    },

    /**
     * Set up gaze tracking for this scene
     */
    setupGazeTracking() {
        if (!EyeTracker.initialized) {
            console.warn('Eye tracker not initialized');
            this.setupFallback();
            return;
        }

        this.gazeCallback = (gazeData) => {
            this.handleGazePosition(gazeData);
        };

        EyeTracker.onGaze(this.gazeCallback);
    },

    /**
     * Set up fallback interaction
     */
    setupFallback() {
        // Add hover effects as fallback
        const zones = this.sceneElement.querySelectorAll('.observation-zone');
        zones.forEach(zone => {
            zone.addEventListener('mouseenter', () => {
                this.activateZone(zone);
            });
        });

        // Auto-advance after some time
        setTimeout(() => {
            this.transitionToNextScene();
        }, 10000);
    },

    /**
     * Handle gaze position
     */
    handleGazePosition(gazeData) {
        const leftZone = this.sceneElement.querySelector('.left-zone');
        const rightZone = this.sceneElement.querySelector('.right-zone');

        const leftRect = leftZone.getBoundingClientRect();
        const rightRect = rightZone.getBoundingClientRect();

        const isLookingLeft = Utils.isPointInRect(gazeData, {
            x: leftRect.left,
            y: leftRect.top,
            width: leftRect.width,
            height: leftRect.height
        });

        const isLookingRight = Utils.isPointInRect(gazeData, {
            x: rightRect.left,
            y: rightRect.top,
            width: rightRect.width,
            height: rightRect.height
        });

        if (isLookingLeft) {
            this.activateZone(leftZone);
            this.deactivateZone(rightZone);
        } else if (isLookingRight) {
            this.activateZone(rightZone);
            this.deactivateZone(leftZone);
        }

        // Update observation time
        this.observationTime += 16; // Approximate frame time

        // Transition after sufficient observation
        if (this.observationTime > 15000) { // 15 seconds
            this.transitionToNextScene();
        }
    },

    /**
     * Activate a zone
     */
    activateZone(zone) {
        if (this.activeZone === zone) return;

        this.activeZone = zone;
        zone.style.background = '#2a2a2a';
        zone.style.boxShadow = 'inset 0 0 50px rgba(139, 0, 0, 0.3)';
    },

    /**
     * Deactivate a zone
     */
    deactivateZone(zone) {
        zone.style.background = '#1a1a1a';
        zone.style.boxShadow = 'none';
    },

    /**
     * Transition to the next scene
     */
    async transitionToNextScene() {
        Utils.log('Scene 2 complete, transitioning...');

        // Remove gaze callback
        if (this.gazeCallback) {
            EyeTracker.offGaze(this.gazeCallback);
        }

        // Fade out scene
        await Utils.fadeOut(this.sceneElement, 1000);

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
        this.observationTime = 0;
        this.activeZone = null;
    }
};

// Make Scene2 globally accessible
window.Scene2 = Scene2;
