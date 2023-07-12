const layerTypes = {
    'fill': ['fill-opacity'],
    'line': ['line-opacity'],
    'circle': ['circle-opacity', 'circle-stroke-opacity'],
    'symbol': ['icon-opacity', 'text-opacity'],
    'raster': ['raster-opacity'],
    'fill-extrusion': ['fill-extrusion-opacity']
};

const alignments = {
    'left': 'lefty',
    'center': 'centered',
    'right': 'righty'
};

function getLayerPaintType(layer) {
    var layerType = map.getLayer(layer).type;
    return layerTypes[layerType];
}
function setLayerOpacity(layer) {
    var paintProps = getLayerPaintType(layer.layer);
    paintProps.forEach(function (prop) {
        map.setPaintProperty(layer.layer, prop, layer.opacity);
    });
}

// Main 'story' and 'features' elements
var story = document.getElementById('story');
var features = document.createElement('div');
features.classList.add(alignments[config.alignment]);
features.setAttribute('id', 'features');

// Main 'header' element
var header = document.createElement('div');

// If the content exists, assign it to the 'header' element
if (config.toptitle) {
    var toptitle = document.createElement('h4');
    toptitle.innerText = config.toptitle;
    header.appendChild(toptitle);
}
if (config.title) {
    var titleText = document.createElement('h1');
    titleText.innerText = config.title;
    header.appendChild(titleText);
}
if (config.byline) {
    var bylineText = document.createElement('p');
    bylineText.classList.add("byline");
    bylineText.innerText = config.byline;
    header.appendChild(bylineText);
}
if (config.description) {
    var descriptionText = document.createElement('p');
    descriptionText.innerHTML = config.description;
    header.appendChild(descriptionText);
}

// If the header has anything in it, it gets appended to the story
if (header.innerText.length > 0) {
    header.classList.add(config.theme);
    header.setAttribute('id', 'header');
    story.appendChild(header);
}

/* After building the elements and assigning content to the header these
functions will loop through the chapters in the config.js file,
create the vignette elements and assign them their respective content */

config.chapters.forEach((record, idx) => {
    /* These first two variables will hold each vignette, the chapter
    element will go in the container element */
    var container = document.createElement('div');
    var chapter = document.createElement('div');
    // Creates the title for the vignettes
    if (record.title) {
        var title = document.createElement('h3');
        title.innerText = record.title;
        chapter.appendChild(title);
    }
    // Creates the image for the vignette
    if (record.image) {
        var image = new Image();
        image.src = record.image;
        chapter.appendChild(image);
    }
    // Creates the image credit for the vignette
    if (record.imageCredit) {
        var imageCredit = document.createElement('p');
        imageCredit.classList.add('imageCredit');
        imageCredit.innerHTML = 'Image credit: ' + record.imageCredit;
        chapter.appendChild(imageCredit);
    }
    // Creates the video for the vignette
    if (record.video) {
        var story = document.createElement('div');
        story.innerHTML = record.video;
        chapter.appendChild(story);
    }
    if (record.soundcloud) {
        var story = document.createElement('div');
        story.innerHTML = record.soundcloud;
        chapter.appendChild(story);
    }
    // Creates the description for the vignette
    if (record.description) {
        var story = document.createElement('p');
        story.innerHTML = record.description;
        chapter.appendChild(story);
    }
    // Sets the id for the vignette and adds the step css attribute
    container.setAttribute('id', record.id);
    container.classList.add('step');
    if (idx === 0) {
        container.classList.add('active');
    }
    // Sets the overall theme to the chapter element
    chapter.classList.add(config.theme);
    /* Appends the chapter to the container element and the container
    element to the features element */
    container.appendChild(chapter);
    features.appendChild(container);
});

// Appends the features element (with the vignettes) to the story element
story.appendChild(features);

/* Next, this section creates the footer element and assigns it
its content based on the config.js file */

var footer = document.createElement('div');
// This assigns all the content to the footer element
if (config.footer) {
    var footerText = document.createElement('p');
    footerText.innerHTML = config.footer + '<br>' + config.footerAttribution;
    footer.appendChild(footerText);
}
// If the footer element contains any content, add it to the story
if (footer.innerText.length > 0) {
    footer.classList.add(config.theme);
    footer.setAttribute('id', 'footer');
    story.appendChild(footer);
}

// Adds the Mapbox access token
mapboxgl.accessToken = config.accessToken;

// Honestly, don't know what this does
const transformRequest = (url) => {
    const hasQuery = url.indexOf("?") !== -1;
    const suffix = hasQuery ? "&pluginName=journalismScrollytelling" : "?pluginName=journalismScrollytelling";
    return {
        url: url + suffix
    }
}

/* This section creates the map element with the
attributes from the main section of the config.js file */

const map = new mapboxgl.Map({
    container: 'map',
    style: config.style,
    center: config.chapters[0].location.center,
    zoom: config.chapters[0].location.zoom,
    bearing: config.chapters[0].location.bearing,
    pitch: config.chapters[0].location.pitch,
    scrollZoom: false,
    transformRequest: transformRequest
});

map.on('style.load', () => {
    
    map.addSource('mapbox-dem', {
    'type': 'raster-dem',
    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
    'tileSize': 512,
    'maxzoom': 14
    });
    // add the DEM source as a terrain layer with exaggerated height
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
});

// Instantiates the scrollama function
const scroller = scrollama();

/* Here we add the two extra layers we are using, just like in our previous
tutorial. At the end, however, we setup the functions that will tie the
scrolling to the chapters and move the map from one location to another
while changing the zoom level, pitch and bearing */

map.on("load", function () {
    // This is the function that finds the first symbol layer
    var layers = map.getStyle().layers;
    var firstSymbolId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }
    // Add the first new layer
    map.addLayer({
        'id': 'turnstileData',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': '/assets/data/turnstileData.geojson'
        },
        'paint': {
            'circle-color': ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
                -1, '#ff4400',
                -0.7, '#ffba31',
                -0.4, '#ffffff'
            ],
            'circle-stroke-color': '#4d4d4d',
            'circle-stroke-width': 0.5,
            'circle-radius': ['interpolate', ['exponential', 2], ['zoom'],
                10, ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
                    -1, 10,
                    -0.4, 1
                ],
                15, ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
                    -1, 25,
                    -0.4, 12
                ]
            ],
        }
    }, firstSymbolId);
    // Add the second new layer
    map.addLayer({
        'id': 'medianIncome',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': '/assets/data/medianIncome.geojson'
        },
        'paint': {
            'fill-color': ['step', ['get', 'MHHI'],
                '#ffffff',
                20000, '#ccedf5',
                50000, '#99daea',
                75000, '#66c7e0',
                100000, '#33b5d5',
                150000, '#00a2ca'],
            'fill-opacity': ['case', ['==', ['get', 'MHHI'], null], 0, 0.65]
        }
    }, 'turnstileData');
    // Setup the instance, pass callback functions
    scroller
        .setup({
            step: '.step',
            offset: 0.5,
            progress: true
        })
        .onStepEnter(response => {
            var chapter = config.chapters.find(chap => chap.id === response.element.id);
            response.element.classList.add('active');
            map.flyTo(chapter.location);
            if (config.showMarkers) {
                marker.setLngLat(chapter.location.center);
            }
            if (chapter.onChapterEnter.length > 0) {
                chapter.onChapterEnter.forEach(setLayerOpacity);
            }
        })
        .onStepExit(response => {
            var chapter = config.chapters.find(chap => chap.id === response.element.id);
            response.element.classList.remove('active');
            if (chapter.onChapterExit.length > 0) {
                chapter.onChapterExit.forEach(setLayerOpacity);
            }
        });

    // Create the popup
    map.on('click', 'turnstileData', function (e) {
        console.log('click event', e);
        let entriesDiff = e.features[0].properties.ENTRIES_DIFF;
        let entries_06 = e.features[0].properties.ENTRIES_06;
        let entries_20 = e.features[0].properties.ENTRIES_20;
        let stationName = e.features[0].properties.stationName;
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(stationName + '<br>' + entriesDiff + '%' + '<br>' + entries_06 + '<br>' + entries_20)
            .addTo(map);
    });
    // Change the cursor to a pointer when the mouse is over the turnstileData layer.
    map.on('mouseenter', 'turnstileData', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'turnstileData', function () {
        map.getCanvas().style.cursor = '';
    });
});

/* Here we watch for any resizing of the screen to
adjust our scrolling setup */
window.addEventListener('resize', scroller.resize);

// mapboxgl.accessToken = 'pk.eyJ1Ijoid3NnNHciLCJhIjoiTVd4cXdScyJ9.ypK9cLCVFReavCn9b_hhWQ';
// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v12',
//     zoom: 10,
//     center: [-74, 40.725],
//     maxZoom: 15,
//     minZoom: 8,
//     maxBounds: [[-74.45, 40.45],[-73.55, 41]]
// });

// map.on('load', function () {
//     var layers = map.getStyle().layers;
//     var firstSymbolId;
//     for (var i=0; i<layers.length; i++){
//         if (layers[i].type === 'symbol'){
//             firstSymbolId = layers[i].id;
//             break;
//         }
//     }
//     map.addLayer({
//         'id': 'turnstileData',
//         'type': 'circle',
//         'source': {
//             'type': 'geojson',
//             'data': 'data/turnstileData.geojson'
//         },
//         'paint': {
//             'circle-color': ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
//                 -1, '#ff4400',
//                 -0.7, '#ffba31',
//                 -0.4, '#ffffff'],
//             'circle-stroke-color': '#4d4d4d',
//             'circle-stroke-width': 0.5,
//             'circle-radius': ['interpolate', ['exponential', 2], ['zoom'],
//                 10, ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
//                     -1, 10,
//                     -0.4, 1],
//                 15, ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
//                     -1, 25,
//                     -0.4, 12],
//                 ]
//         }
//     }, firstSymbolId);
//     map.addLayer(
//       {
//         id: "medianIncome",
//         type: "fill",
//         source: {
//           type: "geojson",
//           data: "data/medianIncome.geojson",
//         },
//         paint: {
//           "fill-color": ['step', ['get', 'MHHI'],
//             '#ffffff',
//             20000, '#ccedf5',
//             50000, '#99daea',
//             75000, '#66c7e0',
//             100000, '#33b5d5',
//             150000, '#00a2ca']
//         },
//       },
//       "waterway-shadow"
//     );
// });

