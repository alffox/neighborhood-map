var map;

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 62.276329,
            lng: -6.855419
        },
        zoom: 10,
        gestureHandling: 'greedy'
    });
    var tribeca = {
        lat: 62.276329,
        lng: -6.855419
    };
    var marker = new google.maps.Marker({
        position: tribeca,
        map: map,
        title: 'First Marker!'
    });
}