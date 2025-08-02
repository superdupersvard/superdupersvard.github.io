import { getExportArea, getDeclination } from './export_area.js';
import { getPaperSizeMeters, getSelectedScale } from './map_properties.js';
import { getMapConfig } from './config_panel.js';
import { getFormat } from './map_properties.js';
import { getBackendBaseUrl } from './server_settings.js';

export function generateMap() {
    document.getElementById('loading-indicator').style.display = 'block';
    
    var paperSize = getPaperSizeMeters();
    var paperSizeMM = paperSize.map(function(size) { return size * 1000; });
    var scale = getSelectedScale();
    var format = getFormat();

    var rect3857 = getExportArea();
    var minX = Math.min(rect3857[0][0], rect3857[1][0], rect3857[2][0], rect3857[3][0]);
    var maxX = Math.max(rect3857[0][0], rect3857[1][0], rect3857[2][0], rect3857[3][0]);
    var minY = Math.min(rect3857[0][1], rect3857[1][1], rect3857[2][1], rect3857[3][1]);
    var maxY = Math.max(rect3857[0][1], rect3857[1][1], rect3857[2][1], rect3857[3][1]);
    var boundary = [
        [minX, minY],
        [maxX, minY],
        [maxX, maxY],
        [minX, maxY]
    ];

    var data = {
        boundary: boundary,
        paper_size: paperSizeMM,
        scale: scale,
        declination: getDeclination(),
        format: format
    };

    const map_config = getMapConfig();
    data.contour_interval = map_config.contour_interval;
    data.topo10_path = map_config.topo10_path;
    //data.osmLayers = osmLayers;

    console.log('Map config:', map_config);

    const backendBaseUrl = getBackendBaseUrl();
    fetch(`${backendBaseUrl}/generate_map`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loading-indicator').style.display = 'none';

        if (data && data.image_url) {
            const imageUrl = `${backendBaseUrl}${data.image_url}`;
            window.open(imageUrl, '_blank');
        } else {
            alert('Map generation failed or no image returned.');
        }
    })
    .catch(() => {
        document.getElementById('loading-indicator').style.display = 'none';
        alert('Error contacting the map generation server.');
    });
}