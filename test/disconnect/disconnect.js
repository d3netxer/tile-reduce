//identify disconnected major roads
var turf = require('turf');
var tilebelt = require('tilebelt');

module.exports = function(tileLayers, tile){
  var bbox = tilebelt.tileToBBOX(tile);
  var minDistance = 50/5280; // 50 ft in miles
  var disconnects = turf.featurecollection([]);
  var caps = [];

  // Types we are looking for disconnected ends for
  var preserve_type = { "motorway" : true, "primary" : true, "secondary" : true, "tertiary" : true, "trunk": true };

  // Classes that we don't want to suggest that they should connect to
  var reject_class = { "major_rail" : true, "minor_rail" : true, "aerialway" : true };

try {
  for (layer in tileLayers.streets) {
    var i, j, k;

    for (i = 0; i < tileLayers.streets[layer].features.length; i++) {
      var line = tileLayers.streets[layer].features[i];

      if (preserve_type[line.properties.type] && (line.geometry.type === 'LineString' || line.geometry.type === 'MultiLineString')) {
        var ends = [
          line.geometry.coordinates[0],
          line.geometry.coordinates[line.geometry.coordinates.length-1]
        ];

        // It's not dangling if it's a loop connecting back to itself
        if (ends[0][0] == ends[1][0] && ends[0][1] == ends[1][1]) {
          continue;
        }

        ends.forEach(function(end){
          if (end[0] < bbox[0] || end[0] > bbox[2] || end[1] < bbox[1] || end[1] > bbox[3]) {
            return;
          }

          var dup = false;

          for (layer2 in tileLayers.streets) {
            for (j = 0; j < tileLayers.streets[layer2].features.length; j++) {
              if (layer === layer2 && i == j) {
                continue;
              }

              var line2 = tileLayers.streets[layer2].features[j];

              for (k = 0; !dup && k < line2.geometry.coordinates.length; k++) {
                if (end[0] === line2.geometry.coordinates[k][0] && end[1] === line2.geometry.coordinates[k][1]) {
                  dup = true;
                }
              }
            }
          }

          if (!dup) {
            caps.push({layer: layer, i: i, point: turf.point(end), line: line});
          }
        });
      }
    }
  }

  caps.forEach(function(cap) {
    var best = Number.MAX_VALUE;
    var bestline = null;

    for (layer in tileLayers.streets) {
      var i;

      for (i = 0; i < tileLayers.streets[layer].features.length; i++) {
        if (layer == cap.layer && i == cap.i) {
          continue;
        }

        var line = tileLayers.streets[layer].features[i];

        if (!reject_class[line.properties.class] && (line.geometry.type === 'LineString' || line.geometry.type === 'MultiLineString')) {
          var distance = turf.distance(cap.point, turf.pointOnLine(line, cap.point));

          if (distance < best) {
            best = distance;
            bestline = line;
          }
        }
      }
    }

    if (best < minDistance && best != 0) {
      disconnects.features.push(cap.point);
      console.log((best * 5280) + " http://www.openstreetmap.org/edit#map=24/" + cap.point.geometry.coordinates[1] + "/" + cap.point.geometry.coordinates[0] + " " + JSON.stringify(cap.point) + " " + JSON.stringify(bestline));
    }
  });
} catch (e) { console.log(e.stack) }
  
  // return points where distance is less than 50 feet
  return disconnects;
}
