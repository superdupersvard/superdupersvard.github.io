export function showConfigPanel() {
    // Populate form fields with current config values
    document.getElementById('contour-interval').value = config.contour_interval;
    document.getElementById('topo10-path').checked = config.topo10_path;
    
    document.getElementById('config-panel').style.display = 'block';
}

export function hideConfigPanel() {
    document.getElementById('config-panel').style.display = 'none';
}

let config = {
    contour_interval: 5,
    topo10_path: true,
};

export function setMapConfig(newConfig) {
    config = { ...config, ...newConfig };
    console.log('Map config updated:', config);
}

export function getMapConfig() {
    return { ...config }; // Return a copy to prevent external mutation
}

export function saveConfigFromPanel() {
    const contourInterval = document.getElementById('contour-interval').value;
    const topo10Path = document.getElementById('topo10-path').checked;

    setMapConfig({
        contour_interval: contourInterval,
        topo10_path: topo10Path
    });

    hideConfigPanel();
}