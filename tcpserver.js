var net = require('net');
var mongojs = require('mongojs');
//infinite loop
var InfiniteLoop = require('infinite-loop');
var il = new InfiniteLoop;
var interval = 2000;
var toleranceInterval = 5000;

//db object that connect to mongodb
var db = mongojs('devicesdb', ['devices']);


var HOST = '127.0.0.1';
var PORT = 6969;


/*
Infinite loop
*/
//iterate and check data inside the array
function IterateAndHandleData(docs){
	//save current time
	var currentTime = new Date();
	
	//iterate through the array
	for(var i = 0, len = docs.length; i < len; i++){
		var element = docs[i];
		//fetch last updated time
		var lastUpdatedTime = element.lastUpdated;
		
		//get the time difference
		var timeDifference = currentTime - lastUpdatedTime;
		
		//check if it is more than a value specified
		if(timeDifference>toleranceInterval){
			//then this device have a problem
			
			console.log("Error with "+element.deviceName);
			//update remote state as ERROR
			element.remote_state = "ERROR";
			
			//save element
			db.devices.save(element);
			
		}
		
	}
	
}

//task to run infinitely
function CheckTimeInterval() {
	/*
	In thid function, I should check time interval that
	remote device updates inside the db
	if time interval is more than 5 sec, consider that device is not working
	*/
	
	//fetch all data from db
	db.devices.find(function(err, docs) {
		// docs is an array of all the documents in devices
		if(err || docs===null){
			console.log("No entri inside the db");
			return false;
		}
		else{
			var len = docs.length;
			console.log("found "+len+" items from db");
			//iterate through the array
			IterateAndHandleData(docs);
		}
	});
}

//add it by calling .add
il.add(CheckTimeInterval);
il.setInterval(interval);
il.run();


/*
Infinete loop over
*/




// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection

function handleData(data,sock){
	
	
	//stringfy data
	data = data+"";
	
	//print recived data
	console.log("handle called for "+data);
	//You will get a string formatted as json ex:{"id":"abcdefgh","state":"OFF"}
	//id:identifier of the device(mac address)
	//state:current state of the remote device
	
	//fetch remote data
	var remoteData = "";
	try {
		remoteData = JSON.parse(data);
	} catch (e) {
	  // An error has occured, handle it, by e.g. logging it
	  console.log(e);
	  return false;
	}
	//parsed remote data
	console.log(remoteData);
	
	
	//now you can fetch id and remote state
	var id = remoteData.id;
	var remote_state = remoteData.state;

	//fetch entry from db to get state
	db.devices.findOne({
				deviceID:id
				}, function(err, entry) {
				if(err || entry===null){
					console.log("sorry no entry for "+id);
					//send error message
					sock.write("error");
					return false;
				}
				else{
					console.log("found entry for "+id);
					console.log(entry);
						
					//I should set remote_state of db entry from json data I recieved
					entry.remote_state = remote_state;
					//I should set current dateTime to know the device is working
					entry.lastUpdated= new Date();
					
					//then save it
					db.devices.save(entry);
					console.log("saved new state");
					
					//reply the requesting device
					sock.write(entry.state+"");
					
					//logging state
					console.log("served the client "+id +" with state "+entry.state);
					
				}
			});
	
}



net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        
        console.log('DATA: '+data+" from:"+sock.remoteAddress);
		handleData(data,sock);  
        
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });
    
}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);