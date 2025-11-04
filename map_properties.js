import { setState, subscribe } from './state_manager.js';

export function updateStateFromDOM() {
    const northAlign = document.getElementById('north-align');
    const scaleSelect = document.getElementById('scale-select');
    const customScaleInput = document.getElementById('custom-scale');
    const paperSelect = document.getElementById('paper-select');
    const orientation = document.getElementById('orientation-select');
    
    if (northAlign) setState('map.magneticNorth', northAlign.value === 'magnetic');
    if (paperSelect) setState('map.paperSize', paperSelect.value);
    if (orientation) setState('map.orientation', orientation.value);
    
    if (scaleSelect) {
        if (scaleSelect.value === 'custom' && customScaleInput) {
            const val = parseInt(customScaleInput.value, 10);
            setState('map.scale', isNaN(val) ? 10000 : val);
        } else {
            setState('map.scale', parseInt(scaleSelect.value, 10));
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var northAlign = document.getElementById('north-align');
    var scaleSelect = document.getElementById('scale-select');
    var customScaleInput = document.getElementById('custom-scale');
    var paperSelect = document.getElementById('paper-select');
    var customScalePrefix = document.getElementById('custom-scale-prefix');
    var orientation = document.getElementById('orientation-select');

    [northAlign, scaleSelect, customScaleInput, paperSelect, orientation].forEach(function(ctrl) {
        if (ctrl) {
            ctrl.addEventListener('change', function() {
                updateStateFromDOM();
                document.dispatchEvent(new Event('rectanglePropertiesUpdate'));
            });
        }
    });

    if (customScaleInput) {
        customScaleInput.addEventListener('input', function() {
            updateStateFromDOM();
            document.dispatchEvent(new Event('rectanglePropertiesUpdate'));
        });
    }

    // Show/hide custom scale input
    if (scaleSelect) {
        scaleSelect.addEventListener('change', function() {
            if (scaleSelect.value === 'custom') {
                if (customScaleInput) customScaleInput.style.display = '';
                if (customScalePrefix) customScalePrefix.style.display = '';
            } else {
                if (customScaleInput) customScaleInput.style.display = 'none';
                if (customScalePrefix) customScalePrefix.style.display = 'none';
            }
        });
    }

    updateStateFromDOM();
});
