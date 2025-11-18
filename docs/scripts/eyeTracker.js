/**
 * Eye Tracker Module
 * Handles WebGazer.js integration and gaze tracking
 */

const EyeTracker = {
    initialized: false,
    calibrated: false,
    gazeData: { x: 0, y: 0 },
    gazeCallbacks: [],
    calibrationPoints: [],
    currentCalibrationPoint: 0,
    gazeIndicator: null,

    /**
     * Initialize the eye tracker
     */
    async init() {
        if (this.initialized) {
            console.log('Eye tracker already initialized');
            return;
        }

        Utils.log('Initializing eye tracker...');

        try {
            // Check if WebGazer is available
            if (typeof webgazer === 'undefined') {
                throw new Error('WebGazer.js not loaded');
            }

            // Initialize WebGazer
            await webgazer
                .setGazeListener((data, timestamp) => {
                    if (data) {
                        this.onGazeUpdate(data);
                    }
                })
                .begin();

            // Configure WebGazer
            webgazer
                .showVideoPreview(false)
                .showPredictionPoints(false)
                .showFaceOverlay(false)
                .showFaceFeedbackBox(false);

            // Create gaze indicator
            this.createGazeIndicator();

            this.initialized = true;
            Utils.log('Eye tracker initialized successfully');

        } catch (error) {
            console.error('Failed to initialize eye tracker:', error);
            throw error;
        }
    },

    /**
     * Create visual gaze indicator
     */
    createGazeIndicator() {
        this.gazeIndicator = document.querySelector('.gaze-indicator');
        if (!this.gazeIndicator) {
            this.gazeIndicator = Utils.createElement('div', {
                class: 'gaze-indicator'
            });
            document.getElementById('ui-overlay').appendChild(this.gazeIndicator);
        }
    },

    /**
     * Handle gaze data updates
     */
    onGazeUpdate(data) {
        this.gazeData.x = data.x;
        this.gazeData.y = data.y;

        // Update visual indicator
        if (this.gazeIndicator) {
            this.gazeIndicator.style.left = `${data.x}px`;
            this.gazeIndicator.style.top = `${data.y}px`;
        }

        // Trigger callbacks
        this.gazeCallbacks.forEach(callback => {
            callback(this.gazeData);
        });
    },

    /**
     * Register a callback for gaze updates
     */
    onGaze(callback) {
        this.gazeCallbacks.push(callback);
    },

    /**
     * Remove a gaze callback
     */
    offGaze(callback) {
        const index = this.gazeCallbacks.indexOf(callback);
        if (index > -1) {
            this.gazeCallbacks.splice(index, 1);
        }
    },

    /**
     * Start calibration process
     */
    startCalibration(onComplete) {
        Utils.log('Starting calibration...');

        this.calibrationPoints = [
            { x: window.innerWidth * 0.1, y: window.innerHeight * 0.1 },
            { x: window.innerWidth * 0.9, y: window.innerHeight * 0.1 },
            { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
            { x: window.innerWidth * 0.1, y: window.innerHeight * 0.9 },
            { x: window.innerWidth * 0.9, y: window.innerHeight * 0.9 }
        ];

        this.currentCalibrationPoint = 0;

        const calibrationContainer = document.getElementById('calibration-container');
        calibrationContainer.innerHTML = '';

        this.showCalibrationPoint(calibrationContainer, onComplete);
    },

    /**
     * Show a calibration point
     */
    showCalibrationPoint(container, onComplete) {
        if (this.currentCalibrationPoint >= this.calibrationPoints.length) {
            this.completeCalibration(onComplete);
            return;
        }

        const point = this.calibrationPoints[this.currentCalibrationPoint];

        // Create calibration dot
        const dot = Utils.createElement('div', {
            class: 'calibration-dot',
            style: {
                position: 'absolute',
                left: `${point.x}px`,
                top: `${point.y}px`,
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: '#8b0000',
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.3s ease',
                animation: 'pulse 1s infinite'
            }
        });

        // Add pulse animation
        if (!document.getElementById('calibration-styles')) {
            const style = document.createElement('style');
            style.id = 'calibration-styles';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }

        // Click handler
        dot.addEventListener('click', async () => {
            // Record calibration point
            if (typeof webgazer !== 'undefined') {
                webgazer.recordScreenPosition(point.x, point.y);
            }

            // Visual feedback
            dot.style.background = '#00ff00';
            dot.style.transform = 'translate(-50%, -50%) scale(0.5)';

            await Utils.delay(300);
            dot.remove();

            this.currentCalibrationPoint++;
            await Utils.delay(500);

            this.showCalibrationPoint(container, onComplete);
        });

        container.appendChild(dot);
    },

    /**
     * Complete calibration
     */
    completeCalibration(onComplete) {
        Utils.log('Calibration complete');
        this.calibrated = true;

        const startButton = document.getElementById('start-experience');
        startButton.classList.remove('hidden');
        startButton.addEventListener('click', onComplete);
    },

    /**
     * Check if gaze is on an element
     */
    isGazeOnElement(element, threshold = 50) {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Utils.distance(
            { x: this.gazeData.x, y: this.gazeData.y },
            { x: centerX, y: centerY }
        );

        return distance < threshold;
    },

    /**
     * Check if gaze is in a rectangular area
     */
    isGazeInRect(rect) {
        return Utils.isPointInRect(this.gazeData, rect);
    },

    /**
     * Get current gaze position
     */
    getGazePosition() {
        return { ...this.gazeData };
    },

    /**
     * Show gaze indicator
     */
    showGazeIndicator() {
        if (this.gazeIndicator) {
            this.gazeIndicator.style.display = 'block';
        }
    },

    /**
     * Hide gaze indicator
     */
    hideGazeIndicator() {
        if (this.gazeIndicator) {
            this.gazeIndicator.style.display = 'none';
        }
    },

    /**
     * Pause eye tracking
     */
    pause() {
        if (typeof webgazer !== 'undefined') {
            webgazer.pause();
        }
    },

    /**
     * Resume eye tracking
     */
    resume() {
        if (typeof webgazer !== 'undefined') {
            webgazer.resume();
        }
    },

    /**
     * Stop eye tracking
     */
    stop() {
        if (typeof webgazer !== 'undefined') {
            webgazer.end();
        }
        this.initialized = false;
        this.calibrated = false;
    }
};

// Make EyeTracker globally accessible
window.EyeTracker = EyeTracker;
