import './style.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {WebMercatorViewport, Deck, PickingInfo} from '@deck.gl/core';
import {vectorQuerySource, createViewportSpatialFilter} from '@carto/api-client';
import {BASEMAP, VectorTileLayer, colorCategories, colorContinuous} from '@deck.gl/carto';
import * as echarts from 'echarts';
import {debounce} from './utils';
import {ArcLayer} from '@deck.gl/layers';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const accessToken = import.meta.env.VITE_API_ACCESS_TOKEN;
const connectionName = 'carto_dw';
const cartoConfig = {apiBaseUrl, accessToken, connectionName};

// init deckgl
type BartSegment = {
  filial: string;
  ruta: string;
  inbound_txt: string;
  outbound_txt: string;
  fecha: string;
  inbound: number;
  outbound: number;
  from: {
    tipo: string;
    name: string;
    coordinate: [longitude: number, latitude: number];
  };
  to: {
    tipo: string;
    name: string;
    coordinate: [longitude: number, latitude: number];
  };
};

const INITIAL_VIEW_STATE = {
  latitude: -10.091561299802148,
  longitude: -80.9872,
  zoom: 5,
  bearing: 0,
  pitch: 45, // Inclinación de la cámara para efecto 3D
  maxPitch: 60, // Permitir inclinaciones más pronunciadas
};

const deck = new Deck({
  canvas: 'deck-canvas',
  initialViewState: INITIAL_VIEW_STATE,
  controller: true
});

// Add basemap

const map = new maplibregl.Map({
  container: 'map',
  style: BASEMAP.DARK_MATTER,
  interactive: false
});

// prepare and init widgets HTML elements

const radarWidget = document.querySelector<HTMLSelectElement>('#radar-widget');
// const sankeyWidget = document.querySelector<HTMLSelectElement>('#sankey-widget');
// const formulaWidget = document.querySelector<HTMLSelectElement>('#formula-widget');

var radarWidgetChart = echarts.init(radarWidget);
// var sankeyWidgetChart = echarts.init(sankeyWidget);
// var formulaWidgetChart = echarts.init(formulaWidget);

// define sources

let dataSource;
// let sankeyDataSource;
// let ntaDataSource;

async function initSources() {
  dataSource = await vectorQuerySource({
    ...cartoConfig,
    sqlQuery: `SELECT
      *
    FROM
    carto-dw-ac-p66e86fb.shared.Nodos_mifibra_final where ultimo = 1`
  });
  
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

  return;
}

// SPATIAL FILTER
// prepare a function to get the new viewport state, that we'll pass debounced to our widgets to minimize requests

let viewportSpatialFilter;

const debouncedUpdateSpatialFilter = debounce(viewState => {
  const viewport = new WebMercatorViewport(viewState);
  viewportSpatialFilter = createViewportSpatialFilter(viewport.getBounds());
  renderWidgets();
}, 300);

// sync deckgl map after user interaction, obtain new viewport after

deck.setProps({
  onViewStateChange: ({viewState}) => {
    const {longitude, latitude, ...rest} = viewState;
    map.jumpTo({center: [longitude, latitude], ...rest});
    debouncedUpdateSpatialFilter(viewState);
  }
});

// RENDER
// render Widgets function

async function renderWidgets() {
  // Exit if dataSource is not ready
  if (!dataSource) {
    return;
  }

  radarWidgetChart.showLoading();
  // sankeyWidgetChart.showLoading();
  // formulaWidgetChart.showLoading();

  // configure widgets

  const radarData = await dataSource.widgetSource.getCategories({
    column: 'tipo',
    operation: 'count',
    spatialFilter: viewportSpatialFilter
  });

  // const sankeyData = await sankeyDataSource.widgetSource.getTable({
  //   columns: ['start_name', 'end_name', 'trip_count'],
  //   sortBy: 'trip_count',
  //   sortDirection: 'desc',
  //   limit: 15,
  //   spatialFilter: viewportSpatialFilter
  // });

  // formulaWidget.innerHTML = 'Loading...';

  const formula = await dataSource.widgetSource.getFormula({
    operation: 'count',
    spatialFilter: viewportSpatialFilter
  });

  // Prepare our radar chart
  const radarAxisMax = Math.max(...radarData.map(item => item.value)) * 1.25;
  const weekOrder = ['filial', 'internexa', 'OLT', 'tdp', 'cirion', 'ufinet', 'pit_piura', 'pit_lambayeque'];
  const sortedRadar = radarData.sort(
    (a, b) => weekOrder.indexOf(a.name) - weekOrder.indexOf(b.name)
  );

  const radarOption = {
    radar: {
      indicator: [
        {name: 'Fil', max: radarAxisMax},
        {name: 'Inter', max: radarAxisMax},
        {name: 'OLT', max: radarAxisMax},
        {name: 'TDP', max: radarAxisMax},
        {name: 'Cirion', max: radarAxisMax},
        {name: 'Ufinet', max: radarAxisMax},
        {name: 'Pit Piu.', max: radarAxisMax},
        {name: 'Pit Lamb.', max: radarAxisMax}
      ]
    },
    series: [
      {
        name: 'Trips by weekday',
        type: 'radar',
        data: [
          {
            value: sortedRadar.map(item => item.value),
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
  // sankeyWidgetChart.hideLoading();
  // formulaWidgetChart.hideLoading();
  
  // formulaWidget.innerHTML = formula.value;
}

// render Layers function

async function renderLayers() {
  // Exit if dataSource is not ready
  if (!dataSource) {
    return;
  }

  // now for the layers
  const colorMapping = {
    'OLT': [108, 255, 0],       // Verde
    'filial': [255, 244, 0],    // Amarillo
    'internexa': [229, 127, 59], // Naranja
    'tdp': [1, 176, 239],     // Rojo
    'cirion': [238, 25, 211],      // Gris (para valores no definidos)
    'ufinet': [53, 61, 80],      // Gris (para valores no definidos)
    'pit_piura': [124, 37, 214],      // Gris (para valores no definidos)
    'pit_lambayeque': [124, 37, 214],      // Gris (para valores no definidos)
    'OTROS': [128, 128, 128]   
  };
  
  const layers = [
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
    new VectorTileLayer({
      id: 'stations',
      data: dataSource,
      pickable: true,
      getPointRadius: d => d.properties.minimo/1048576, //entre 1024 al cuadrado
      pointRadiusMinPixels: 1,
      getFillColor: d => colorMapping[d.properties.tipo] || colorMapping['OTRO'],
      getLineColor: [0, 0, 0],
      getLineWidth: 1,
      lineWidthMinPixels: 1
    }),
    new ArcLayer<BartSegment>({
      id: 'ArcLayer',
      data: 'https://data.mifibra.pe/MifibraCarto/ArcLayer/trafico_mf_carto.php?token=sdu3u3dhdaudUSDH339WD2EHJ2JKjh88asdghA6Agha67a5sf',
      getSourcePosition: (d: BartSegment) => d.from.coordinate,
      getTargetPosition: (d: BartSegment) => d.to.coordinate,
      // Ancho del arco basado en el valor de inbound
      getWidth: (d: BartSegment) => Math.max(3, Math.sqrt(d.inbound) * 0.0005),
      getSourceColor: (d: BartSegment) => colorMapping[d.from.tipo] || colorMapping['OTRO'],
      getTargetColor: (d: BartSegment) => colorMapping[d.to.tipo] || colorMapping['OTRO'],
      // Curvatura del arco
      getHeight: (d: BartSegment) => Math.max(0.5, Math.pow(d.inbound, 1/4) * 0.005), // Ajusta la altura en base al tráfico inbound
      pickable: true
    })
    
  ];

  let selectedFeature = null; // Variable para almacenar el punto seleccionado

  deck.setProps({
    layers: layers,  // Agregar las capas de arcos sin perder las capas de puntos
  
    // Manejar los eventos de clic en puntos y arcos
    onClick: ({ object, x, y }) => {
      if (object) {
        selectedFeature = object; // Guarda el objeto seleccionado
  
        // Crea o actualiza un tooltip
        const tooltip = document.getElementById('custom-tooltip') || document.createElement('div');
        tooltip.id = 'custom-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
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
          tooltip.innerHTML = `
            <strong>Nodo</strong>: ${object.properties?.name || "Desconocido"}<br/>
            <strong>Inbound</strong>: ${object.properties?.inbound_txt || "N/A"}
          `;
        } else if (object.from && object.to) {
          // Si es un arco
          tooltip.innerHTML = `
            <strong>Filial:</strong> ${object.filial}<br/><br/>
            <strong>Ruta:</strong> ${object.ruta}<br/><br/>
            <strong>Inbound:</strong> ${object.inbound_txt.toLocaleString()}<br/><br/>
            <strong>Outbound:</strong> ${object.outbound_txt}<br/><br/>
            <strong>Fecha y hora:</strong> ${object.fecha.toLocaleString()}<br/><br/>
            <strong>Origen:</strong> ${object.from.name}<br/><br/>
            <strong>Destino:</strong> ${object.to.name}<br/><br/>
          `;
        }
  
        document.body.appendChild(tooltip);
      } else {
        // Si se hace clic en otra parte del mapa, oculta el tooltip
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip) tooltip.remove();
        selectedFeature = null;
      }
    },
  
    // Manejar los eventos de hover en arcos
    onHover: ({ object, x, y }) => {
      if (object && object.from && object.to) {
        // Crea o actualiza un tooltip
        const tooltip = document.getElementById('custom-tooltip') || document.createElement('div');
        tooltip.id = 'custom-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '8px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.fontSize = '12px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.zIndex = '1000';
        tooltip.innerHTML = `
        <strong>Ruta:</strong> ${object.ruta}<br/><br/>
        <strong>Inbound:</strong> ${object.inbound_txt.toLocaleString()}<br/><br/>
        <strong>Fecha y hora:</strong> ${object.fecha.toLocaleString()}<br/><br/>
        `;
        document.body.appendChild(tooltip);
      } else {
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip) tooltip.remove();
      }
    }
  });
}

// render everything!

async function initialize() {
  await initSources();
  renderWidgets();
  renderLayers();
}

initialize();
