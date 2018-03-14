var map;

// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 62.276329,
            lng: -6.855419
        },
        zoom: 9,
        gestureHandling: 'greedy'
    });

    // Nerby locations
    var locations = [
        {title: 'Oyndarfjørður', location: {lat: 62.276329, lng: -6.855419}},
        {title: 'Klaksvík', location: {lat: 62.2271922, lng: -6.577906400000001}},
        {title: 'Gjógv', location: {lat: 62.324909, lng: -6.945313}},
        {title: 'Viðareiði', location: {lat: 62.360322, lng: -6.534988}},
        {title: 'Elduvík', location: {lat: 62.280846, lng: -6.91278}}
    ];

    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    /*map.fitBounds(bounds);*/

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div>' + marker.title + '</div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.setMarker = null;
            });
        }
    }

    google.maps.event.addDomListener(window, 'resize', function() {
        var center = map.getCenter()
        google.maps.event.trigger(map, "resize")
        map.setCenter(center)
    });

    var ViewModel = function() {

        var self = this;

        this.locationsList = ko.observableArray(locations);

        this.currentLocation = ko.observable(this.locationsList()[0]);

        this.switchLocation = function(clickedLocation){
            self.currentLocation(clickedLocation);
            console.log(clickedLocation);
        };
    };

    ko.applyBindings(new ViewModel());

}