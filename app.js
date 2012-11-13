/*
 * Hello SymNode - A simple telnet interface for SymConnect.
 */

var config;

// ----------------------------------------------------------------------------
// -- SymConnect Configuration Section
// ----------------------------------------------------------------------------

config = {
	server: { // ip address of host and the ports assigned to symconnect
		addr: '10.1.1.1', 
		ports: [13120, 13121, 13122, 13123] 
	},
	settings: { // SymConnect settings
		unit_number: 0,
		unit_type: 'INTERNAL',
		card_number: 50500000,
		card: 'CARD'
	},
	test: { // Test account settings
		account: '123456',
		email: 'example@example.com',
		repgen: 'DIAXIS.XMEMBERINFO'
	}
}

// ----------------------------------------------------------------------------
// -- End SymConnect Configuration Section
// ----------------------------------------------------------------------------
// -- DO NOT CHANGE ANYTHING BELOW THIS LINE
// ----------------------------------------------------------------------------

var net = require('net'), clients = [];

// Open a connection to SymConnect and keep it open
var symconnect = new net.Socket();
symconnect.connect(config.server.ports[0], config.server.addr, function() {	
	
	// Listener event that gets data back from SymConnect
	symconnect.on('data', function(data){		
	
		// Create an array based on the data returned from SymConnect
		var array = data.toString().split('~');

		// The ip address and port of the client who sent the request is part
		// of the message id. Get that from the array we just created
		var client = array[1].split('#');

		// Broadcast the raw message back to the client
		broadcast('RECV: ' + data, client[0]);

		// Broadcast the message as JSON back to the client
		broadcast('JSON: ' + JSON.stringify(array), client[0]);
	});
});

// Start a telnet server so you can connect to it and issue example commands
net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 

  // Put this new client in the list
  clients.push(socket);

  // Send a nice welcome message and announce
  socket.write("Welcome to SymNode " + socket.name + "\n");
  broadcast(socket.name + " joined the SymNode server\n", socket);

  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    
	// Clean the input so we can see what type of message they sent
	var cleanData = cleanInput(data);
	
	// Create a Date in JSON format - used as part of the MessageID for SymConnect
	var jsonDate = new Date().toJSON();
	
	// Variable to hold generated MessageID
	var messageID = socket.name + '#' + jsonDate;
	
	// Variable to hold generated symconnet message
	var message; // SymConnect messages need a NEWLINE at the end of message!
	
	// Figure out what message to send
	if (cleanData === '@quit') {
		socket.end('Goodbye. \n');
	}
	else if (cleanData === 'RG' || cleanData === 'rg') {
		message = 'RG~' + messageID 
				+ '~A' + config.settings.unit_number 
				+ '~B' + config.settings.unit_type 
				+ '~D' + config.settings.card 
				+ '~F' + config.settings.card_number + config.test.account
				+ '~G' + config.test.repgen
				+ '~J1=1'
				+ '\n';
				
		broadcast('SEND: ' + message, socket);
		symconnect.write(message);	
	}
	else if (cleanData === 'IQ' || cleanData === 'iq') {
		message = 'IQ~' + messageID 
			+ '~A' + config.settings.unit_number
			+ '~B' + config.settings.unit_type
			+ '~D' + config.settings.card
			+ '~F' + config.settings.card_number  
			+ config.test.account
			+ '~HACCOUNT:NAME~JTYPE=00~JLOCATOR~JEMAIL'
			+ '\n';
			
		broadcast('SEND: ' + message, socket);
		symconnect.write(message);
	}
	else if (cleanData === 'FM' || cleanData === 'fm') {
		message = 'FM~' + messageID 
			+ '~A' + config.settings.unit_number
			+ '~B' + config.settings.unit_type
			+ '~D' + config.settings.card 
			+ '~F' + config.settings.card_number 
			+ config.test.account
			+ '~HACCOUNT:NAME~JEMAIL=' 
			+ config.test.email
			+ '\n';
			
		broadcast('SEND: ' + message, socket);
		symconnect.write(message);
	}
	else {		
		broadcast('Invalid message: ' + cleanData + '\n', socket);
	}		
  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(socket.name + " left the SymNode server\n");
  });
  
  // Send a message to client who issued the command
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      if (client === sender) {
		client.write(message);
	  }
    });
    // Log it to the server output too
    console.log(message);
  }

}).listen(3000);

// Put a friendly message on the terminal of the server.
console.log("SymNode server running at port 3000\n");

// Helpers
// Send a message to client who issued the command
function broadcast(message, sender) {
	clients.forEach(function (client) {
		if (client.name === sender) {
			client.write(message);
		}
	});
    // Log it to the server output too
    console.log(message);
}

// Cleans the input of carriage return, newline
function cleanInput(data) {
	return data.toString().replace(/(\r\n|\n|\r)/gm, "");
}