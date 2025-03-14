// Global variables
let timeLeft = 0;
let savedTime = 0;
let timerId = null;
let isPaused = false;
let startTime = 0;
let elapsedBeforePause = 0;

function formatDigits(number, padding) {
    return number.toString()
        .padStart(padding, '0')
        .split('')
        .map(d => `<span class="digit">${d}</span>`)
        .join('');
}

function startTimer() {
    if (timerId) clearInterval(timerId);
    
    if (!isPaused) {
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;
        timeLeft = ((minutes * 60) + seconds) * 1000;
        savedTime = timeLeft;
        document.getElementById('minutes').value = '';
        document.getElementById('seconds').value = '';
        elapsedBeforePause = 0;
    } else {
        timeLeft = savedTime;
    }
    
    if (timeLeft <= 0) return;
    
    const display = document.getElementById('display');
    startTime = Date.now();
    const initialTime = timeLeft;
    
    timerId = setInterval(() => {
        const currentElapsed = Date.now() - startTime;
        timeLeft = initialTime - currentElapsed;
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            display.innerHTML = `
                ${formatDigits(mins, 2)}:
                ${formatDigits(secs, 2)}.
                ${formatDigits(ms, 3)}
            `;
            return;
        }
        
        const mins = Math.floor(timeLeft / 60000);
        const secs = Math.floor((timeLeft % 60000) / 1000);
        const ms = timeLeft % 1000;
        
        display.innerHTML = `
            ${formatDigits(mins, 2)}:
            ${formatDigits(secs, 2)}.
            ${formatDigits(ms, 3)}
        `;
    }, 16); // Changed to 16ms for smoother animation (roughly 60fps)
}

function togglePause() {
    const pauseButton = document.querySelector('button:nth-child(2)');
    
    if (!timerId && !isPaused) return;
    
    if (isPaused) {
        isPaused = false;
        pauseButton.textContent = 'Pause';
        const remainingTime = savedTime;
        startTime = Date.now();
        
        timerId = setInterval(() => {
            const currentElapsed = Date.now() - startTime;
            timeLeft = remainingTime - currentElapsed;
            
            if (timeLeft <= 0) {
                clearInterval(timerId);
                timerId = null;
                display.innerHTML = `
                    ${formatDigits(mins, 2)}:
                    ${formatDigits(secs, 2)}.
                    ${formatDigits(ms, 3)}
                `;
                return;
            }
            
            const mins = Math.floor(timeLeft / 60000);
            const secs = Math.floor((timeLeft % 60000) / 1000);
            const ms = timeLeft % 1000;
            
            display.innerHTML = `
            ${formatDigits(mins, 2)}:
            ${formatDigits(secs, 2)}.
            ${formatDigits(ms, 3)}
            `;
        }, 16);
    } else {
        clearInterval(timerId);
        timerId = null;
        isPaused = true;
        savedTime = timeLeft;
        pauseButton.textContent = 'Resume';
    }
}

function resetTimer() {
    if (timerId) {
        clearInterval(timerId);
    }
    timerId = null;
    timeLeft = 0;
    isPaused = false;
    savedTime = 0;
    document.getElementById('minutes').value = '';
    document.getElementById('seconds').value = '';
    document.getElementById('display').innerHTML = `
        ${formatDigits(0, 2)}:
        ${formatDigits(0, 2)}.
        ${formatDigits(0, 3)}
    `;
    document.querySelector('button:nth-child(2)').textContent = 'Pause';
}

// Configuration options
const LASER_CONFIG = {
    particleCount: 100,   // Number of particles
    duration: 2000,       // Animation duration in ms
    colors: [             // Array of colors to use
        '#0066ff',        // Bright blue
        '#003399',        // Deep blue
        '#99ccff',        // Light blue
    ],
    spread: 200,          // Max distance particles can travel
    minSpeed: 1.0,        // Minimum particle speed multiplier
    maxSpeed: 3.0         // Maximum particle speed multiplier
};

function createLaserEffect(event) {
    const container = document.createElement('div');
    container.className = 'laser-container';
    document.body.appendChild(container);

    // Get button position for origin point
    const rect = event.target.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    container.style.left = originX + 'px';
    container.style.top = originY + 'px';

    // Create particles
    for (let i = 0; i < LASER_CONFIG.particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'laser laser-glow';
        
        // Random angle and distance
        const angle = (Math.random() * Math.PI * 2);
        const distance = Math.random() * LASER_CONFIG.spread;
        const speed = LASER_CONFIG.minSpeed + Math.random() * (LASER_CONFIG.maxSpeed - LASER_CONFIG.minSpeed);
        
        // Calculate end position
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        // Set random color
        particle.style.background = LASER_CONFIG.colors[Math.floor(Math.random() * LASER_CONFIG.colors.length)];
        
        // Set custom properties for animation
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        container.appendChild(particle);
    }

    // Cleanup after animation
    setTimeout(() => {
        container.remove();
    }, LASER_CONFIG.duration);
}