// Maps global variables
var map;
var mapCenter = {
    lat: 62.449771,
    lng: -6.745059
};
var markers = [];
var allInfoWindows = [];

// Nearby locations
var locations = [
    {title: 'Oyndarfjørður', location: {lat: 62.276329, lng: -6.855419}},
    {title: 'Klaksvík', location: {lat: 62.2271922, lng: -6.577906400000001}},
    {title: 'Gjógv', location: {lat: 62.324909, lng: -6.945313}},
    {title: 'Viðareiði', location: {lat: 62.360322, lng: -6.534988}},
    {title: 'Elduvík', location: {lat: 62.280846, lng: -6.91278}}
];

/*Handling Google Maps API call's fallback*/
function googleError() {
    document.getElementsByTagName('BODY')[0].innerHTML = '<div class="container text-center"><div class="alert alert-danger"><strong>Error !</strong><br>We are sorry :(<br>A problem has occurred while trying to load the Google Maps API.<br>You may <a href="https://github.com/alffox">contact the developer</a> or <a href="https://alffox.github.io/memory-game/">play an online game</a> instead.</div></div>';
    }

function initMap() {

    // Constructor creates a new map
    /* ===== Below Google Maps code snippets are inspired by the Udacity course: "Getting Started with the APIs", corresponding to this github repo:
    https://github.com/udacity/ud864/blob/master/Project_Code_4_WindowShoppingPart2.html =====*/
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 8,
        gestureHandling: 'greedy'
    });
    ko.applyBindings(new viewModel());
}

var viewModel = function() {

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

        // Before pushing the marker to the markers array, cast it to the respective location
        locations[i].marker = marker;

        // Push the marker to our array of markers.
        markers.push(marker);

        // Avoid using function in a loop, call a named function outside instead: https://discourse-cdn-sjc3.com/udacity/uploads/default/original/4X/e/4/8/e48bb6894051c278b20ff0261569736732f725bf.jpg
        markerHandler(this);

        bounds.extend(markers[i].position);
    }

        // Create onclick events to open an infowindow at each marker and bounce it.
        function markerHandler(param) {
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            toggleBounce(this, marker);
        });
    }

    // Extend the boundaries of the map for each marker
    //map.fitBounds(bounds);

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow) {

        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {

            //Clear info from previously clicked location
            infowindow.setContent();

            infowindow.marker = marker;

            //infowindow.setContent('<div class="infowindow"><div class="place-name">' + marker.title + '</div></div>');

            // Flickr API call. Example taken from http://api.jquery.com/jquery.getjson/
            //For usage, see here: https://www.flickr.com/services/feeds/docs/photos_public/
            var flickerAPI = 'http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';
            $.getJSON(flickerAPI, {
                    tags: marker.title,
                    tagmode: 'any',
                    format: 'json'
                })
                .done(function(data) {
                    $.each(data.items, function(index, item) {

                        infowindow.setContent('<div class="infowindow"><div class="place-name">' + marker.title + '</div></div><img class="img-thumbnail" src="' + item.media.m + '" alt="' + marker.title + '">');
                        map.setCenter(mapCenter);
                        if (index === 0) {
                            return false;
                        }
                    });
                })
                .fail(function() {
                    infowindow.setContent('<div class="infowindow"><div class="place-name">' + marker.title + '</div></div><br><div class="alert alert-danger">We are sorry :(<br>A problem has occurred<br>while trying to load a Flickr<br>imagefor this location.</div>');
                });

            infowindow.open(map, marker);

            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.setMarker = null;
            });
            allInfoWindows.push(infowindow);
        }
    }

    // Center map upon resizing
    google.maps.event.addDomListener(window, 'resize', function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    // Bouncing feature from https://developers.google.com/maps/documentation/javascript/examples/marker-animations
    function toggleBounce(marker) {
        if (marker.getAnimation() === null) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1000); //Stop bouncing after ~2 times
        } else {
            marker.setAnimation(google.maps.Animation.NULL);
        }
    }

    /* ===== Readapted code from the Udacity course: "Using an Organization Library" =====*/
    var self = this;

    this.locationsList = ko.observableArray(locations);

    this.currentLocation = ko.observable(this.locationsList()[0]);

    this.switchLocation = function(clickedLocation) {

        // Trigger click event, as per https://developers.google.com/maps/documentation/javascript/reference/3/ (Events)
        google.maps.event.trigger(clickedLocation.marker, 'click');
    };

    this.hits = ko.observable('');

    this.filter = ko.computed(function() {

        //Filter function that will only display matched list items and markers in "real time" upon typing.
        //ko.utils.arryFilter, as used here: http://knockoutjs.com/examples/animatedTransitions.html
        return ko.utils.arrayFilter(self.locationsList(), function(location) {
            if (location.title.toLowerCase().indexOf(self.hits().toLowerCase()) >= 0) {

                //This part is taken from https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
                location.marker.setVisible(true);
                return true;
            } else {
                location.marker.setVisible(false);
                return false;
            }
        });
    });

    /*Upon searching within the list, close the previouly opened infowindow*/
    this.clearInfoWindow = function() {
        for (var i = 0; i < allInfoWindows.length; i++) {
            allInfoWindows[i].close();
        }
    };

};