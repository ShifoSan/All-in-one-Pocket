// =================================
// TYPING SPEED TEST - FUNCTIONALITY
// =================================

// Sample texts for different difficulty levels
const textSamples = {
    easy: [
        "The quick brown fox jumps over the lazy dog. This is a simple test to help you practice typing.",
        "A journey of a thousand miles begins with a single step. Keep practicing every day to improve.",
        "Practice makes perfect. The more you type, the faster you will become at typing.",
        "Every expert was once a beginner. Start slow and focus on accuracy before speed.",
        "Life is like riding a bicycle. To keep your balance you must keep moving forward."
    ],
    medium: [
        "The advancement of technology has revolutionized the way we communicate and work. From smartphones to cloud computing, innovation continues to shape our daily lives.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. Winston Churchill spoke these words during a time of great challenge.",
        "In the digital age, typing skills have become essential for productivity. Whether you're writing emails, creating documents, or coding, speed and accuracy matter.",
        "The universe is under no obligation to make sense to you. Science continues to reveal mysteries about the cosmos that challenge our understanding of reality.",
        "Climate change represents one of the greatest challenges facing humanity. Sustainable practices and renewable energy sources are crucial for our planet's future."
    ],
    hard: [
        "Quantum mechanics describes the behavior of matter and energy at the atomic and subatomic levels, challenging our classical understanding of physics through principles like superposition and entanglement.",
        "Cryptocurrency and blockchain technology have disrupted traditional financial systems, introducing decentralized networks that enable peer-to-peer transactions without intermediaries or centralized authorities.",
        "Artificial intelligence and machine learning algorithms are transforming industries by analyzing vast datasets, recognizing patterns, and making predictions with unprecedented accuracy and efficiency.",
        "The philosophical concept of existentialism emphasizes individual freedom, choice, and responsibility, suggesting that humans define their own meaning in life through their actions and decisions.",
        "Neuroplasticity refers to the brain's ability to reorganize itself by forming new neural connections throughout life, enabling recovery from injury and adaptation to new experiences and learning."
    ]
};

// Global variables
let currentText = '';
let currentDifficulty = 'medium';
let testDuration = 60; // seconds
let timeRemaining = testDuration;
let timerInterval = null;
let isTestActive = false;
let startTime = null;
let charIndex = 0;
let correctChars = 0;
let incorrectChars = 0;
let totalCharsTyped = 0;

// DOM elements
const textDisplay = document.getElementById('textDisplay');
const typingInput = document.getElementById('typingInput');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const difficultyBtn = document.getElementById('difficultyBtn');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const cpmDisplay = document.getElementById('cpm');
const resultsCard = document.getElementById('resultsCard');
const shareBtn = document.getElementById('shareBtn');
const timeButtons = document.querySelectorAll('.time-btn');

// Initialize
function init() {
    setupEventListeners();
    displayText();
}

// Setup event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startTest);
    restartBtn.addEventListener('click', restartTest);
    difficultyBtn.addEventListener('click', changeDifficulty);
    typingInput.addEventListener('input', handleTyping);
    shareBtn.addEventListener('click', shareResults);
    
    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!isTestActive) {
                timeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                testDuration = parseInt(btn.dataset.time);
                timeRemaining = testDuration;
                updateTimer();
            }
        });
    });
}

// Display text with character spans
function displayText() {
    const texts = textSamples[currentDifficulty];
    currentText = texts[Math.floor(Math.random() * texts.length)];
    
    textDisplay.innerHTML = '';
    currentText.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.classList.add('char');
        span.textContent = char;
        span.dataset.index = index;
        textDisplay.appendChild(span);
    });
    
    if (textDisplay.children[0]) {
        textDisplay.children[0].classList.add('current');
    }
}

// Start test
function startTest() {
    isTestActive = true;
    startTime = Date.now();
    charIndex = 0;
    correctChars = 0;
    incorrectChars = 0;
    totalCharsTyped = 0;
    timeRemaining = testDuration;
    
    typingInput.disabled = false;
    typingInput.value = '';
    typingInput.focus();
    
    startBtn.disabled = true;
    restartBtn.disabled = false;
    difficultyBtn.disabled = true;
    
    resultsCard.style.display = 'none';
    
    startTimer();
    updateStats();
}

// Start timer
function startTimer() {
    updateTimer();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimer();
        
        if (timeRemaining <= 0) {
            endTest();
        }
    }, 1000);
}

// Update timer display
function updateTimer() {
    if (timeRemaining >= 60) {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes}m ${seconds}s`;
    } else {
        timerDisplay.textContent = `${timeRemaining}s`;
    }
}

// Handle typing
function handleTyping(e) {
    if (!isTestActive) return;
    
    const typedText = typingInput.value;
    const chars = textDisplay.querySelectorAll('.char');
    
    // Clear all current markers
    chars.forEach(char => {
        char.classList.remove('current', 'correct', 'incorrect');
    });
    
    // Reset counters
    correctChars = 0;
    incorrectChars = 0;
    
    // Mark characters
    for (let i = 0; i < typedText.length && i < currentText.length; i++) {
        if (typedText[i] === currentText[i]) {
            chars[i].classList.add('correct');
            correctChars++;
        } else {
            chars[i].classList.add('incorrect');
            incorrectChars++;
        }
    }
    
    // Mark current character
    if (typedText.length < currentText.length) {
        chars[typedText.length].classList.add('current');
    }
    
    totalCharsTyped = typedText.length;
    charIndex = typedText.length;
    
    // Check if test is complete
    if (typedText.length >= currentText.length) {
        endTest();
    }
    
    updateStats();
}

// Update statistics
function updateStats() {
    const elapsedTime = (Date.now() - startTime) / 1000 / 60; // minutes
    
    // Calculate WPM (words per minute)
    const wordsTyped = correctChars / 5; // Standard: 5 chars = 1 word
    const wpm = elapsedTime > 0 ? Math.round(wordsTyped / elapsedTime) : 0;
    wpmDisplay.textContent = Math.max(0, wpm);
    
    // Calculate accuracy
    const accuracy = totalCharsTyped > 0 
        ? Math.round((correctChars / totalCharsTyped) * 100) 
        : 100;
    accuracyDisplay.textContent = `${accuracy}%`;
    
    // Calculate CPM (characters per minute)
    const cpm = elapsedTime > 0 ? Math.round(correctChars / elapsedTime) : 0;
    cpmDisplay.textContent = Math.max(0, cpm);
}

// End test
function endTest() {
    isTestActive = false;
    clearInterval(timerInterval);
    
    typingInput.disabled = true;
    startBtn.disabled = false;
    restartBtn.disabled = true;
    difficultyBtn.disabled = false;
    
    showResults();
}

// Show results
function showResults() {
    const elapsedTime = (Date.now() - startTime) / 1000 / 60; // minutes
    
    // Calculate final stats
    const wordsTyped = correctChars / 5;
    const finalWpm = elapsedTime > 0 ? Math.round(wordsTyped / elapsedTime) : 0;
    const finalAccuracy = totalCharsTyped > 0 
        ? Math.round((correctChars / totalCharsTyped) * 100) 
        : 100;
    const finalCpm = elapsedTime > 0 ? Math.round(correctChars / elapsedTime) : 0;
    
    // Update results display
    document.getElementById('finalWpm').textContent = finalWpm;
    document.getElementById('finalAccuracy').textContent = `${finalAccuracy}%`;
    document.getElementById('finalCpm').textContent = finalCpm;
    document.getElementById('correctChars').textContent = correctChars;
    document.getElementById('incorrectChars').textContent = incorrectChars;
    document.getElementById('totalWords').textContent = Math.round(wordsTyped);
    
    // Determine performance rating
    const { icon, text, description } = getPerformanceRating(finalWpm, finalAccuracy);
    document.getElementById('ratingIcon').textContent = icon;
    document.getElementById('ratingText').textContent = text;
    document.getElementById('ratingDescription').textContent = description;
    
    // Show results card
    resultsCard.style.display = 'block';
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Get performance rating
function getPerformanceRating(wpm, accuracy) {
    let rating = {
        icon: '⭐',
        text: 'Good Job!',
        description: 'Keep practicing to improve your speed!'
    };
    
    if (accuracy < 80) {
        rating = {
            icon: '📚',
            text: 'Focus on Accuracy',
            description: 'Try to make fewer mistakes. Accuracy is more important than speed!'
        };
    } else if (wpm >= 81) {
        rating = {
            icon: '🏆',
            text: 'Expert Typist!',
            description: 'Exceptional! You have mastered the art of typing!'
        };
    } else if (wpm >= 61) {
        rating = {
            icon: '🎖️',
            text: 'Excellent Work!',
            description: 'Professional level typing! You are among the best!'
        };
    } else if (wpm >= 41) {
        rating = {
            icon: '🌟',
            text: 'Great Progress!',
            description: 'Above average! Your typing skills are solid!'
        };
    } else if (wpm >= 21) {
        rating = {
            icon: '👍',
            text: 'Nice Work!',
            description: 'You are making good progress. Keep it up!'
        };
    } else if (wpm > 0) {
        rating = {
            icon: '🌱',
            text: 'Keep Practicing!',
            description: 'Every expert started as a beginner. Stay consistent!'
        };
    }
    
    return rating;
}

// Restart test
function restartTest() {
    clearInterval(timerInterval);
    isTestActive = false;
    
    typingInput.value = '';
    typingInput.disabled = true;
    
    timeRemaining = testDuration;
    charIndex = 0;
    correctChars = 0;
    incorrectChars = 0;
    totalCharsTyped = 0;
    
    startBtn.disabled = false;
    restartBtn.disabled = true;
    difficultyBtn.disabled = false;
    
    resultsCard.style.display = 'none';
    
    displayText();
    updateTimer();
    
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    cpmDisplay.textContent = '0';
}

// Change difficulty
function changeDifficulty() {
    const difficulties = ['easy', 'medium', 'hard'];
    const currentIndex = difficulties.indexOf(currentDifficulty);
    const nextIndex = (currentIndex + 1) % difficulties.length;
    currentDifficulty = difficulties[nextIndex];
    
    // Update button text
    const difficultyNames = {
        easy: '⚙️ Easy',
        medium: '⚙️ Medium',
        hard: '⚙️ Hard'
    };
    difficultyBtn.textContent = difficultyNames[currentDifficulty];
    
    // Reset and display new text
    restartTest();
}

// Share results
function shareResults() {
    const wpm = document.getElementById('finalWpm').textContent;
    const accuracy = document.getElementById('finalAccuracy').textContent;
    const cpm = document.getElementById('finalCpm').textContent;
    
    const shareText = `🚀 I just completed a typing speed test!\n\n⚡ WPM: ${wpm}\n🎯 Accuracy: ${accuracy}\n✏️ CPM: ${cpm}\n\nTest your typing speed at All-in-one Pocket!`;
    
    // Try to use Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'My Typing Speed Test Results',
            text: shareText
        }).catch(err => console.log('Share cancelled'));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            const originalText = shareBtn.textContent;
            shareBtn.textContent = '✅ Copied to Clipboard!';
            setTimeout(() => {
                shareBtn.textContent = originalText;
            }, 2000);
        });
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', init);