var map;

// Create a new blank array for all the listing markers.
var markers = [];
var allInfoWindows = [];

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

    // Nearby locations
    var locations = [
        {title: 'Oyndarfjørður', location: {lat: 62.276329, lng: -6.855419}},
        {title: 'Klaksvík', location: {lat: 62.2271922, lng: -6.577906400000001}},
        {title: 'Gjógv', location: {lat: 62.324909, lng: -6.945313}},
        {title: 'Viðareiði', location: {lat: 62.360322, lng: -6.534988}},
        {title: 'Elduvík', location: {lat: 62.280846, lng: -6.91278}}
    ];

    var ViewModel = function() {

        /* ===== Instruct Knockout to always use native event handling and disable using jQuery for handling UI events --> As per http://knockoutjs.com/documentation/event-binding.html =====*/
        ko.options.useOnlyNativeEvents = true;

        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();

        /* ===== Below snippet is taken from the Udacity course: "Getting Started with the APIs"
        corresponding to this github repo:
        https://github.com/udacity/ud864/blob/master/Project_Code_4_WindowShoppingPart2.html =====*/

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
                lastOpenedInfoWindow =
                    // Make sure the marker property is cleared if the infowindow is closed.
                    infowindow.addListener('closeclick', function() {
                        infowindow.setMarker = null;
                    });
                allInfoWindows.push(infowindow);
            }
        }

        google.maps.event.addDomListener(window, 'resize', function() {
            var center = map.getCenter()
            google.maps.event.trigger(map, "resize")
            map.setCenter(center)
        });

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
            //ko.utils.arryFilter is used here: http://knockoutjs.com/examples/animatedTransitions.html
            return ko.utils.arrayFilter(self.locationsList(), function(location) {
                //console.log(self.location.title);
                if (location.title.toLowerCase().indexOf(self.hits().toLowerCase()) >= 0) {
                    //taken from https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
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
        }

    };

    ko.applyBindings(new ViewModel());

}