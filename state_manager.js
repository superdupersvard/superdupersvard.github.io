let appState = {
    map: {
        scale: 10000,
        paperSize: 'A4',
        orientation: 'landscape',
        magneticNorth: false
    },
    export: {
        imageFormat: 'png',
        contourInterval: 5,
    },
    layers: {
        topo10Visible: true,
        trailsVisible: false,
        mtbTrailsVisible: false,
        hikingTrailsVisible: false,
        bicycleTrailsVisible: false,
        naturreservatVisible: false,
        tilltradesforbud: true,
        anmaldAvverkningVisible: false
    }
};

const listeners = [];

export function getState() {
    return JSON.parse(JSON.stringify(appState)); // Deep copy
}

export function setState(path, value) {
    const keys = path.split('.');
    let current = appState;
    
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    notifyListeners(path, value);
}

export function updateState(newState) {
    appState = mergeDeep(appState, newState);
    notifyListeners('*', appState);
}

export function subscribe(listener, path = '*') {
    listeners.push({ listener, path });
    return () => {
        const index = listeners.findIndex(l => l.listener === listener);
        if (index > -1) listeners.splice(index, 1);
    };
}

function notifyListeners(changedPath, value) {
    listeners.forEach(({ listener, path }) => {
        if (path === '*' || changedPath.startsWith(path)) {
            listener(appState, changedPath, value);
        }
    });
}

function mergeDeep(target, source) {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

// Convenience functions for common operations
export function getMapProperties() {
    return getState().map;
}

export function getExportConfig() {
    return getState().export;
}

export function getLayerVisibility(layerName) {
    return getState().layers[layerName] || false;
}

export function setLayerVisibility(layerName, visible) {
    setState(`layers.${layerName}`, visible);
}

// Moved from map_properties.js - these are the main functions other modules need
export function isMagneticNorth() {
    return appState.map.magneticNorth;
}

export function getSelectedScale() {
    return appState.map.scale;
}

export function getPaperSizeMeters() {
    const sizes = {
        'A4': [0.297, 0.210],
        'A3': [0.420, 0.297],
        'A2': [0.594, 0.420]
    };
    
    let size = sizes[appState.map.paperSize] || sizes['A4'];
    
    if (appState.map.orientation === 'portrait') {
        size = [size[1], size[0]]; // Swap width and height
    }
    
    return size;
}
