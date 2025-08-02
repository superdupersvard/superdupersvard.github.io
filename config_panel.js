export function showConfigPanel() {
    document.getElementById('config-panel').style.display = 'block';
}

export function hideConfigPanel() {
    document.getElementById('config-panel').style.display = 'none';
}

let config = {
    contour_interval: 10,
    topo10_path: false,
    osm_layers: []
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
    const osmLayers = document.getElementById('osm-layers').value.trim().split(/\s+/);

    setMapConfig({
        contour_interval: contourInterval,
        topo10_path: topo10Path,
        osm_layers: osmLayers
    });

    hideConfigPanel();
}