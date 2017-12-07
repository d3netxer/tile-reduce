'use strict';

var tileReduce = require('../../src');
var path = require('path');

var numFeatures = 0;

//remember that OSM QA Tiles are prepared at zoom level 12, so don't enter a higher number
tileReduce({
  //bbox: [-122.05862045288086, 36.93768132842635, -121.97296142578124, 37.00378647456494],
  zoom: 12,
  map: path.join(__dirname, '/count.js'),
  sources: [{name: 'osm', mbtiles: path.join(__dirname, '../../test/fixtures/vanuatu.mbtiles'), raw: true}]
})
.on('reduce', function(num) {
  numFeatures += num;
})
.on('end', function() {
  console.log('Features total: %d', numFeatures);
});
