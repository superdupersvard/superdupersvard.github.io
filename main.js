import { showConfigPanel, hideConfigPanel, saveConfigFromPanel } from './config_panel.js';
import { getTrailLayer } from './map.js';
import { generateMap } from './generate_map.js';

document.getElementById('opacity').addEventListener('input', function(event) {
    var opacity = parseFloat(event.target.value);
    var overlayLayers = getTrailLayer().getLayers().getArray();
    overlayLayers.forEach(function(layer) {
        if (layer instanceof ol.layer.Vector) {
            layer.setOpacity(opacity);
        }
    });
});

function updateOpacitySliderVisibility() {
    var overlayLayers = getTrailLayer().getLayers().getArray();
    var show = overlayLayers.some(function(layer) {
        return layer instanceof ol.layer.Vector && layer.getVisible() &&
            ['MTB Trails', 'Hiking Trails', 'Bicycle Trails'].includes(layer.get('title'));
    });
    document.getElementById('opacity-slider').style.display = show ? '' : 'none';
}
updateOpacitySliderVisibility();

var overlayLayers = getTrailLayer().getLayers().getArray();
overlayLayers.forEach(function(layer) {
    if (['MTB Trails', 'Hiking Trails', 'Bicycle Trails'].includes(layer.get('title'))) {
        layer.on('change:visible', updateOpacitySliderVisibility);
    }
});



document.getElementById('generate-map-btn').addEventListener('click', generateMap);

document.getElementById('open-config-btn').onclick = showConfigPanel;

// Hide the panel when cancel is clicked
document.getElementById('config-cancel-btn').onclick = hideConfigPanel;

// Handle save: read values and use them in your app
document.getElementById('config-save-btn').onclick = saveConfigFromPanel;
