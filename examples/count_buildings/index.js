'use strict';

var tileReduce = require('../../src');
var path = require('path');

var turf = require('@turf/turf');
var argv = require('minimist')(process.argv.slice(2));

// Pass area from command line
//var area = JSON.parse(argv.area);

// Options: zoom level, tile source(s), processor to run)
var opts = {
 zoom: 15,
 sources: [{name: 'osm', mbtiles: path.join(__dirname, '../../test/fixtures/vanuatu.mbtiles'), raw: false}],
 map: path.join(__dirname, '/count_buildings.js'),
};

//Initialize Tile Reduce
//why did TileReduce has a capital T?
//var tilereduce = TileReduce(area, opts);
var tilereduce = tileReduce(opts);
var buildings = 0;

// Accumulate results
tilereduce.on('reduce', function(result){
 buildings += result;
});

// Output results
tilereduce.on('end', function(error){
 console.log(buildings);
});

//why the need for this line below? run is not a function
//tilereduce.run();

