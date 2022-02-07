// requires leaflet


/*
* @description create Leaflet control panel
*
* @param {map} the leaflet map object
*/
function createLeafletControlPanel(map) {
    L.EditControl = L.Control.extend({
        options: {
            position: 'topleft',
            callback: null,
            kind: '',
            html: ''
        },
        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
                link = L.DomUtil.create('a', '', container);

            link.href = '#';
            link.title = 'Create a new ' + this.options.kind;
            link.innerHTML = this.options.html;
            L.DomEvent.on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', function () {
                    window.LAYER = this.options.callback.call(map.editTools);
                }, this);

            return container;
        }
    });

    L.NewLineControl = L.EditControl.extend({
        options: {
            position: 'topleft',
            callback: map.editTools.startPolyline,
            kind: 'line',
            html: '\\/\\'
        }
    });

    L.NewPolygonControl = L.EditControl.extend({
        options: {
            position: 'topleft',
            callback: map.editTools.startPolygon,
            kind: 'polygon',
            html: '▰'
        }
    });

    //L.NewMarkerControl = L.EditControl.extend({
    //    options: {
    //        position: 'topleft',
    //        callback: map.editTools.startMarker,
    //        kind: 'marker',
    //        html: '🖈'
    //    }
    //});

    L.NewRectangleControl = L.EditControl.extend({
        options: {
            position: 'topleft',
            callback: map.editTools.startRectangle,
            kind: 'rectangle',
            html: '⬛'
        }
    });

    var html = '\
1. 双击图形，切换编辑模式和只读模式（默认为编辑模式）。编辑模式可以调整节点、平移、删除。只读模式则与背景图片融为一体，无法编辑。\
\n2. 选中图形（若无法选中，先双击图形，进入编辑模式）：\n\
    2.1.可以拖拽平移该图形的位置；\n\
    2.2.将光标移动至图形上方，按住Ctrl的同时单击，将删除该图形。\n\
    2.3.将光标移动至其中一个节点上，可以拖拽该节点位置，改变图形形状；单击该节点将删除节点。\n\
3. 绘制多边形和折线的过程中，Ctrl+Z和Shift+Ctrl+Z可以执行Undo和Redo操作。\n\
4. 系统会记住用户最近一次保存的页面，下次进入该页面时将重新定位到该数据。';
    L.HelpControl = L.EditControl.extend({
        options: {
            position: 'bottomleft',
            callback: function () { alert(html); },            
            html: '?'
        }
    });

    //L.NewCircleControl = L.EditControl.extend({
    //    options: {
    //        position: 'topleft',
    //        callback: map.editTools.startCircle,
    //        kind: 'circle',
    //        html: '⬤'
    //    }
    //});

    //map.addControl(new L.NewMarkerControl());
    map.addControl(new L.NewLineControl());
    map.addControl(new L.NewPolygonControl());
    map.addControl(new L.NewRectangleControl());
    map.addControl(new L.HelpControl());
    // map.addControl(new L.NewCircleControl());
}

//
// Ctrl + Click or Meta + Click to delete shape
var deleteShape = function (e) {
    if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled())
        this.editor.deleteShapeAt(e.latlng);
};

/*
* @description save all shapes inside a Leaflet map object
*
* @param {map} the leaflet map object
*/
function saveLeafletShapes(map) {
    var bounds = map.getBounds();

    var collection = {
        "type": "FeatureCollection",
        "bbox": [[
            bounds.getSouthWest().lng,
            bounds.getSouthWest().lat
        ], [
            bounds.getNorthEast().lng,
            bounds.getNorthEast().lat
        ]],
        "features": []
    };

    map.eachLayer(function (layer) {
        // polygon is a L.Polyline, while polyline is not a L.Polygon
        if (layer instanceof L.Polygon && layer._latlngs[0].length > 0 ||
            layer instanceof L.Polygon === false && layer instanceof L.Polyline && layer._latlngs.length > 0 ) {
            // Rectange is internally treated as a L.Polygon.
            // if a previous shape is deleted, its layer still exists and its coordinates array is empty
            var geojson = layer.toGeoJSON();
            if (layer._tooltip) {
                geojson.tooltip = layer.getTooltip()._content;    
            }
            else {
                geojson.tooltip = "";
            }
            collection.features.push(geojson);
        }
    });

    return JSON.stringify(collection);
};


/*
* @description A simplified version of saveLeafletShapes(), which will not save bbox info
*
* @param {map} the leaflet map object
*/
function saveLeafletShapesLite(map) {
    var collection = [];

    map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon && layer._latlngs[0].length > 0 ||
            layer instanceof L.Polygon === false && layer instanceof L.Polyline && layer._latlngs.length > 0) {
            var geojson = layer.toGeoJSON();
            if (layer._tooltip) {
                geojson.tooltip = layer.getTooltip()._content;
            }
            else {
                geojson.tooltip = "";
            } 
            collection.push(geojson);
        }
    });

    return JSON.stringify(collection);
};

function loadLeafletShapes(map, json)
{
    //
    // load geojson
    var geojsonFeature = JSON.parse(json);

    // get tooltip text using raw json
    //var tooltips = [];
    //for (var i = 0; i < geojsonFeature.features.length; i++)
    //{
    //   tooltips.push(geojsonFeature.features[i].tooltip);
    //}
    
    var featureLayer = L.geoJSON(geojsonFeature);

    // get tooltip text using geojson
    var tooltips = {};
    featureLayer.eachLayer(function (layer) {
        if (layer.feature.tooltip) {
            tooltips[layer._leaflet_id] = layer.feature.tooltip;
        }
        else {
            tooltips[layer._leaflet_id] = "";
        }
    })

    //var geojsonFeature = JSON.parse('[{"type":"Feature","properties":{"editable":true,"draggable":true},"geometry":{"type":"Polygon","coordinates":[[[131.5,437],[266.5,337],[101.5,289],[131.5,437]]]}},{"type":"Feature","properties":{"editable":true,"draggable":true},"geometry":{"type":"Polygon","coordinates":[[[435,260.5],[125.25,260.5],[125.25,114],[435,114],[435,260.5]]]}},{"type":"Feature","properties":{"editable":true,"draggable":true},"geometry":{"type":"Polygon","coordinates":[[[206.25,279],[325.75,248.5],[253.75,180],[181.25,194],[184.25,233],[206.25,279]]]}},{"type":"Feature","properties":{"editable":true,"draggable":true},"geometry":{"type":"Polygon","coordinates":[[[435,405],[253.5,405],[253.5,314],[435,314],[435,405]]]}},{"type":"Feature","properties":{"editable":true,"draggable":true},"geometry":{"type":"Polygon","coordinates":[[[232.5,476],[468.5,418],[249.5,237],[202.5,452],[232.5,476]]]}},{"type":"Feature","properties":{"editable":true,"draggable":true},"geometry":{"type":"Polygon","coordinates":[[[107.5,455],[182.5,426],[129.5,378],[107.5,455]]]}},{"type":"Feature","properties":{"editable":true,"draggable":true},"geometry":{"type":"Polygon","coordinates":[[[170,536],[170,536],[170,536],[170,536],[170,536]]]}},{"type":"Feature","properties":{"editable":true,"draggable":true},"geometry":{"type":"Polygon","coordinates":[[[174,541],[274,484],[165,440],[174,541]]]}}]');
    featureLayer.addTo(map);

    //
    // enableEdit and associate del operation for all imported shapes
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon
            || layer instanceof L.Polyline) {
            layer.enableEdit(map);
            // layer.bindTooltip(tooltips[i++]).openTooltip();
            layer.bindTooltip(tooltips[layer._leaflet_id]); //.openTooltip();

            layer.on('click', L.DomEvent.stop).on('click', deleteShape, layer);
            layer.on('click', L.DomEvent.stop).on('click', editTooltip, layer);
            layer.on('dblclick', L.DomEvent.stop).on('dblclick', layer.toggleEdit);
        }
    });
}

var editTooltip = function (e) {
    $('#selectedFeatureId').val(e.target._leaflet_id);
    $('#selectedFeatureTooltip').val(e.target.getTooltip()._content);
};

function updateTooltip(map, id, text) {
    if (!map || !id)
    {
        return;
    }

    if (!text)
    {
        text = "";
    }

    map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon
            || layer instanceof L.Polyline) {
            if (layer._leaflet_id == id)
            {
                layer.bindTooltip(text).openTooltip();
                return;
            }
        }
    });
}

function openTooltip(map, id) {
    if (!map || !id) {
        return;
    }
    
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon
            || layer instanceof L.Polyline) {
            if (layer._leaflet_id == id) {
                layer.openTooltip();
                return;
            }
        }
    });
}

function closeTooltip(map, id) {
    if (!map || !id) {
        return;
    }
    
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon
            || layer instanceof L.Polyline) {
            if (layer._leaflet_id == id) {
                layer.closeTooltip();
                return;
            }
        }
    });
}

function clearLeafletShapes(map) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon
            || layer instanceof L.Polyline ||
            layer instanceof L.rectangle) {
            map.removeLayer(layer);
        }
    });
}

function enableDeleteShape(map)
{
    map.on('layeradd', function (e) {
        if (e.layer instanceof L.Path)
            e.layer.on('click', L.DomEvent.stop).on('click', deleteShape, e.layer);
        if (e.layer instanceof L.Path)
            e.layer.on('dblclick', L.DomEvent.stop).on('dblclick', e.layer.toggleEdit);
    });
}

function enableUpdateTooltip(map) {
    map.on('layeradd', function (e) {
        if (e.layer instanceof L.Path)
            e.layer.on('click', L.DomEvent.stop).on('click', editTooltip, e.layer);
    });
}

function enableUndoRedo(map) {
    //
    // Ctrl+Z, Shift+Ctrl+Z to undo/redo
    var Z = 90, latlng, redoBuffer = [],
        onKeyDown = function (e) {
            if (e.keyCode == Z) {
                if (!this.editTools._drawingEditor) return;
                if (e.shiftKey) {
                    if (redoBuffer.length) this.editTools._drawingEditor.push(redoBuffer.pop());
                } else {
                    latlng = this.editTools._drawingEditor.pop();
                    if (latlng) redoBuffer.push(latlng);
                }
            }
        };
    L.DomEvent.addListener(document, 'keydown', onKeyDown, map);
    map.on('editable:drawing:end', function () {
        redoBuffer = [];
    });
}