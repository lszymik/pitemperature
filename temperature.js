var ds18b20 = require('ds18b20');
var ip = require("ip");
var config = require('config');
var request = require('request');


var token = config.get('smarthome.token')
var smarthome_url = config.get('smarthome.url')
var homeId = config.get('smarthome.homeId')


function readSensors() {
	ds18b20.sensors(function (err, ids) {
		if (err) {
			console.error(err);
			return;
		}
		ids.forEach(function (id) {
				setInterval(function () {
					readTemp(id);
				}, 10000);
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
		// sendTemperature(id, value);
	});
}

function sendTemperature(sensorId, temperature) {
	var requestUrl = smarthome_url + '/homes/' + homeId + '/temperature/sensors/' + sensorId;
	console.log(requestUrl);

	request.post(requestUrl,
		{auth: {username: 'admin', password: token}, json: {value: temperature}}, function (err, resp) {

			if (err) {
			return console.error(err);
		}
		if (resp.statusCode !== 201) {
			return console.error("Temperature for sensor %s has not been sent. Response code %s", sensorId, resp.statusCode);
		}
	});
}

console.log(ip.address());

readSensors();


