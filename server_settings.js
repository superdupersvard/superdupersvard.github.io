const backendBaseUrl = 'https://api.mtbokartan.se';
// const backendBaseUrl = '';

const tileUrl = 'https://api.mtbokartan.se/tiles/{z}/{x}/{-y}.webp';
// const tileUrl = './tiles/{z}/{x}/{-y}.webp';

const geojsonUrl = 'https://api.mtbokartan.se/geojson';
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
