/**
 * Eye Tracker Module - WebGazer.js Integration
 * Real-time gaze tracking with stability control and duration detection
 * For the "Window" Interactive Narrative Project
 */

// Global state
let isTracking = false;
let gazeDataBuffer = []; // Sliding window for stability
const BUFFER_SIZE = 10; // Number of samples to average
const STABILITY_THRESHOLD = 50; // px variation threshold
const POLL_INTERVAL = 100; // ms between gaze checks
let pollTimer = null;
let gazeIndicator = null;
let watchedAreas = new Map(); // Track all watched areas

/**
 * Initialize and start the eye tracker
 * @param {Object} options - Configuration options
 * @param {boolean} options.showVideoPreview - Show webcam preview (default: false)
 * @param {boolean} options.smoothing - Enable smoothing (default: true)
 * @param {number} options.calibrationPoints - Number of calibration points (default: 9)
 * @returns {Promise<void>}
 */
export async function initEyeTracker(options = {}) {
    const config = {
        showVideoPreview: options.showVideoPreview || false,
        smoothing: options.smoothing !== undefined ? options.smoothing : true,
        calibrationPoints: options.calibrationPoints || 9
    };

    try {
        // Check if WebGazer is loaded
        if (typeof webgazer === 'undefined') {
            throw new Error('WebGazer.js is not loaded. Please include the library in your HTML.');
        }

        console.log('[EyeTracker] Initializing...');

        // Configure WebGazer
        webgazer
            .setGazeListener(null) // We'll poll manually for better control
            .saveDataAcrossSessions(true)
            .setRegression('ridge'); // Use ridge regression for better accuracy

        // Show or hide video preview
        if (config.showVideoPreview) {
            webgazer.showVideoPreview(true).showPredictionPoints(true);
        } else {
            webgazer.showVideoPreview(false).showPredictionPoints(false);
        }

        // Start WebGazer
        await webgazer.begin();

        // Wait a moment for initialization
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create gaze indicator
        createGazeIndicator();

        // Start polling for gaze data
        startGazePolling();

        isTracking = true;
        console.log('[EyeTracker] Initialized and running...');

        return true;
    } catch (error) {
        console.error('[EyeTracker] Initialization failed:', error);
        throw error;
    }
}

/**
 * Create visual indicator for gaze position
 */
function createGazeIndicator() {
    // Remove existing indicator if present
    if (gazeIndicator) {
        gazeIndicator.remove();
    }

    gazeIndicator = document.createElement('div');
    gazeIndicator.id = 'gaze-indicator';
    gazeIndicator.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 0, 0, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        display: none;
        transition: all 0.05s ease-out;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
    `;

    // Add inner dot
    const innerDot = document.createElement('div');
    innerDot.style.cssText = `
        width: 6px;
        height: 6px;
        background: rgba(255, 0, 0, 0.9);
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `;

    gazeIndicator.appendChild(innerDot);
    document.body.appendChild(gazeIndicator);
}

/**
 * Start polling for gaze data
 */
function startGazePolling() {
    let consecutiveFailures = 0;
    const MAX_FAILURES = 5;

    pollTimer = setInterval(async () => {
        try {
            const prediction = await webgazer.getCurrentPrediction();

            if (prediction && prediction.x && prediction.y) {
                consecutiveFailures = 0; // Reset failure counter

                const gazePoint = {
                    x: Math.round(prediction.x),
                    y: Math.round(prediction.y),
                    timestamp: Date.now()
                };

                // Add to buffer
                gazeDataBuffer.push(gazePoint);
                if (gazeDataBuffer.length > BUFFER_SIZE) {
                    gazeDataBuffer.shift(); // Remove oldest
                }

                // Get stable gaze point
                const stableGaze = getStableGazePoint();

                if (stableGaze) {
                    // Update visual indicator
                    updateGazeIndicator(stableGaze.x, stableGaze.y);

                    // Console output
                    console.log(`gaze: (${stableGaze.x}, ${stableGaze.y})`);

                    // Check all watched areas
                    checkWatchedAreas(stableGaze);
                }
            } else {
                consecutiveFailures++;

                if (consecutiveFailures >= MAX_FAILURES) {
                    console.warn('[EyeTracker] No face detected');
                    hideGazeIndicator();
                    // Reset all area timers
                    resetAllAreaTimers();
                }
            }
        } catch (error) {
            consecutiveFailures++;
            if (consecutiveFailures >= MAX_FAILURES) {
                console.error('[EyeTracker] Error getting prediction:', error);
            }
        }
    }, POLL_INTERVAL);
}

/**
 * Calculate stable gaze point from buffer using sliding window average
 * Only returns a point if variation is below threshold
 * @returns {Object|null} Stable gaze point {x, y} or null
 */
function getStableGazePoint() {
    if (gazeDataBuffer.length < 3) {
        return null; // Need at least 3 samples
    }

    // Calculate average
    const sum = gazeDataBuffer.reduce((acc, point) => ({
        x: acc.x + point.x,
        y: acc.y + point.y
    }), { x: 0, y: 0 });

    const avg = {
        x: sum.x / gazeDataBuffer.length,
        y: sum.y / gazeDataBuffer.length
    };

    // Calculate variation (standard deviation)
    const variance = gazeDataBuffer.reduce((acc, point) => ({
        x: acc.x + Math.pow(point.x - avg.x, 2),
        y: acc.y + Math.pow(point.y - avg.y, 2)
    }), { x: 0, y: 0 });

    const stdDev = {
        x: Math.sqrt(variance.x / gazeDataBuffer.length),
        y: Math.sqrt(variance.y / gazeDataBuffer.length)
    };

    // Check if stable (variation below threshold)
    const maxStdDev = Math.max(stdDev.x, stdDev.y);

    if (maxStdDev < STABILITY_THRESHOLD) {
        return {
            x: Math.round(avg.x),
            y: Math.round(avg.y),
            stable: true
        };
    }

    // Return average even if not stable, but mark as unstable
    return {
        x: Math.round(avg.x),
        y: Math.round(avg.y),
        stable: false
    };
}

/**
 * Update gaze indicator position
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
function updateGazeIndicator(x, y) {
    if (gazeIndicator) {
        gazeIndicator.style.display = 'block';
        gazeIndicator.style.left = `${x - 10}px`; // Center the indicator
        gazeIndicator.style.top = `${y - 10}px`;
    }
}

/**
 * Hide gaze indicator
 */
function hideGazeIndicator() {
    if (gazeIndicator) {
        gazeIndicator.style.display = 'none';
    }
}

/**
 * Watch a specific area for gaze duration
 * @param {string} areaId - Unique identifier for the area
 * @param {HTMLElement} element - DOM element to watch
 * @param {number} duration - Time in milliseconds to trigger (default: 6000)
 * @param {Function} callback - Function to call when duration is met
 * @returns {Object} Watch handle with stop() method
 */
export function watchArea(areaId, element, duration = 6000, callback) {
    if (!element) {
        console.error('[EyeTracker] Invalid element provided for watchArea');
        return null;
    }

    const watchData = {
        areaId,
        element,
        duration,
        callback,
        startTime: null,
        isGazing: false,
        hasTriggered: false,
        timer: null
    };

    watchedAreas.set(areaId, watchData);

    console.log(`[EyeTracker] Watching area #${areaId} (trigger after ${duration}ms)`);

    return {
        stop: () => stopWatchingArea(areaId)
    };
}

/**
 * Stop watching a specific area
 * @param {string} areaId - Area identifier
 */
function stopWatchingArea(areaId) {
    const watchData = watchedAreas.get(areaId);
    if (watchData) {
        if (watchData.timer) {
            clearTimeout(watchData.timer);
        }
        watchedAreas.delete(areaId);
        console.log(`[EyeTracker] Stopped watching area #${areaId}`);
    }
}

/**
 * Check if gaze is within watched areas
 * @param {Object} gazePoint - Current gaze coordinates {x, y}
 */
function checkWatchedAreas(gazePoint) {
    watchedAreas.forEach((watchData, areaId) => {
        const rect = watchData.element.getBoundingClientRect();

        // Check if gaze is within element bounds
        const isInside = (
            gazePoint.x > rect.left &&
            gazePoint.x < rect.right &&
            gazePoint.y > rect.top &&
            gazePoint.y < rect.bottom
        );

        if (isInside && gazePoint.stable) {
            // User is gazing at the area with stable gaze
            if (!watchData.isGazing) {
                // Just started gazing
                watchData.isGazing = true;
                watchData.startTime = Date.now();

                console.log(`[EyeTracker] Started gazing at area #${areaId}`);

                // Set timer to trigger callback
                watchData.timer = setTimeout(() => {
                    if (watchData.isGazing && !watchData.hasTriggered) {
                        watchData.hasTriggered = true;
                        const actualDuration = Date.now() - watchData.startTime;
                        console.log(`[EyeTracker] User fixated on area #${areaId} for ${actualDuration}ms`);

                        // Execute callback
                        if (typeof watchData.callback === 'function') {
                            watchData.callback(areaId, actualDuration);
                        }
                    }
                }, watchData.duration);
            }
        } else {
            // User is not gazing at the area or gaze is unstable
            if (watchData.isGazing) {
                // Just stopped gazing
                const gazeDuration = Date.now() - watchData.startTime;
                console.log(`[EyeTracker] Stopped gazing at area #${areaId} (gazed for ${gazeDuration}ms)`);

                // Reset
                watchData.isGazing = false;
                watchData.startTime = null;

                if (watchData.timer) {
                    clearTimeout(watchData.timer);
                    watchData.timer = null;
                }
            }
        }
    });
}

/**
 * Reset all area timers (called when face is lost)
 */
function resetAllAreaTimers() {
    watchedAreas.forEach((watchData) => {
        if (watchData.timer) {
            clearTimeout(watchData.timer);
            watchData.timer = null;
        }
        watchData.isGazing = false;
        watchData.startTime = null;
    });
}

/**
 * Stop the eye tracker
 */
export function stopEyeTracker() {
    if (!isTracking) {
        console.log('[EyeTracker] Already stopped');
        return;
    }

    console.log('[EyeTracker] Stopping...');

    // Stop polling
    if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
    }

    // Clear all watched areas
    watchedAreas.forEach((watchData, areaId) => {
        stopWatchingArea(areaId);
    });
    watchedAreas.clear();

    // Hide indicator
    if (gazeIndicator) {
        gazeIndicator.remove();
        gazeIndicator = null;
    }

    // Stop WebGazer
    if (typeof webgazer !== 'undefined') {
        webgazer.end();
    }

    // Clear buffer
    gazeDataBuffer = [];

    isTracking = false;
    console.log('[EyeTracker] Tracking has stopped.');
}

/**
 * Pause eye tracking (keeps WebGazer running but stops processing)
 */
export function pauseEyeTracker() {
    if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
    }
    hideGazeIndicator();
    console.log('[EyeTracker] Paused');
}

/**
 * Resume eye tracking
 */
export function resumeEyeTracker() {
    if (isTracking && !pollTimer) {
        startGazePolling();
        console.log('[EyeTracker] Resumed');
    }
}

/**
 * Trigger WebGazer calibration
 * Requires user interaction with calibration points
 */
export function startCalibration() {
    console.log('[EyeTracker] Starting calibration...');
    console.log('[EyeTracker] Look at each point and click when ready');

    // Create calibration overlay
    const calibrationOverlay = document.createElement('div');
    calibrationOverlay.id = 'calibration-overlay';
    calibrationOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 20000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `;

    const instructions = document.createElement('div');
    instructions.style.cssText = `
        color: #00ff00;
        font-size: 24px;
        margin-bottom: 40px;
        text-align: center;
        font-family: 'Courier New', monospace;
    `;
    instructions.innerHTML = `
        <div>EYE TRACKER CALIBRATION</div>
        <div style="font-size: 16px; margin-top: 20px;">Click each point as you look at it</div>
    `;

    const pointsContainer = document.createElement('div');
    pointsContainer.style.cssText = `
        position: relative;
        width: 80%;
        height: 60%;
    `;

    // Create 9 calibration points in a 3x3 grid
    const positions = [
        { x: '10%', y: '10%' },
        { x: '50%', y: '10%' },
        { x: '90%', y: '10%' },
        { x: '10%', y: '50%' },
        { x: '50%', y: '50%' },
        { x: '90%', y: '50%' },
        { x: '10%', y: '90%' },
        { x: '50%', y: '90%' },
        { x: '90%', y: '90%' }
    ];

    let currentPoint = 0;

    positions.forEach((pos, index) => {
        const point = document.createElement('div');
        point.className = 'calibration-point';
        point.style.cssText = `
            position: absolute;
            width: 30px;
            height: 30px;
            background: #ff0000;
            border: 3px solid #fff;
            border-radius: 50%;
            left: ${pos.x};
            top: ${pos.y};
            transform: translate(-50%, -50%);
            cursor: pointer;
            transition: all 0.3s;
            opacity: ${index === 0 ? '1' : '0.3'};
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
        `;

        point.addEventListener('click', async function() {
            // Record click for WebGazer
            await webgazer.watchListener(this, true);

            this.style.background = '#00ff00';
            this.style.borderColor = '#00ff00';
            this.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8)';

            setTimeout(() => {
                currentPoint++;
                if (currentPoint < positions.length) {
                    // Activate next point
                    pointsContainer.children[currentPoint + 1].style.opacity = '1';
                } else {
                    // Calibration complete
                    setTimeout(() => {
                        calibrationOverlay.remove();
                        console.log('[EyeTracker] Calibration complete!');
                    }, 500);
                }
            }, 300);
        });

        pointsContainer.appendChild(point);
    });

    calibrationOverlay.appendChild(instructions);
    calibrationOverlay.appendChild(pointsContainer);
    document.body.appendChild(calibrationOverlay);
}

/**
 * Get current tracking status
 * @returns {boolean} Whether tracking is active
 */
export function isTrackingActive() {
    return isTracking;
}

/**
 * Get current gaze position
 * @returns {Object|null} Current gaze point {x, y, stable} or null
 */
export function getCurrentGaze() {
    return getStableGazePoint();
}

// Export utility functions for advanced usage
export {
    BUFFER_SIZE,
    STABILITY_THRESHOLD,
    POLL_INTERVAL
};
