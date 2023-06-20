mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'cluster-map',
style: 'mapbox://styles/mapbox/dark-v11',
center: [-103.5917, 40.6699],
zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());
 
map.on('load', () => {
    map.addSource('camps', {
        type: 'geojson',
        data: camps,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
    });
 
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'camps',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step', ['get', 'point_count'],
                'pink', 10,
                'aquamarine', 30,
                'magenta', 70,
                '#4EE787'
                ],
            'circle-radius': [
                'step', ['get', 'point_count'],
                14, 10,
                20, 30,
                40
            ]
        }
    });
 
    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'camps',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });
 
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'camps',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });
    

    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        map.getSource('camps').getClusterExpansionZoom( clusterId, (err, zoom) => {
            if (err) return;
            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
            });
        });
    });
 
    map.on('click', 'unclustered-point', (e) => {
        const {popUpMarkup} = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();
    
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
 
        new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(popUpMarkup)
        .addTo(map);
    });
    
    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });
});