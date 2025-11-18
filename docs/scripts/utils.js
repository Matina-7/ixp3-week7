/**
 * Utility Functions for Through the Window
 * Helper functions used across scenes and modules
 */

const Utils = {
    /**
     * Delay execution for a specified time
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise}
     */
    delay: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Linear interpolation between two values
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number}
     */
    lerp: (start, end, t) => {
        return start + (end - start) * t;
    },

    /**
     * Clamp a value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Calculate distance between two points
     * @param {Object} point1 - {x, y}
     * @param {Object} point2 - {x, y}
     * @returns {number}
     */
    distance: (point1, point2) => {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Check if a point is inside a rectangle
     * @param {Object} point - {x, y}
     * @param {Object} rect - {x, y, width, height}
     * @returns {boolean}
     */
    isPointInRect: (point, rect) => {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    },

    /**
     * Get random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    random: (min, max) => {
        return Math.random() * (max - min) + min;
    },

    /**
     * Get random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Choose random element from array
     * @param {Array} array - Array to choose from
     * @returns {*}
     */
    randomChoice: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Fade in an element
     * @param {HTMLElement} element - Element to fade in
     * @param {number} duration - Duration in milliseconds
     */
    fadeIn: async (element, duration = 300) => {
        element.style.opacity = '0';
        element.classList.remove('hidden');
        element.style.transition = `opacity ${duration}ms ease-in`;

        await Utils.delay(10); // Force reflow
        element.style.opacity = '1';

        await Utils.delay(duration);
    },

    /**
     * Fade out an element
     * @param {HTMLElement} element - Element to fade out
     * @param {number} duration - Duration in milliseconds
     */
    fadeOut: async (element, duration = 300) => {
        element.style.transition = `opacity ${duration}ms ease-out`;
        element.style.opacity = '0';

        await Utils.delay(duration);
        element.classList.add('hidden');
    },

    /**
     * Create a DOM element with attributes
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Attributes to set
     * @param {string} content - Inner HTML content
     * @returns {HTMLElement}
     */
    createElement: (tag, attributes = {}, content = '') => {
        const element = document.createElement(tag);

        Object.keys(attributes).forEach(key => {
            if (key === 'class') {
                element.className = attributes[key];
            } else if (key === 'style') {
                Object.assign(element.style, attributes[key]);
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });

        if (content) {
            element.innerHTML = content;
        }

        return element;
    },

    /**
     * Preload an image
     * @param {string} src - Image source URL
     * @returns {Promise<HTMLImageElement>}
     */
    preloadImage: (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    /**
     * Preload a video
     * @param {string} src - Video source URL
     * @returns {Promise<HTMLVideoElement>}
     */
    preloadVideo: (src) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.oncanplaythrough = () => resolve(video);
            video.onerror = reject;
            video.src = src;
            video.load();
        });
    },

    /**
     * Play sound effect
     * @param {string} src - Audio source URL
     * @param {number} volume - Volume (0-1)
     */
    playSound: (src, volume = 1.0) => {
        const audio = new Audio(src);
        audio.volume = volume;
        audio.play().catch(error => {
            console.warn('Sound playback failed:', error);
        });
    },

    /**
     * Format time as MM:SS
     * @param {number} seconds - Time in seconds
     * @returns {string}
     */
    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Debounce a function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function}
     */
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle a function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function}
     */
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Log with timestamp
     * @param {string} message - Message to log
     * @param {*} data - Additional data
     */
    log: (message, data = null) => {
        const timestamp = new Date().toISOString();
        if (data) {
            console.log(`[${timestamp}] ${message}`, data);
        } else {
            console.log(`[${timestamp}] ${message}`);
        }
    }
};

// Make Utils globally accessible
window.Utils = Utils;
