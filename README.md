# Neighborhood Map

## Project Overview

This project is a Single Page Application featuring a map of [Faroe Islands](https://en.wikipedia.org/wiki/Faroe_Islands)  neighborhood with 5 points of interest in the mid and north region of the archipelago.

The map includes the following features: highlighted locations, filtered search and third-party pictures about those locations.

## Running the App
### Method #1: Run the app hosted on github
1) Simply find the app hosted on this site: https://alffox.github.io/neighborhood-map/

### Method #2: Clone the repo and run it locally on your computer
1) In a directory of your local disk, open a command prompt (Windows) or a terminal window (-nix OS) and run:

    `git clone https://github.com/alffox/neighborhood-map.git`

2) Unzip the repo and open `index.html` with a text editor
3) Locate this line at the end of the file:

`<script defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBsIBNOK4MKVdeJYkugTaC7SGUekg4ine4&callback=initMap" onerror="googleError()"></script>`

Replace the alphanumerical string after `?key=` with your Google Maps API key. Please see this site for more info: https://developers.google.com/maps/documentation/javascript/get-api-key

4) Once done, save the changes and open `index.html` with your browser

## Using the App
When opening the page for the first time, 5 red markers on the map, indicating 5 points of interests in the Faroe Islands will appear.
To get the locality name and a picture for that location, simply click on the marker.
You'll find a hamburger icon on the top-left bar. Once you click on it, the list of the same locations shown on the map will open. Clicking on each location in the list will have the same effect of clicking on the related marker on the map.
On top of the list, you'll find also a search box. To filter the locations by letter, start typing letters in the text box, the filtered search, both on list and markers locations, will work on "real time" mode

## Third-party libraries and technical specs
The app uses the following third-party libraries:

 - [Google Maps API](https://developers.google.com/maps/)
 - [Flickr API](https://www.flickr.com/services/api/) to fetch the location images
 - [Knockout.js](http://knockoutjs.com/) v. 3.4.2 to handle the ViewModel on non-Google Maps components
 - [Bootstrap CSS and JS](https://getbootstrap.com/docs/4.0/getting-started/introduction/) v. 4.0 to make the app responsive
 - [jQuery](https://jquery.com/) v. 3.3.1 to support Bootstrap and to perform some basic DOM parsing/manipulations on non-Google Maps components