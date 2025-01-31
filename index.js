"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./style.css");
var maplibre_gl_1 = require("maplibre-gl");
require("maplibre-gl/dist/maplibre-gl.css");
var core_1 = require("@deck.gl/core");
var api_client_1 = require("@carto/api-client");
var carto_1 = require("@deck.gl/carto");
var echarts = require("echarts");
var utils_1 = require("./utils");
var layers_1 = require("@deck.gl/layers");
var apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
var accessToken = import.meta.env.VITE_API_ACCESS_TOKEN;
var connectionName = 'carto_dw';
var cartoConfig = { apiBaseUrl: apiBaseUrl, accessToken: accessToken, connectionName: connectionName };
var INITIAL_VIEW_STATE = {
    latitude: -10.091561299802148,
    longitude: -80.9872,
    zoom: 5,
    bearing: 0,
    pitch: 45, // Inclinación de la cámara para efecto 3D
    maxPitch: 60, // Permitir inclinaciones más pronunciadas
};
var deck = new core_1.Deck({
    canvas: 'deck-canvas',
    initialViewState: INITIAL_VIEW_STATE,
    controller: true
});
// Add basemap
var map = new maplibre_gl_1.default.Map({
    container: 'map',
    style: carto_1.BASEMAP.DARK_MATTER,
    interactive: false
});
// prepare and init widgets HTML elements
var radarWidget = document.querySelector('#radar-widget');
// const sankeyWidget = document.querySelector<HTMLSelectElement>('#sankey-widget');
// const formulaWidget = document.querySelector<HTMLSelectElement>('#formula-widget');
var radarWidgetChart = echarts.init(radarWidget);
// var sankeyWidgetChart = echarts.init(sankeyWidget);
// var formulaWidgetChart = echarts.init(formulaWidget);
// define sources
var dataSource;
// let sankeyDataSource;
// let ntaDataSource;
function initSources() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, api_client_1.vectorQuerySource)(__assign(__assign({}, cartoConfig), { sqlQuery: "SELECT\n      *\n    FROM\n    carto-dw-ac-p66e86fb.shared.Nodos_mifibra_final where ultimo = 1" }))];
                case 1:
                    dataSource = _a.sent();
                    // sankeyDataSource = await vectorQuerySource({
                    //   ...cartoConfig,
                    //   sqlQuery: `SELECT * FROM cartobq.docs.nyc_citibike_neighborhood_flows`
                    // });
                    // ntaDataSource = await vectorQuerySource({
                    //   ...cartoConfig,
                    //   sqlQuery: `SELECT
                    //     ANY_VALUE(geom) as geom,
                    //     start_name,
                    //     SUM(trip_count) as total_trip_count
                    //   FROM cartobq.docs.nyc_citibike_neighborhood_flows
                    //   GROUP BY 2`
                    // });
                    return [2 /*return*/];
            }
        });
    });
}
// SPATIAL FILTER
// prepare a function to get the new viewport state, that we'll pass debounced to our widgets to minimize requests
var viewportSpatialFilter;
var debouncedUpdateSpatialFilter = (0, utils_1.debounce)(function (viewState) {
    var viewport = new core_1.WebMercatorViewport(viewState);
    viewportSpatialFilter = (0, api_client_1.createViewportSpatialFilter)(viewport.getBounds());
    renderWidgets();
}, 300);
// sync deckgl map after user interaction, obtain new viewport after
deck.setProps({
    onViewStateChange: function (_a) {
        var viewState = _a.viewState;
        var longitude = viewState.longitude, latitude = viewState.latitude, rest = __rest(viewState, ["longitude", "latitude"]);
        map.jumpTo(__assign({ center: [longitude, latitude] }, rest));
        debouncedUpdateSpatialFilter(viewState);
    }
});
// RENDER
// render Widgets function
function renderWidgets() {
    return __awaiter(this, void 0, void 0, function () {
        var radarData, formula, radarAxisMax, weekOrder, sortedRadar, radarOption;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Exit if dataSource is not ready
                    if (!dataSource) {
                        return [2 /*return*/];
                    }
                    radarWidgetChart.showLoading();
                    return [4 /*yield*/, dataSource.widgetSource.getCategories({
                            column: 'tipo',
                            operation: 'count',
                            spatialFilter: viewportSpatialFilter
                        })];
                case 1:
                    radarData = _a.sent();
                    return [4 /*yield*/, dataSource.widgetSource.getFormula({
                            operation: 'count',
                            spatialFilter: viewportSpatialFilter
                        })];
                case 2:
                    formula = _a.sent();
                    radarAxisMax = Math.max.apply(Math, radarData.map(function (item) { return item.value; })) * 1.25;
                    weekOrder = ['filial', 'internexa', 'OLT', 'tdp', 'cirion', 'ufinet', 'pit_piura', 'pit_lambayeque'];
                    sortedRadar = radarData.sort(function (a, b) { return weekOrder.indexOf(a.name) - weekOrder.indexOf(b.name); });
                    radarOption = {
                        radar: {
                            indicator: [
                                { name: 'Fil', max: radarAxisMax },
                                { name: 'Inter', max: radarAxisMax },
                                { name: 'OLT', max: radarAxisMax },
                                { name: 'TDP', max: radarAxisMax },
                                { name: 'Cirion', max: radarAxisMax },
                                { name: 'Ufinet', max: radarAxisMax },
                                { name: 'Pit Piu.', max: radarAxisMax },
                                { name: 'Pit Lamb.', max: radarAxisMax }
                            ]
                        },
                        series: [
                            {
                                name: 'Trips by weekday',
                                type: 'radar',
                                data: [
                                    {
                                        value: sortedRadar.map(function (item) { return item.value; }),
                                        name: 'Trips'
                                    }
                                ]
                            }
                        ]
                    };
                    // // Prepare our sankey chart
                    // const nodes = [];
                    // const links = [];
                    // sankeyData.rows.forEach(item => {
                    //   const startNodeName = item.start_name + ' (S)';
                    //   const endNodeName = item.end_name + ' (T)';
                    //   if (!nodes.find(n => n.name === startNodeName)) {
                    //     nodes.push({name: startNodeName});
                    //   }
                    //   if (!nodes.find(n => n.name === endNodeName)) {
                    //     nodes.push({name: endNodeName});
                    //   }
                    //   links.push({
                    //     source: startNodeName,
                    //     target: endNodeName,
                    //     value: item.trip_count
                    //   });
                    // });
                    // const sankeyOption = {
                    //   tooltip: {
                    //     trigger: 'item',
                    //     triggerOn: 'mousemove'
                    //   },
                    //   series: [
                    //     {
                    //       type: 'sankey',
                    //       data: nodes,
                    //       links: links,
                    //       emphasis: {
                    //         focus: 'adjacency'
                    //       },
                    //       lineStyle: {
                    //         color: 'source',
                    //         curveness: 0.5
                    //       },
                    //       nodeAlign: 'right',
                    //       layoutIterations: 0
                    //     }
                    //   ]
                    // };
                    // render widgets!
                    radarWidgetChart.setOption(radarOption);
                    // sankeyWidgetChart.setOption(sankeyOption);
                    radarWidgetChart.hideLoading();
                    return [2 /*return*/];
            }
        });
    });
}
// render Layers function
function renderLayers() {
    return __awaiter(this, void 0, void 0, function () {
        var colorMapping, layers, selectedFeature;
        return __generator(this, function (_a) {
            // Exit if dataSource is not ready
            if (!dataSource) {
                return [2 /*return*/];
            }
            colorMapping = {
                'OLT': [108, 255, 0], // Verde
                'filial': [255, 244, 0], // Amarillo
                'internexa': [229, 127, 59], // Naranja
                'tdp': [1, 176, 239], // Rojo
                'cirion': [238, 25, 211], // Gris (para valores no definidos)
                'ufinet': [53, 61, 80], // Gris (para valores no definidos)
                'pit_piura': [124, 37, 214], // Gris (para valores no definidos)
                'pit_lambayeque': [124, 37, 214], // Gris (para valores no definidos)
                'OTROS': [128, 128, 128]
            };
            layers = [
                // new VectorTileLayer({
                //   id: 'neighborhoods',
                //   data: ntaDataSource,
                //   pickable: true,
                //   opacity: 0.2,
                //   getFillColor: colorContinuous({
                //     attr: 'total_trip_count',
                //     domain: [0, 569962],
                //     colors: 'BluYl'
                //   }),
                //   getLineColor: [0, 0, 0],
                //   getLineWidth: 5,
                //   lineWidthMinPixels: 2
                // }),
                new carto_1.VectorTileLayer({
                    id: 'stations',
                    data: dataSource,
                    pickable: true,
                    getPointRadius: function (d) { return d.properties.minimo / 1048576; }, //entre 1024 al cuadrado
                    pointRadiusMinPixels: 1,
                    getFillColor: function (d) { return colorMapping[d.properties.tipo] || colorMapping['OTRO']; },
                    getLineColor: [0, 0, 0],
                    getLineWidth: 1,
                    lineWidthMinPixels: 1
                }),
                new layers_1.ArcLayer({
                    id: 'ArcLayer',
                    data: 'https://data.mifibra.pe/MifibraCarto/ArcLayer/trafico_mf_carto.php?token=sdu3u3dhdaudUSDH339WD2EHJ2JKjh88asdghA6Agha67a5sf',
                    getSourcePosition: function (d) { return d.from.coordinate; },
                    getTargetPosition: function (d) { return d.to.coordinate; },
                    // Ancho del arco basado en el valor de inbound
                    getWidth: function (d) { return Math.max(3, Math.sqrt(d.inbound) * 0.0005); },
                    getSourceColor: function (d) { return colorMapping[d.from.tipo] || colorMapping['OTRO']; },
                    getTargetColor: function (d) { return colorMapping[d.to.tipo] || colorMapping['OTRO']; },
                    // Curvatura del arco
                    getHeight: function (d) { return Math.max(0.5, Math.pow(d.inbound, 1 / 4) * 0.005); }, // Ajusta la altura en base al tráfico inbound
                    pickable: true
                })
            ];
            selectedFeature = null;
            deck.setProps({
                layers: layers, // Agregar las capas de arcos sin perder las capas de puntos
                // Manejar los eventos de clic en puntos y arcos
                onClick: function (_a) {
                    var _b, _c;
                    var object = _a.object, x = _a.x, y = _a.y;
                    if (object) {
                        selectedFeature = object; // Guarda el objeto seleccionado
                        // Crea o actualiza un tooltip
                        var tooltip = document.getElementById('custom-tooltip') || document.createElement('div');
                        tooltip.id = 'custom-tooltip';
                        tooltip.style.position = 'absolute';
                        tooltip.style.left = "".concat(x, "px");
                        tooltip.style.top = "".concat(y, "px");
                        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                        tooltip.style.color = 'white';
                        tooltip.style.padding = '8px';
                        tooltip.style.borderRadius = '5px';
                        tooltip.style.fontSize = '12px';
                        tooltip.style.pointerEvents = 'none';
                        tooltip.style.zIndex = '1000';
                        // Determinar si el objeto es un punto o un arco
                        if (object.properties) {
                            // Si es un punto
                            tooltip.innerHTML = "\n            <strong>Nodo</strong>: ".concat(((_b = object.properties) === null || _b === void 0 ? void 0 : _b.name) || "Desconocido", "<br/>\n            <strong>Inbound</strong>: ").concat(((_c = object.properties) === null || _c === void 0 ? void 0 : _c.inbound_txt) || "N/A", "\n          ");
                        }
                        else if (object.from && object.to) {
                            // Si es un arco
                            tooltip.innerHTML = "\n            <strong>Filial:</strong> ".concat(object.filial, "<br/><br/>\n            <strong>Ruta:</strong> ").concat(object.ruta, "<br/><br/>\n            <strong>Inbound:</strong> ").concat(object.inbound_txt.toLocaleString(), "<br/><br/>\n            <strong>Outbound:</strong> ").concat(object.outbound_txt, "<br/><br/>\n            <strong>Fecha y hora:</strong> ").concat(object.fecha.toLocaleString(), "<br/><br/>\n            <strong>Origen:</strong> ").concat(object.from.name, "<br/><br/>\n            <strong>Destino:</strong> ").concat(object.to.name, "<br/><br/>\n          ");
                        }
                        document.body.appendChild(tooltip);
                    }
                    else {
                        // Si se hace clic en otra parte del mapa, oculta el tooltip
                        var tooltip = document.getElementById('custom-tooltip');
                        if (tooltip)
                            tooltip.remove();
                        selectedFeature = null;
                    }
                },
                // Manejar los eventos de hover en arcos
                onHover: function (_a) {
                    var object = _a.object, x = _a.x, y = _a.y;
                    if (object && object.from && object.to) {
                        // Crea o actualiza un tooltip
                        var tooltip = document.getElementById('custom-tooltip') || document.createElement('div');
                        tooltip.id = 'custom-tooltip';
                        tooltip.style.position = 'absolute';
                        tooltip.style.left = "".concat(x, "px");
                        tooltip.style.top = "".concat(y, "px");
                        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                        tooltip.style.color = 'white';
                        tooltip.style.padding = '8px';
                        tooltip.style.borderRadius = '5px';
                        tooltip.style.fontSize = '12px';
                        tooltip.style.pointerEvents = 'none';
                        tooltip.style.zIndex = '1000';
                        tooltip.innerHTML = "\n        <strong>Ruta:</strong> ".concat(object.ruta, "<br/><br/>\n        <strong>Inbound:</strong> ").concat(object.inbound_txt.toLocaleString(), "<br/><br/>\n        <strong>Fecha y hora:</strong> ").concat(object.fecha.toLocaleString(), "<br/><br/>\n        ");
                        document.body.appendChild(tooltip);
                    }
                    else {
                        var tooltip = document.getElementById('custom-tooltip');
                        if (tooltip)
                            tooltip.remove();
                    }
                }
            });
            return [2 /*return*/];
        });
    });
}
// render everything!
function initialize() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initSources()];
                case 1:
                    _a.sent();
                    renderWidgets();
                    renderLayers();
                    return [2 /*return*/];
            }
        });
    });
}
initialize();
