import { getTrailLayer } from './map.js';
import './export_panel.js';
import './map_properties.js';

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
