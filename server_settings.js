const backendBaseUrl = 'https://api.mtbokartan.se';
// const backendBaseUrl = '';

const tileUrl = 'https://storage.googleapis.com/mtbo-map-tiles/Tiles/{z}/{x}/{-y}.webp';
//const tileUrl = './tiles/{z}/{x}/{-y}.webp';

const geojsonUrl = 'https://storage.googleapis.com/mtbo-map-tiles/GeoJSON';
// const geojsonUrl = '.';

export function getBackendBaseUrl() {
    return backendBaseUrl;
}

export function getTileUrl() {
    return tileUrl;
}

export function getGeojsonUrl() {
    return geojsonUrl;
}
