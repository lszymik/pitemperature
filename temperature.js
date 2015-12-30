var ds18b20 = require('ds18b20');
var RADIATOR = '28-031467bacdff';
var ROOM = '28-0115621a55ff';

var config = require('config');
var ip = require("ip");

var sensors = {};
sensors[ROOM] = 22.7;
sensors[RADIATOR] = 44.3;

function readSensors(){
  ds18b20.sensors(function (err, ids) {
    if (err) {
      console.error(err);
      return;
    }
    ids.forEach(function (id) {
          setInterval(function () {
            readTemp(id);
          }, 60000);
        }
    );
  });
}

function readTemp(id) {
  ds18b20.temperature(id, function (err, value) {
    if (err) {
      return console.error(err);
    }
    console.log('Sensor %s temperature %s', id, value);
    sensors[id] = value;
  });
}

console.log( ip.address() );

readSensors();


