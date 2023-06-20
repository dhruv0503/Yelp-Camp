mapboxgl.accessToken =  mapToken;
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: camp.geometry.coordinates,
        zoom: 9
    });

    map.addControl(new mapboxgl.NavigationControl());

    new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset : 25})
            .setHTML(
                `<h4>${camp.title}</h4><p>${camp.location}</p>`
            )
    )
    .addTo(map);