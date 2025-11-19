// Percentage Calculator - All-in-one Pocket
// Made by ShifoSan

// DOM Elements
const modeButtons = document.querySelectorAll('.mode-btn');
const calcModes = document.querySelectorAll('.calc-mode');

// Mode 1: What is X% of Y?
const percent1 = document.getElementById('percent1');
const number1 = document.getElementById('number1');
const result1 = document.getElementById('result1');

// Mode 2: X is what percent of Y?
const number2a = document.getElementById('number2a');
const number2b = document.getElementById('number2b');
const result2 = document.getElementById('result2');

// Mode 3: Percentage Change
const original = document.getElementById('original');
const newValue = document.getElementById('new');
const result3 = document.getElementById('result3');

// Initialize
initialize();

function initialize() {
    // Mode switching
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            switchMode(mode);
        });
    });

    // Mode 1 calculations
    percent1.addEventListener('input', calculateMode1);
    number1.addEventListener('input', calculateMode1);

    // Mode 2 calculations
    number2a.addEventListener('input', calculateMode2);
    number2b.addEventListener('input', calculateMode2);

    // Mode 3 calculations
    original.addEventListener('input', calculateMode3);
    newValue.addEventListener('input', calculateMode3);

    // Initial calculations
    calculateMode1();
    calculateMode2();
    calculateMode3();
}

function switchMode(mode) {
    // Update buttons
    modeButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });

    // Update mode displays
    calcModes.forEach(modeDiv => {
        modeDiv.classList.remove('active');
    });

    const activeMode = document.getElementById(`mode-${mode}`);
    if (activeMode) {
        activeMode.classList.add('active');
    }
}

function calculateMode1() {
    const percent = parseFloat(percent1.value) || 0;
    const number = parseFloat(number1.value) || 0;
    
    const result = (percent / 100) * number;
    result1.textContent = formatNumber(result);
}

function calculateMode2() {
    const numA = parseFloat(number2a.value) || 0;
    const numB = parseFloat(number2b.value) || 0;
    
    if (numB === 0) {
        result2.textContent = '0%';
        return;
    }
    
    const result = (numA / numB) * 100;
    result2.textContent = formatNumber(result) + '%';
}

function calculateMode3() {
    const originalVal = parseFloat(original.value) || 0;
    const newVal = parseFloat(newValue.value) || 0;
    
    if (originalVal === 0) {
        result3.textContent = '0%';
        return;
    }
    
    const change = ((newVal - originalVal) / originalVal) * 100;
    const sign = change >= 0 ? '+' : '';
    result3.textContent = sign + formatNumber(change) + '%';
    
    // Color based on increase/decrease
    if (change > 0) {
        result3.style.color = '#00FF00';
    } else if (change < 0) {
        result3.style.color = '#FF0000';
    } else {
        result3.style.color = '#00FFFF';
    }
}

function formatNumber(num) {
    // Round to 2 decimal places and remove trailing zeros
    return parseFloat(num.toFixed(2)).toString();
}