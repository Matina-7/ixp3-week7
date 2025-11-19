/**
 * Scene 3: The Revelation
 * Climax scene where the horror is revealed based on gaze patterns
 */

const Scene3 = {
    initialized: false,
    sceneElement: null,
    revelationTriggered: false,
    avoidanceCount: 0,
    confrontationCount: 0,

    /**
     * Initialize Scene 3
     */
    init() {
        if (this.initialized) {
            this.show();
            return;
        }

        Utils.log('Initializing Scene 3: The Revelation');

        this.sceneElement = document.getElementById('scene3');
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
            class: 'scene3-layout',
            style: {
                width: '100%',
                height: '100%',
                position: 'relative',
                background: '#000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }
        });

        // Add narrative text
        const narrativeText = Utils.createElement('div', {
            class: 'narrative-text',
            style: {
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#e0e0e0',
                fontSize: '24px',
                textAlign: 'center',
                maxWidth: '80%',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                opacity: '1',
                transition: 'opacity 2s ease'
            }
        }, 'It knows you\'ve been watching...');

        // Create revelation element (the entity)
        const revelation = Utils.createElement('div', {
            class: 'revelation-entity',
            style: {
                width: '300px',
                height: '400px',
                background: 'linear-gradient(180deg, #0a0a0a, #1a0000)',
                position: 'relative',
                opacity: '0',
                transition: 'all 1s ease',
                boxShadow: '0 0 100px rgba(139, 0, 0, 0.8)'
            }
        });

        // Add entity features
        const face = Utils.createElement('div', {
            class: 'entity-face',
            style: {
                position: 'absolute',
                top: '30%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '50%'
            }
        });

        // Add eyes that track the user
        const eyes = Utils.createElement('div', {
            class: 'entity-eyes',
            style: {
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '20px'
            }
        });

        for (let i = 0; i < 2; i++) {
            const eyeContainer = Utils.createElement('div', {
                class: 'eye-container',
                style: {
                    width: '50px',
                    height: '50px',
                    background: '#fff',
                    borderRadius: '50%',
                    position: 'relative',
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
                }
            });

            const pupil = Utils.createElement('div', {
                class: 'pupil',
                style: {
                    width: '25px',
                    height: '25px',
                    background: '#8b0000',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 0.1s ease'
                }
            });

            eyeContainer.appendChild(pupil);
            eyes.appendChild(eyeContainer);
        }

        face.appendChild(eyes);
        revelation.appendChild(face);

        // Add final message
        const finalMessage = Utils.createElement('div', {
            class: 'final-message',
            style: {
                position: 'absolute',
                bottom: '15%',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#8b0000',
                fontSize: '28px',
                textAlign: 'center',
                opacity: '0',
                transition: 'opacity 2s ease',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(139, 0, 0, 0.8)'
            }
        }, 'And now... it watches back.');

        layout.appendChild(narrativeText);
        layout.appendChild(revelation);
        layout.appendChild(finalMessage);
        content.appendChild(layout);

        // Store elements for later use
        this.narrativeText = narrativeText;
        this.revelation = revelation;
        this.finalMessage = finalMessage;
        this.pupils = revelation.querySelectorAll('.pupil');

        // Start revelation sequence
        setTimeout(() => {
            this.startRevelation();
        }, 2000);
    },

    /**
     * Start the revelation sequence
     */
    async startRevelation() {
        // Fade out narrative text
        this.narrativeText.style.opacity = '0';

        await Utils.delay(2000);

        // Reveal the entity
        this.revelation.style.opacity = '1';

        await Utils.delay(3000);

        // Show final message
        this.finalMessage.style.opacity = '1';

        this.revelationTriggered = true;

        // End scene after final message
        await Utils.delay(5000);
        this.transitionToEnd();
    },

    /**
     * Set up gaze tracking for this scene
     */
    setupGazeTracking() {
        if (!EyeTracker.initialized) {
            console.warn('Eye tracker not initialized');
            return;
        }

        this.gazeCallback = (gazeData) => {
            this.updatePupilTracking(gazeData);
        };

        EyeTracker.onGaze(this.gazeCallback);
    },

    /**
     * Update pupils to track user's gaze
     */
    updatePupilTracking(gazeData) {
        if (!this.pupils || !this.revelation) return;

        const revelationRect = this.revelation.getBoundingClientRect();
        const revelationCenter = {
            x: revelationRect.left + revelationRect.width / 2,
            y: revelationRect.top + revelationRect.height / 2
        };

        this.pupils.forEach(pupil => {
            const eyeRect = pupil.parentElement.getBoundingClientRect();
            const eyeCenter = {
                x: eyeRect.left + eyeRect.width / 2,
                y: eyeRect.top + eyeRect.height / 2
            };

            // Calculate angle from eye to gaze point
            const angle = Math.atan2(
                gazeData.y - eyeCenter.y,
                gazeData.x - eyeCenter.x
            );

            // Move pupil in that direction (limited range)
            const maxOffset = 10;
            const offsetX = Math.cos(angle) * maxOffset;
            const offsetY = Math.sin(angle) * maxOffset;

            pupil.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
        });
    },

    /**
     * Transition to end
     */
    async transitionToEnd() {
        Utils.log('Scene 3 complete, ending experience...');

        // Remove gaze callback
        if (this.gazeCallback) {
            EyeTracker.offGaze(this.gazeCallback);
        }

        // Fade to black
        const fadeOverlay = Utils.createElement('div', {
            style: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: '#000',
                opacity: '0',
                transition: 'opacity 3s ease',
                zIndex: '1000'
            }
        });

        document.body.appendChild(fadeOverlay);

        await Utils.delay(100);
        fadeOverlay.style.opacity = '1';

        await Utils.delay(3000);

        // End experience
        if (window.app) {
            window.app.endExperience();
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
        this.revelationTriggered = false;
        this.avoidanceCount = 0;
        this.confrontationCount = 0;
    }
};

// Make Scene3 globally accessible
window.Scene3 = Scene3;
