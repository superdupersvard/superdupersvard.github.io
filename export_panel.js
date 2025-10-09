import { generateMap } from './generate_map.js';

function showExportPanel() {
    // Populate form fields with current config values
    document.getElementById('image-format').value = config.image_format;
    document.getElementById('contour-interval').value = config.contour_interval;
    document.getElementById('topo10-path').checked = config.topo10_path;
    
    document.getElementById('export-panel').style.display = 'block';
}

function hideExportPanel() {
    document.getElementById('export-panel').style.display = 'none';
}

let config = {
    image_format: 'png',
    contour_interval: 5,
    topo10_path: true,
};

function saveConfig() {
    const imageFormat = document.getElementById('image-format').value;
    const contourInterval = document.getElementById('contour-interval').value;
    const topo10Path = document.getElementById('topo10-path').checked;

    config = {
        image_format: imageFormat,
        contour_interval: contourInterval,
        topo10_path: topo10Path
    };

    hideExportPanel();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generate-map-btn').addEventListener('click', showExportPanel);
    document.getElementById('export-cancel-btn').addEventListener('click', hideExportPanel);
    document.getElementById('export-generate-map-btn').addEventListener('click', function() {
        saveConfig();
        generateMap(config);
    });
});
