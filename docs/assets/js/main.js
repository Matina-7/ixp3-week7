/**
 * Through the Window - Main Application Entry Point
 * Interactive Narrative Horror Experience
 */

class Application {
    constructor() {
        this.currentScene = null;
        this.eyeTrackerInitialized = false;
        this.audioContext = null;
        this.ambientAudio = null;
        this.loadingProgress = 0;
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing Through the Window...');

        // Show loading screen
        this.showLoadingScreen();

        // Load resources
        await this.loadResources();

        // Initialize eye tracker
        await this.initializeEyeTracker();

        // Show calibration screen
        this.showCalibrationScreen();
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('active');
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.remove('active');
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 300);
    }

    /**
     * Load all required resources
     */
    async loadResources() {
        const resources = [
            this.loadAudio(),
            this.loadScripts(),
            this.preloadVideos()
        ];

        // Update progress
        let completed = 0;
        const total = resources.length;

        for (const resource of resources) {
            await resource;
            completed++;
            this.updateLoadingProgress((completed / total) * 100);
        }
    }

    /**
     * Update loading progress bar
     */
    updateLoadingProgress(percent) {
        this.loadingProgress = percent;
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }
    }

    /**
     * Load audio files
     */
    async loadAudio() {
        return new Promise((resolve) => {
            this.ambientAudio = document.getElementById('ambient-audio');

            if (this.ambientAudio) {
                this.ambientAudio.addEventListener('canplaythrough', () => {
                    console.log('Ambient audio loaded');
                    resolve();
                }, { once: true });

                this.ambientAudio.load();
            } else {
                resolve();
            }
        });
    }

    /**
     * Load scripts
     */
    async loadScripts() {
        // Scripts are already loaded via HTML
        return Promise.resolve();
    }

    /**
     * Preload video files
     */
    async preloadVideos() {
        // Video preloading will be handled by scene modules
        return Promise.resolve();
    }

    /**
     * Initialize eye tracker
     */
    async initializeEyeTracker() {
        if (typeof EyeTracker !== 'undefined') {
            try {
                await EyeTracker.init();
                this.eyeTrackerInitialized = true;
                console.log('Eye tracker initialized');
            } catch (error) {
                console.warn('Eye tracker initialization failed:', error);
                this.eyeTrackerInitialized = false;
            }
        }
    }

    /**
     * Show calibration screen
     */
    showCalibrationScreen() {
        this.hideLoadingScreen();

        const calibrationScreen = document.getElementById('calibration-screen');
        calibrationScreen.classList.remove('hidden');

        // Set up calibration
        if (this.eyeTrackerInitialized && typeof EyeTracker !== 'undefined') {
            EyeTracker.startCalibration(() => {
                this.onCalibrationComplete();
            });
        } else {
            // Skip calibration if eye tracker is not available
            const startButton = document.getElementById('start-experience');
            startButton.classList.remove('hidden');
            startButton.addEventListener('click', () => {
                this.onCalibrationComplete();
            });
        }
    }

    /**
     * Handle calibration completion
     */
    onCalibrationComplete() {
        console.log('Calibration complete');

        // Hide calibration screen
        const calibrationScreen = document.getElementById('calibration-screen');
        calibrationScreen.classList.add('hidden');

        // Start experience
        this.startExperience();
    }

    /**
     * Start the main experience
     */
    startExperience() {
        console.log('Starting experience...');

        // Show experience container
        const experienceContainer = document.getElementById('experience-container');
        experienceContainer.classList.remove('hidden');

        // Play ambient audio
        this.playAmbientAudio();

        // Load first scene
        this.loadScene('scene1');
    }

    /**
     * Play ambient audio
     */
    playAmbientAudio() {
        if (this.ambientAudio) {
            this.ambientAudio.play().catch(error => {
                console.warn('Audio playback failed:', error);
            });
        }
    }

    /**
     * Load a scene
     */
    loadScene(sceneId) {
        console.log(`Loading scene: ${sceneId}`);

        // Hide all scenes
        const scenes = document.querySelectorAll('.scene');
        scenes.forEach(scene => {
            scene.classList.remove('active');
            scene.classList.add('hidden');
        });

        // Show target scene
        const targetScene = document.getElementById(sceneId);
        if (targetScene) {
            targetScene.classList.remove('hidden');
            targetScene.classList.add('active');

            // Initialize scene if it has an init function
            const sceneName = sceneId.charAt(0).toUpperCase() + sceneId.slice(1);
            if (window[sceneName] && typeof window[sceneName].init === 'function') {
                window[sceneName].init();
            }

            this.currentScene = sceneId;
        }
    }

    /**
     * Transition to next scene
     */
    nextScene() {
        const sceneNumber = parseInt(this.currentScene.replace('scene', ''));
        const nextSceneId = `scene${sceneNumber + 1}`;

        if (document.getElementById(nextSceneId)) {
            this.loadScene(nextSceneId);
        } else {
            console.log('No more scenes, experience complete');
            this.endExperience();
        }
    }

    /**
     * End the experience
     */
    endExperience() {
        console.log('Experience ended');

        // Fade out audio
        if (this.ambientAudio) {
            const fadeOut = setInterval(() => {
                if (this.ambientAudio.volume > 0.1) {
                    this.ambientAudio.volume -= 0.1;
                } else {
                    this.ambientAudio.pause();
                    clearInterval(fadeOut);
                }
            }, 200);
        }

        // Show end screen or credits
        // TODO: Implement end screen
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    app.init();

    // Make app globally accessible for debugging
    window.app = app;
});
