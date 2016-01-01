var ds18b20 = require('ds18b20');
var ip = require("ip");
var config = require('config');


var token = config.get('TOKEN')
var smarthome_url = config.get('SMARTHOME_URL')
var homeId = config.get('HOME_ID')


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
		sendTemperature(id, value);
	});
}

function sendTemperature(sensorId, temperature) {
	request.post(smarthome_url + '/homes' + homeId + '/temperature/sensors' + sensorId,
		{auth: {basic: token}, json: {value: temperature}}, function (err, resp) {

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


