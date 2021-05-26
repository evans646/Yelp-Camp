mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/bright-v8', // stylesheet location
    center:  campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
    draggable: true,
    color:'rgb(2, 131, 131)'
});
//console.log(campground.geometry)
map.addControl(new mapboxgl.NavigationControl());
new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)
