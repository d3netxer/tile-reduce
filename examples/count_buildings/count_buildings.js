'use strict';

var turf = require('@turf/turf');
var normalize = require('@mapbox/geojson-normalize');

//module.exports = function(sources, opts, done){
module.exports = function(data, tile, writeData, done) {
    // Create GeoJSON FeatureCollection from source data
    var osm = normalize(data.osm.osm);
    var buildingCount = 0;
    // Count features containing the "building" key

        osm.features.forEach(function(feature) {
        if (feature.properties.building) {
            buildingCount++;
        }
     });

    // Return results
     done(null, buildingCount);
};

/*
'use strict';
module.exports = function(data, tile, writeData, done) {
  var count = 0;
  if (data.osm.osm) count += data.osm.osm.length;
  done(null, count);
};
*/
