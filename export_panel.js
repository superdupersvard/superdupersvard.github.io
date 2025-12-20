import { generateMap } from './generate_map.js';
import { hasExportArea } from './export_area.js';
import { getExportConfig, getLayerVisibility, setLayerVisibility, setState, subscribe } from './state_manager.js';

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
    document.getElementById('export-generate-map-btn').addEventListener('click', function(event) {
        hideExportPanel();
        generateMap();
    });

    // Checkbox to state mappings
    const checkboxStateMapping = {
        'exportTopo10': 'topo10Visible',
        'exportTilltrades': 'tilltradesforbud',
        'exportPlannedLogging': 'plannedLoggingVisible'
    };

    // Setup change listeners for all checkboxes
    Object.keys(checkboxStateMapping).forEach(checkboxId => {
        const checkbox = document.getElementById(checkboxId);
        const stateKey = checkboxStateMapping[checkboxId];
        
        if (checkbox) {
            checkbox.addEventListener('change', function(event) {
                setLayerVisibility(stateKey, event.target.checked);
            });
        }
    });

    document.getElementById('image-format').addEventListener('change', function(event) {
        setState('export.imageFormat', event.target.value);
    });
    document.getElementById('contour-interval').addEventListener('change', function(event) {
        setState('export.contourInterval', event.target.value);
    });

    // Subscribe to all layer state changes to update checkboxes
    subscribe((state, path, value) => {
        // Find checkbox that corresponds to this layer path
        const checkboxId = Object.keys(checkboxStateMapping).find(
            id => 'layers.' + checkboxStateMapping[id] === path
        );
        
        if (checkboxId) {
            const checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                checkbox.checked = value;
            }
        }
    }, 'layers');
});
