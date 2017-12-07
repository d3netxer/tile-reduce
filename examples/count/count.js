'use strict';

module.exports = function(data, tile, writeData, done) {
  var count = 0;
  if (data.osm.osm) count += data.osm.osm.length;
  //if (data.osm.buildings) count += data.osm.buildings.length;
  done(null, count);
  //console.log(data);
};
