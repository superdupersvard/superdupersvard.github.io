var northAlign = document.getElementById('north-align');
var scaleSelect = document.getElementById('scale-select');
var customScaleInput = document.getElementById('custom-scale');
var paperSelect = document.getElementById('paper-select');
var customScalePrefix = document.getElementById('custom-scale-prefix');
var formatSelect = document.getElementById('format-select');
var orientation = document.getElementById('orientation-select');

[northAlign, scaleSelect, customScaleInput, paperSelect, orientation].forEach(function(ctrl) {
    ctrl.addEventListener('change', function() {
        document.dispatchEvent(new Event('rectangleUpdate'));
    });
});

customScaleInput.addEventListener('input', function() {
    document.dispatchEvent(new Event('rectangleUpdate'));
});

// Show/hide custom scale input
scaleSelect.addEventListener('change', function() {
    if (scaleSelect.value === 'custom') {
        customScaleInput.style.display = '';
        customScalePrefix.style.display = '';
    } else {
        customScaleInput.style.display = 'none';
        customScalePrefix.style.display = 'none';
    }
});

export function isMagneticNorth() {
    return northAlign.value === 'magnetic';
}

// Get selected scale (as denominator, e.g. 7500 for 1:7500)
export function getSelectedScale() {
    if (scaleSelect.value === 'custom') {
        var val = parseInt(customScaleInput.value, 10);
        return isNaN(val) ? 10000 : val;
    }
    return parseInt(scaleSelect.value, 10);
}

// Get paper size in meters (width, height)
export function getPaperSizeMeters() {
    // Paper size in mm
    var sizes = {
        'A4': [297, 210],
        'A3': [420, 297],
        'A2': [594, 420]
    };
    var size = sizes[paperSelect.value] || sizes['A4'];
    //var orientation = document.getElementById('orientation-select').value;
    // Convert mm to meters and swap if portrait
    var width = size[0] / 1000;
    var height = size[1] / 1000;
    if (orientation.value === 'portrait') {
        // Swap width and height
        var tmp = width;
        width = height;
        height = tmp;
    }
    return [width, height];
}

export function getFormat() {
    return formatSelect.value;
}
