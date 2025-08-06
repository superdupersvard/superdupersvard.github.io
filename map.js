import { getRectangleLayer, isRectangleLayer, drawExportArea, setExportArea } from './export_area.js';
import { isExportMode } from './export_mode.js';
import { getTileUrl } from './server_settings.js';

var mousePositionControl = new ol.control.MousePosition({
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
});
function getLineWidth(map) {
    var zoom = map.getView().getZoom();
    return zoom >= 17 ? 6 : (zoom == 16 ? 5 : zoom / 5);
}
function createHatchPattern(lineWidth, interspace = 1, color = 'rgba(0,0,0,0.3)') {
    var canvas = document.createElement('canvas');
    var zoom = map.getView().getZoom();
    canvas.width = zoom * interspace;
    canvas.height = zoom * interspace;
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth * zoom / 4;
    ctx.beginPath();
    ctx.moveTo(0, zoom * interspace);
    ctx.lineTo(zoom * interspace, 0);
    ctx.stroke();
    ctx.moveTo(0, 0);
    ctx.lineTo(zoom * interspace, zoom * interspace);
    ctx.stroke();
    return ctx.createPattern(canvas, 'repeat');
}
function highlightStyle(feature, resolution) {
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'yellow',
            width: 8
        })
    });
}

var map = new ol.Map({
    controls: ol.control.defaults.defaults().extend([mousePositionControl]),
    target: 'map',

    layers: [
        new ol.layer.Group({
            title: 'Base maps',
            layers: [
                new ol.layer.Tile({
                    title: 'OpenTopoMap',
                    type: 'base',
                    visible: false,
                    source: new ol.source.XYZ({
                        url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
                        attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                    })
                }),
                new ol.layer.Tile({
                    title: 'OpenStreetMap',
                    type: 'base',
                    visible: true,
                    source: new ol.source.OSM()
                }),
            ]
        }),
        new ol.layer.Tile({
            title: 'Overlay',
            extent: [1369749.291943, 7411510.649722, 1643702.937997, 7690177.710994],
            source: new ol.source.XYZ({
                attributions: '',
                minZoom: 7,
                maxZoom: 17,
                url: getTileUrl(),
                tileSize: [256, 256]
            })
        }),
        new ol.layer.Group({
            title: 'Trails',
            layers: [
                new ol.layer.Vector({
                    title: 'MTB Trails',
                    source: new ol.source.Vector({
                        url: './trail_mtb.geojson',
                        format: new ol.format.GeoJSON()
                    }),
                    visible: false,
                    style: function(feature, resolution) {
                        return new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: 'red',
                                width: getLineWidth(map),
                            })
                        });
                    }
                }),
                new ol.layer.Vector({
                    title: 'Hiking Trails',
                    source: new ol.source.Vector({
                        url: './trail_hiking.geojson',
                        format: new ol.format.GeoJSON()
                    }),
                    visible: false,
                    style: function(feature, resolution) {
                        return new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: 'purple',
                                width: getLineWidth(map),
                            })
                        });
                    }
                }),
                new ol.layer.Vector({
                    title: 'Bicycle Trails',
                    source: new ol.source.Vector({
                        url: './trail_bicycle.geojson',
                        format: new ol.format.GeoJSON()
                    }),
                    visible: false,
                    style: function(feature, resolution) {
                        return new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: 'blue',
                                width: getLineWidth(map),
                            })
                        });
                    }
                }),
            ]
        }),
        new ol.layer.Group({
            title: 'Natur',
            layers: [
                new ol.layer.Vector({
                    title: 'Naturreservat',
                    source: new ol.source.Vector({
                        url: './naturreservat.geojson',
                        format: new ol.format.GeoJSON()
                    }),
                    visible: false,
                    style: function(feature, resolution) {
                        return new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: 'rgb(0,255,0)',
                                width: getLineWidth(map),
                            }),
                            fill: new ol.style.Fill({
                                color: createHatchPattern(.75, 3, 'rgba(0,255,0,0.3)')
                            })
                        });
                    }
                }),
                new ol.layer.Vector({
                    title: 'Tillträdesförbud',
                    source: new ol.source.Vector({
                        url: './tilltrade.geojson',
                        format: new ol.format.GeoJSON()
                    }),
                    visible: true,
                    style: function(feature, resolution) {
                        return new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: 'rgba(166,38,255,0.5)',
                                width: getLineWidth(map),
                            }),
                            fill: new ol.style.Fill({
                                color: createHatchPattern(1, 2, 'rgba(166,38,255,0.5)'),
                            })
                        });
                    }
                }),
                new ol.layer.Vector({
                    title: 'Anmäld avverkning',
                    source: new ol.source.Vector({
                        url: './anmaldavv.geojson',
                        format: new ol.format.GeoJSON()
                    }),
                    visible: false,
                    style: function(feature, resolution) {
                        return new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: 'rgba(255,0,0,0.5)',
                                width: getLineWidth(map),
                            }),
                            fill: new ol.style.Fill({
                                color: createHatchPattern(1, 2, 'rgba(255,0,0,0.5)')
                            })
                        });
                    }
                }),
            ]
        }),
    ],
    view: new ol.View({
        center: [1506155, 7503082],
        zoom: 9,
    })
});

map.addControl(new ol.control.LayerSwitcher());
map.addLayer(getRectangleLayer());

var trailLayerTitles = ['MTB Trails', 'Hiking Trails', 'Bicycle Trails'];
var selectInteraction = new ol.interaction.Select({
    layers: function(layer) {
        return trailLayerTitles.includes(layer.get('title'));
    },
    style: highlightStyle
});
map.addInteraction(selectInteraction);

export function getTrailLayer() {
    var trailLayers = map.getLayers().getArray().find(function(layer) {
        return layer.get('title') === 'Trails';
    });
    return trailLayers || null;
}

var dragPan;
map.getInteractions().forEach(function(interaction) {
    if (interaction instanceof ol.interaction.DragPan) {
        dragPan = interaction;
    }
});

map.on('pointermove', function(evt) {
    var pixel = map.getEventPixel(evt.originalEvent);
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        return feature;
    }, {layerFilter: isRectangleLayer });
    if (feature) {
        dragPan.setActive(false);
        map.getTargetElement().style.cursor = 'move';
    } else {
        dragPan.setActive(true);
        map.getTargetElement().style.cursor = '';
    }
});

export function showPopupDialog(evt) {
    var foundFeatures = [];
    var trailFeatures = [];
    map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        if (layer && trailLayerTitles.includes(layer.get('title'))) {
            var props = feature.getProperties();
            var namn = props['name'] || 'okänd';
            // Use OpenLayers' internal unique id for the feature
            trailFeatures.push({name: namn, feature: feature});
            foundFeatures.push('<div class="trail-popup-entry" data-uid="' + feature.ol_uid + '">' + namn + '</div>');
        }
        if (layer && layer.get('title') === 'Tillträdesförbud') {
            var props = feature.getProperties();
            var namn = props['OBJEKTNAMN'] || 'okänd';
            var frandatum = props['FRANDATUM'] || 'okänd';
            var tilldatum = props['TILLDATUM'] || 'okänd';
            foundFeatures.push(namn + '<br><b>FRÅN:</b> ' + frandatum + '<br><b>TILL:</b> ' + tilldatum);
        }
        if (layer && layer.get('title') === 'Naturreservat') {
            var props = feature.getProperties();
            var namn = props['NAMN'] || 'okänd';
            foundFeatures.push(namn);
        }
        if (layer && layer.get('title') === 'Anmäld avverkning') {
            var props = feature.getProperties();
            if (props['AvvSasong'] != 'Uppgift saknas') {
                var namn = props['AvvSasong'];
                foundFeatures.push('Avvekning: ' + namn);
            }
            else if (props['ArendeAr'] != 'Uppgift saknas') {
                var namn = props['ArendeAr'];
                foundFeatures.push('Inkom: ' + namn);
            }
        }
    });
    if (foundFeatures.length > 0) {
        popup.innerHTML = foundFeatures.join('<hr style="margin:4px 0;">');
        popup.style.left = (evt.originalEvent.pageX + 10) + 'px';
        popup.style.top = (evt.originalEvent.pageY - 10) + 'px';
        popup.style.display = 'block';
        
        // Highlight the clicked trail from the popup
        popup.querySelectorAll('.trail-popup-entry').forEach(function(entry) {
            entry.addEventListener('click', function(e) {
                var uid = entry.getAttribute('data-uid');
                // Find the feature by ol_uid
                var featureToHighlight = null;
                trailFeatures.forEach(function(obj) {
                    if (obj.feature.ol_uid == uid) {
                        featureToHighlight = obj.feature;
                    }
                });
                if (featureToHighlight) {
                    // Clear previous selection and add the clicked feature
                    selectInteraction.getFeatures().clear();
                    selectInteraction.getFeatures().push(featureToHighlight);
                }
            });
        });
    } else {
        popup.style.display = 'none';
    }
}

var popup = document.createElement('div');
popup.id = 'popup';
popup.style.position = 'absolute';
popup.style.background = 'white';
popup.style.padding = '8px';
popup.style.border = '1px solid black';
popup.style.borderRadius = '4px';
popup.style.display = 'none';
document.body.appendChild(popup);

map.on('singleclick', function(evt) {
    if (isExportMode()) {
        popup.style.display = 'none';
        drawExportArea(evt.coordinate);
    } else {
        showPopupDialog(evt);
    }
});

map.on('movestart', function() {
    popup.style.display = 'none';
});

var dragRectangle = null;
function updateRectangleTranslateInteraction() {
    if (dragRectangle) {
        map.removeInteraction(dragRectangle);
    }
    dragRectangle = new ol.interaction.Translate({
        features: new ol.Collection(getRectangleLayer().getSource().getFeatures())
    });
    map.addInteraction(dragRectangle);

    // Add the event listener here, after dragRectangle is created
    dragRectangle.on('translateend', function(evt) {
        var feature = evt.features.getArray()[0];
        var geometry = feature.getGeometry();
        var center = geometry.getInteriorPoint().getCoordinates();
        setExportArea(center);
    });
}

document.addEventListener('rectangleUpdate', function() {
    updateRectangleTranslateInteraction();
});

