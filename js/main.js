// Import Eye Tracker Module
import { initEyeTracker, watchArea, stopEyeTracker, startCalibration } from '../scripts/eyeTracker.js';

// Global State
let currentStage = 0;
let cameraActive = false;
let invasionStarted = false;
let eyeTrackerReady = false;

// Narrative Stages
const narrativeStages = [
    {
        delay: 3000,
        text: "Welcome to the monitoring system. You are now observing four locations.",
        duration: 4000
    },
    {
        delay: 8000,
        text: "Watch carefully. Something interesting might happen...",
        duration: 4000
    },
    {
        delay: 13000,
        text: "CAM-04 appears to be offline. Attempting to reconnect...",
        duration: 4000,
        action: () => activateUserCamera()
    },
    {
        delay: 20000,
        text: "Connection established. But wait... that camera looks different.",
        duration: 5000
    },
    {
        delay: 27000,
        text: "Who is that in CAM-04?",
        duration: 4000
    },
    {
        delay: 33000,
        text: "That's... you.",
        duration: 4000
    },
    {
        delay: 39000,
        text: "Did you really think you were just watching?",
        duration: 5000,
        action: () => startWarnings()
    },
    {
        delay: 46000,
        text: "We've been watching you this entire time.",
        duration: 5000,
        action: () => startGlitch()
    },
    {
        delay: 53000,
        text: "And now, it's time for you to see the truth.",
        duration: 5000,
        action: () => startInvasion()
    }
];

// Terminal Messages for System Invasion
const terminalMessages = [
    { text: "INITIALIZING SYSTEM ACCESS...", type: "normal", delay: 500 },
    { text: "ESTABLISHING CONNECTION TO HOST...", type: "normal", delay: 800 },
    { text: "CONNECTION ESTABLISHED", type: "normal", delay: 1200 },
    { text: "", type: "normal", delay: 1500 },
    { text: "ACCESSING CAMERA FEED...", type: "normal", delay: 2000 },
    { text: "CAMERA ACCESS: GRANTED", type: "normal", delay: 2500 },
    { text: "MICROPHONE ACCESS: GRANTED", type: "warning", delay: 3000 },
    { text: "LOCATION DATA: ACQUIRED", type: "warning", delay: 3500 },
    { text: "", type: "normal", delay: 4000 },
    { text: "RETRIEVING USER DATA...", type: "normal", delay: 4500 },
    { text: "IP ADDRESS: " + generateFakeIP(), type: "normal", delay: 5000 },
    { text: "BROWSER: " + navigator.userAgent.split(' ').slice(0, 3).join(' '), type: "normal", delay: 5500 },
    { text: "SCREEN RESOLUTION: " + window.screen.width + "x" + window.screen.height, type: "normal", delay: 6000 },
    { text: "LOCAL TIME: " + new Date().toLocaleString(), type: "normal", delay: 6500 },
    { text: "", type: "normal", delay: 7000 },
    { text: "WARNING: UNAUTHORIZED ACCESS DETECTED", type: "error", delay: 7500 },
    { text: "ERROR: SYSTEM INTEGRITY COMPROMISED", type: "error", delay: 8000 },
    { text: "ERROR: FIREWALL BREACH", type: "error", delay: 8500 },
    { text: "", type: "normal", delay: 9000 },
    { text: "PRIVACY IS AN ILLUSION", type: "error", delay: 9500 },
    { text: "YOU ARE ALWAYS BEING WATCHED", type: "error", delay: 10000 },
    { text: "", type: "normal", delay: 10500 },
    { text: "INITIATING SYSTEM COLLAPSE...", type: "error", delay: 11000 }
];

// Initialize
async function init() {
    updateTime();
    setInterval(updateTime, 1000);

    // Initialize Eye Tracker
    try {
        await initEyeTracker({ showVideoPreview: false });
        eyeTrackerReady = true;
        console.log("[Main] Eye Tracker ready");

        // Example: Listen to the first feed window
        const feed1 = document.querySelector('.feed-window:nth-child(1)');
        if (feed1) {
            watchArea('feed1', feed1, 6000, (areaId, duration) => {
                // Create narrative overlay with special message
                showNarrative("It's watching you back.", 4000);

                // Add visual effect to the watched feed
                feed1.style.borderColor = '#ff0000';
                feed1.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.8)';

                // Optional: Trigger alert
                setTimeout(() => {
                    alert("It's watching you back.");
                }, 500);
            });
        }
    } catch (error) {
        console.error("[Main] Eye Tracker initialization failed:", error);
        console.log("[Main] Continuing without eye tracking...");
    }

    // Start narrative progression
    narrativeStages.forEach(stage => {
        setTimeout(() => {
            showNarrative(stage.text, stage.duration);
            if (stage.action) {
                stage.action();
            }
        }, stage.delay);
    });

    // Trigger final collapse
    setTimeout(() => {
        systemCollapse();
    }, 55000);
}

// Update Time Display
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    const dateString = now.toLocaleDateString('en-US');

    document.getElementById('currentTime').textContent = `${dateString} ${timeString}`;

    // Update all camera timestamps
    document.querySelectorAll('.timestamp').forEach(ts => {
        ts.textContent = timeString;
    });
}

// Show Narrative Text
function showNarrative(text, duration) {
    const overlay = document.getElementById('narrative-overlay');
    const textElement = document.getElementById('narrative-text');

    textElement.textContent = text;
    overlay.classList.add('active');

    setTimeout(() => {
        overlay.classList.remove('active');
    }, duration);
}

// Activate User Camera
function activateUserCamera() {
    const video = document.getElementById('userCamera');
    const feed4 = document.getElementById('feed4');
    const label = feed4.querySelector('.camera-label');

    // Change label with glitch effect
    setTimeout(() => {
        label.textContent = 'CAM-04 // RECONNECTING...';
    }, 1000);

    setTimeout(() => {
        label.textContent = 'CAM-04 // YOUR LOCATION';
        label.style.color = '#ff0000';
        label.style.background = 'rgba(255, 0, 0, 0.2)';
    }, 3000);

    // Request camera access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(stream => {
                video.srcObject = stream;
                setTimeout(() => {
                    video.classList.add('active');
                    cameraActive = true;
                }, 2000);
            })
            .catch(err => {
                console.log('Camera access denied or unavailable');
                // Fallback: show error message in feed
                const scene = feed4.querySelector('.camera-scene');
                scene.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ff0000; font-size: 14px; text-align: center; padding: 20px;">CAMERA ACCESS REQUIRED<br>FOR FULL EXPERIENCE</div>';
            });
    }
}

// Start Warning Messages
function startWarnings() {
    const container = document.getElementById('warning-container');

    const warnings = [
        'UNAUTHORIZED ACCESS DETECTED',
        'SECURITY BREACH IN PROGRESS',
        'SYSTEM ALERT: INTRUSION DETECTED',
        'WARNING: YOU ARE BEING MONITORED'
    ];

    warnings.forEach((warning, index) => {
        setTimeout(() => {
            const warningDiv = document.createElement('div');
            warningDiv.className = 'warning-message';
            warningDiv.textContent = warning;
            container.appendChild(warningDiv);

            // Remove after 3 seconds
            setTimeout(() => {
                warningDiv.remove();
            }, 3000);
        }, index * 1000);
    });
}

// Start Glitch Effect
function startGlitch() {
    const glitchOverlay = document.getElementById('glitch-overlay');
    glitchOverlay.classList.add('active');

    // Make status indicator red
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.getElementById('statusText');
    statusIndicator.classList.remove('active');
    statusText.textContent = 'COMPROMISED';
    statusText.style.color = '#ff0000';

    // Corrupt random camera feeds
    const feeds = document.querySelectorAll('.camera-feed');
    feeds.forEach((feed, index) => {
        setTimeout(() => {
            if (Math.random() > 0.5) {
                feed.classList.add('corrupted');
            }
            if (Math.random() > 0.7) {
                feed.classList.add('inverted');
            }
        }, index * 500);
    });
}

// Start System Invasion
function startInvasion() {
    invasionStarted = true;
    const terminal = document.getElementById('terminal-overlay');
    const content = document.getElementById('terminal-content');

    terminal.classList.add('active');
    content.innerHTML = '';

    // Display terminal messages sequentially
    terminalMessages.forEach((msg, index) => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            if (msg.type === 'error') {
                line.classList.add('error');
            } else if (msg.type === 'warning') {
                line.classList.add('warning');
            }
            line.textContent = '> ' + msg.text;
            content.appendChild(line);

            // Auto scroll to bottom
            content.scrollTop = content.scrollHeight;

            // Add cursor at the end
            if (index === terminalMessages.length - 1) {
                const cursor = document.createElement('span');
                cursor.className = 'terminal-cursor';
                content.appendChild(cursor);
            }
        }, msg.delay);
    });
}

// System Collapse
function systemCollapse() {
    const terminal = document.getElementById('terminal-overlay');
    const feeds = document.querySelectorAll('.camera-feed');
    const header = document.getElementById('system-header');
    const finalMessage = document.getElementById('final-message');

    // Intensify glitch
    feeds.forEach((feed, index) => {
        setTimeout(() => {
            feed.classList.add('collapsed');
        }, index * 300);
    });

    // Collapse terminal and header
    setTimeout(() => {
        terminal.style.animation = 'collapse 1s forwards';
        header.style.animation = 'collapse 1s forwards';
    }, 1500);

    // Show final message
    setTimeout(() => {
        finalMessage.classList.add('active');
    }, 3000);

    // Optional: Reset after final message
    setTimeout(() => {
        if (confirm('Experience complete. Restart?')) {
            location.reload();
        }
    }, 10000);
}

// Close Terminal (disabled during invasion)
function closeTerminal() {
    if (!invasionStarted) {
        document.getElementById('terminal-overlay').classList.remove('active');
    }
}

// Generate Fake IP for effect
function generateFakeIP() {
    return Math.floor(Math.random() * 255) + '.' +
           Math.floor(Math.random() * 255) + '.' +
           Math.floor(Math.random() * 255) + '.' +
           Math.floor(Math.random() * 255);
}

// Eye Tracker Control Functions (accessible from console)
window.eyeTracker = {
    calibrate: startCalibration,
    stop: stopEyeTracker,
    isReady: () => eyeTrackerReady
};

// Start on page load
window.addEventListener('load', init);

// Prevent closing terminal during invasion
document.addEventListener('keydown', (e) => {
    if (invasionStarted && e.key === 'Escape') {
        e.preventDefault();
    }
});
