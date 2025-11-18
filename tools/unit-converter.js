// Unit Converter - All-in-one Pocket
// Made by ShifoSan

// Conversion data for different categories
const conversionData = {
    length: {
        name: 'Length',
        units: {
            meter: { name: 'Meter (m)', factor: 1 },
            kilometer: { name: 'Kilometer (km)', factor: 0.001 },
            centimeter: { name: 'Centimeter (cm)', factor: 100 },
            millimeter: { name: 'Millimeter (mm)', factor: 1000 },
            mile: { name: 'Mile (mi)', factor: 0.000621371 },
            yard: { name: 'Yard (yd)', factor: 1.09361 },
            foot: { name: 'Foot (ft)', factor: 3.28084 },
            inch: { name: 'Inch (in)', factor: 39.3701 },
            nauticalMile: { name: 'Nautical Mile', factor: 0.000539957 }
        }
    },
    weight: {
        name: 'Weight',
        units: {
            kilogram: { name: 'Kilogram (kg)', factor: 1 },
            gram: { name: 'Gram (g)', factor: 1000 },
            milligram: { name: 'Milligram (mg)', factor: 1000000 },
            ton: { name: 'Metric Ton (t)', factor: 0.001 },
            pound: { name: 'Pound (lb)', factor: 2.20462 },
            ounce: { name: 'Ounce (oz)', factor: 35.274 },
            stone: { name: 'Stone (st)', factor: 0.157473 }
        }
    },
    temperature: {
        name: 'Temperature',
        units: {
            celsius: { name: 'Celsius (°C)' },
            fahrenheit: { name: 'Fahrenheit (°F)' },
            kelvin: { name: 'Kelvin (K)' }
        }
    },
    volume: {
        name: 'Volume',
        units: {
            liter: { name: 'Liter (L)', factor: 1 },
            milliliter: { name: 'Milliliter (mL)', factor: 1000 },
            cubicMeter: { name: 'Cubic Meter (m³)', factor: 0.001 },
            gallon: { name: 'Gallon (gal)', factor: 0.264172 },
            quart: { name: 'Quart (qt)', factor: 1.05669 },
            pint: { name: 'Pint (pt)', factor: 2.11338 },
            cup: { name: 'Cup', factor: 4.22675 },
            fluidOunce: { name: 'Fluid Ounce (fl oz)', factor: 33.814 }
        }
    },
    area: {
        name: 'Area',
        units: {
            squareMeter: { name: 'Square Meter (m²)', factor: 1 },
            squareKilometer: { name: 'Square Kilometer (km²)', factor: 0.000001 },
            squareMile: { name: 'Square Mile (mi²)', factor: 0.000000386102 },
            squareYard: { name: 'Square Yard (yd²)', factor: 1.19599 },
            squareFoot: { name: 'Square Foot (ft²)', factor: 10.7639 },
            acre: { name: 'Acre', factor: 0.000247105 },
            hectare: { name: 'Hectare (ha)', factor: 0.0001 }
        }
    },
    speed: {
        name: 'Speed',
        units: {
            mps: { name: 'Meter/Second (m/s)', factor: 1 },
            kph: { name: 'Kilometer/Hour (km/h)', factor: 3.6 },
            mph: { name: 'Mile/Hour (mph)', factor: 2.23694 },
            knot: { name: 'Knot (kn)', factor: 1.94384 },
            fps: { name: 'Foot/Second (ft/s)', factor: 3.28084 }
        }
    }
};

// Current category
let currentCategory = 'length';

// DOM Elements
const categoryButtons = document.querySelectorAll('.category-btn');
const fromValueInput = document.getElementById('fromValue');
const toValueInput = document.getElementById('toValue');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const swapBtn = document.getElementById('swapBtn');
const resultText = document.getElementById('resultText');
const quickConversions = document.getElementById('quickConversions');

// Initialize
initialize();

function initialize() {
    // Set up category buttons
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            updateUnitSelects();
            convert();
        });
    });

    // Set up unit selects
    updateUnitSelects();

    // Set up event listeners
    fromValueInput.addEventListener('input', convert);
    fromUnitSelect.addEventListener('change', convert);
    toUnitSelect.addEventListener('change', convert);
    swapBtn.addEventListener('click', swapUnits);

    // Initial conversion
    convert();
}

function updateUnitSelects() {
    const units = conversionData[currentCategory].units;
    
    // Clear existing options
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    
    // Add new options
    Object.keys(units).forEach(unitKey => {
        const option1 = document.createElement('option');
        option1.value = unitKey;
        option1.textContent = units[unitKey].name;
        fromUnitSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = unitKey;
        option2.textContent = units[unitKey].name;
        toUnitSelect.appendChild(option2);
    });
    
    // Set default selections
    const unitKeys = Object.keys(units);
    fromUnitSelect.value = unitKeys[0];
    toUnitSelect.value = unitKeys[1] || unitKeys[0];
}

function convert() {
    const fromValue = parseFloat(fromValueInput.value) || 0;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    
    let result;
    
    if (currentCategory === 'temperature') {
        result = convertTemperature(fromValue, fromUnit, toUnit);
    } else {
        result = convertStandard(fromValue, fromUnit, toUnit);
    }
    
    toValueInput.value = result.toFixed(6).replace(/\.?0+$/, '');
    
    updateResultDisplay(fromValue, fromUnit, result, toUnit);
    updateQuickConversions(fromValue, fromUnit);
}

function convertStandard(value, fromUnit, toUnit) {
    const units = conversionData[currentCategory].units;
    const fromFactor = units[fromUnit].factor;
    const toFactor = units[toUnit].factor;
    
    // Convert to base unit, then to target unit
    const baseValue = value / fromFactor;
    return baseValue * toFactor;
}

function convertTemperature(value, fromUnit, toUnit) {
    // Convert to Celsius first
    let celsius;
    
    switch(fromUnit) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
    }
    
    // Convert from Celsius to target unit
    let result;
    switch(toUnit) {
        case 'celsius':
            result = celsius;
            break;
        case 'fahrenheit':
            result = (celsius * 9/5) + 32;
            break;
        case 'kelvin':
            result = celsius + 273.15;
            break;
    }
    
    return result;
}

function swapUnits() {
    const tempUnit = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = tempUnit;
    
    const tempValue = fromValueInput.value;
    fromValueInput.value = toValueInput.value;
    
    convert();
}

function updateResultDisplay(fromValue, fromUnit, toValue, toUnit) {
    const units = conversionData[currentCategory].units;
    const fromUnitName = units[fromUnit].name;
    const toUnitName = units[toUnit].name;
    
    const displayFrom = fromValue.toFixed(4).replace(/\.?0+$/, '');
    const displayTo = toValue.toFixed(4).replace(/\.?0+$/, '');
    
    resultText.textContent = `${displayFrom} ${fromUnitName} = ${displayTo} ${toUnitName}`;
}

function updateQuickConversions(value, fromUnit) {
    const units = conversionData[currentCategory].units;
    quickConversions.innerHTML = '';
    
    // Show conversions to other units
    Object.keys(units).forEach(unitKey => {
        if (unitKey === fromUnit) return;
        
        let result;
        if (currentCategory === 'temperature') {
            result = convertTemperature(value, fromUnit, unitKey);
        } else {
            result = convertStandard(value, fromUnit, unitKey);
        }
        
        const quickItem = document.createElement('div');
        quickItem.className = 'quick-item';
        quickItem.innerHTML = `
            <div class="quick-value">${result.toFixed(4).replace(/\.?0+$/, '')}</div>
            <div class="quick-unit">${units[unitKey].name}</div>
        `;
        quickConversions.appendChild(quickItem);
    });
}