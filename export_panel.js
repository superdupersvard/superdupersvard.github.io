import { generateMap } from './generate_map.js';
import { hasExportArea } from './export_area.js';
import { getExportConfig, getLayerVisibility, setLayerVisibility, subscribe } from './state_manager.js';

function showExportPanel() {
    if (!hasExportArea()) {
        alert('Click on the map to set an export area first.');
        return;
    }

    const config = getExportConfig();

    // Populate form fields with current config values
    document.getElementById('image-format').value = config.imageFormat;
    document.getElementById('contour-interval').value = config.contourInterval;
    document.getElementById('exportTopo10').checked = getLayerVisibility('topo10Visible');
    document.getElementById('exportTilltrades').checked = getLayerVisibility('tilltradesforbud');
    document.getElementById('exportPlannedLogging').checked = getLayerVisibility('plannedLoggingVisible');

    document.getElementById('export-panel').style.display = 'block';
}

function hideExportPanel() {
    document.getElementById('export-panel').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generate-map-btn').addEventListener('click', showExportPanel);
    document.getElementById('export-cancel-btn').addEventListener('click', hideExportPanel);
    document.getElementById('export-generate-map-btn').addEventListener('click', generateMap);
    document.getElementById('exportTopo10').addEventListener('change', function(event) {
        setLayerVisibility('topo10Visible', event.target.checked);
    });
    document.getElementById('exportTilltrades').addEventListener('change', function(event) {
        setLayerVisibility('tilltradesforbud', event.target.checked);
    });
    document.getElementById('exportPlannedLogging').addEventListener('change', function(event) {
        setLayerVisibility('plannedLoggingVisible', event.target.checked);
    });

    // Subscribe to state changes to update the checkbox
    subscribe((state, path, value) => {
        if (path === 'layers.topo10Visible') {
            const checkbox = document.getElementById('exportTopo10');
            if (checkbox) {
                checkbox.checked = value;
            }
        }
    }, 'layers.topo10Visible');
});
