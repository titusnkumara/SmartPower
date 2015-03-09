//mongojs to connect with mongodb
var mongojs = require('mongojs');


//db object that connect to mongodb
var db = mongojs('devicesdb', ['devices']);

/*
saving example data to db
*/
var tempData = [{deviceID:"abcdefgh",deviceName:"bulb1",state:"ON"},{deviceID:"ijklmnopq",deviceName:"fan1",state:"OFF"}];

for (var i = 0, len = tempData.length; i < len; i++) {
	tempData[i].lastUpdated= new Date();
	tempData[i].remote_state= "OFF";
	db.devices.save(tempData[i]);
}

