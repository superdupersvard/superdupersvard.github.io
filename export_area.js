import { getSelectedScale, getPaperSizeMeters, isMagneticNorth } from './map_properties.js';
import { isExportMode } from './export_mode.js';

var lastExportCoordinate = null;
var lastDeclination = 0;

var rectangleLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'orange',
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,165,0,0.1)'
        })
    })
});

export function getRectangleLayer() {
    return rectangleLayer;
}

function clearRectangleLayer() {
    rectangleLayer.getSource().clear();
}

export function isRectangleLayer(layer) {
    return layer === rectangleLayer;
}

export function fetchDeclination(lon, lat, callback) {
    // NOAA API: https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination
    // We'll use the JSON endpoint
    var url = 'https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination?lat1=' +
        encodeURIComponent(lat) +
        '&lon1=' + encodeURIComponent(lon) +
        '&key=zNEw7&resultFormat=json';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.result && data.result[0] && typeof data.result[0].declination === 'number') {
                callback(data.result[0].declination);
            } else {
                callback(0); // fallback if API fails
            }
        })
        .catch(() => callback(0));
}

function updateRectangle() {
    if (lastExportCoordinate !== null && isExportMode()) {
        if (isMagneticNorth()) {
            var lonLat = ol.proj.toLonLat(lastExportCoordinate, 'EPSG:3857');
            fetchDeclination(lonLat[0], lonLat[1], function(declination) {
                lastDeclination = declination;
                drawRectangleAt(lastExportCoordinate, declination);
            });
        } else {
            lastDeclination = 0;
            drawRectangleAt(lastExportCoordinate, 0);
        }
    }
}
document.addEventListener('rectanglePropertiesUpdate', updateRectangle);

// Calculate meters per degree longitude at the clicked latitude
function metersTo3857Width(meters, latitude) {
    var earthRadius = 6378137;
    var latRad = latitude * Math.PI / 180;
    return meters / Math.cos(latRad);
}

function metersTo3857Height(meters, latitude) {
    var latRad = latitude * Math.PI / 180;
    return meters / Math.cos(latRad);
}

export function calculateRectangleCoordinates(center3857, declinationDeg) {
    var scale = getSelectedScale();
    var paperSize = getPaperSizeMeters();
    var hsizeMeters = paperSize[0] * scale;
    var vsizeMeters = paperSize[1] * scale;

    var lonLat = ol.proj.toLonLat(center3857, 'EPSG:3857');
    var latitude = lonLat[1];

    var hsize = metersTo3857Width(hsizeMeters, latitude);
    var vsize = metersTo3857Height(vsizeMeters, latitude);

    var halfH = hsize / 2, halfV = vsize / 2;
    var rectLocal = [
        [-halfH, -halfV],
        [-halfH,  halfV],
        [ halfH,  halfV],
        [ halfH, -halfV],
        [-halfH, -halfV]
    ];

    var angleRad = 0;
    if (isMagneticNorth()) {
        angleRad = -declinationDeg * Math.PI / 180;
    }

    var rect3857 = rectLocal.map(function(coord) {
        var x = coord[0], y = coord[1];
        var xr = x * Math.cos(angleRad) - y * Math.sin(angleRad);
        var yr = x * Math.sin(angleRad) + y * Math.cos(angleRad);
        return [center3857[0] + xr, center3857[1] + yr];
    });

    return rect3857;
}

// Rectangle drawing function, refactored to take coordinate and declination
export function drawRectangleAt(center3857, declinationDeg) {
    rectangleLayer.getSource().clear();

    var rect3857 = calculateRectangleCoordinates(center3857, declinationDeg);

    var rect = new ol.geom.Polygon([rect3857]);
    var feature = new ol.Feature(rect);
    rectangleLayer.getSource().addFeature(feature);

    document.dispatchEvent(new Event('rectangleUpdate'));
}

export function setExportArea(coordinate) {
    lastExportCoordinate = coordinate;
}

export function drawExportArea(coordinate) {
    lastExportCoordinate = coordinate;
    var lonLat = ol.proj.toLonLat(coordinate, 'EPSG:3857');
    if (isMagneticNorth()) {
        fetchDeclination(lonLat[0], lonLat[1], function(declination) {
            lastDeclination = declination;
            drawRectangleAt(coordinate, lastDeclination);
        });
    } else {
        lastDeclination = 0;
        drawRectangleAt(coordinate, 0);
    }
}

export function clearExportArea() {
    lastExportCoordinate = null;
    lastDeclination = null;
    rectangleLayer.getSource().clear();
}

export function getExportArea() {
    return calculateRectangleCoordinates(lastExportCoordinate, lastDeclination);
}

export function getDeclination() {
    return lastDeclination;
}
