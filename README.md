# SmartPower
Smart Power allows you to control electronic devices with ESP8266 WiFi module and Node.js/Mongodb server


To install required node modules run command "npm install"

Start the mongodb server with command "mongod --dbpath=./data"

Run dbseed.js file to fill the database with sample data "node dbseed.js"

Run the tcpserver and listen "node tcpserver.js"


You can test the application with running difference instance of virtualDevice.py

run it with "python virtualDevice.py"



#To run the client code in esp8266 module

Setup the environment following instructions on http://www.esp8266.com/viewtopic.php?f=9&t=820

import the project "wifi-sta-tcp-client" to eclipse

set portNumbers and IP addresses inside the "user_config.h" file

clean,build and flash the module with this code




