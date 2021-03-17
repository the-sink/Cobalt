const { ENETUNREACH } = require("constants");
const http = require("http");
const { message } = require("noblox.js");

let servers = [];
let index = 1;
let channel;

function sendResponse(res, code, message){
	try {
	    res.writeHead(code, {'Content-Type': 'text/html'});
	    res.write(message);
	    res.end();
	} catch(e) {
		client.logger.warn(`Error while sending response:  ${e}`)
	}
}

function update(json, res, add){
    let server = servers[json.serverKey];
    if (server == null){
        sendResponse(res, 500, "A server by that key does not exist.");
        return;
    };
    if (add){
        server.players.push(json.playerName);
    } else {
        server.players = server.players.filter(e => e !== json.playerName);
        if (server.players.length==0) return;
    }
    let list = server.players.join(", ") || "None";
    if (server.private == true && server.branch == "Release"){list = "*(Private)*"};
    server.message.edit("> " + ((server.branch == "Development" && ":tools:") || "") + ((server.private == true && ":lock:") || "") +" Server " + server.id + " has: **" + server.players.length + " player(s) out of 42**. It was created on: **" + server.created +"**.\n Currently online: " + (list));
    sendResponse(res, 200, "Success");
}

let actions = {
    "start": function(json, res){ // Sent when a new server is created
        // If a server already exists with the same key, ignore it and send an error code
        if (servers[json.serverKey] != null){
            sendResponse(res, 500, "A server with that key is already running.");
            return;
        }

        // Create player list message
        let msg;
        index++;
        channel.send(`> :white_check_mark: Server ${index} was created. Waiting for players...`).then(message => {
            msg = message;
            servers[json.serverKey] = {
                id: index,
                message: msg,
                players: [],
                created: new Date().toUTCString(),
                branch: json.branch || "?",
                private: json.private
            }
        });
        sendResponse(res, 200, "Success");
    },
    "playerAdd": function(json, res){ // Sent when a player has joined a server
        if (json.playerName != null){
            update(json, res, true);
        } else {
            sendResponse(res, 500, "No player name provided.");
        }
    },
    "playerRemove": function(json, res){ // Sent when a player has left a server
        if (json.playerName != null){
            update(json, res, false);
        } else {
            sendResponse(res, 500, "No player name provided.");
        }
    },
    "stop": function(json, res){ // Sent when a server is shutting down
        if (servers[json.serverKey] == null){
            sendResponse(res, 500, "A server with that key does not exist.");
            return;
        }

        // Remove server message and clear from list
        servers[json.serverKey].message.delete();
        delete servers[json.serverKey];
        sendResponse(res, 200, "Success");
    }
}

module.exports = (client) => {
    if (client.config.modules.serverList != true) return;
    channel = client.config.channels.serverList; 
    if (channel == "") {
        client.logger.warn("Server list module stopping! Config option \"channels.serverList\" is empty. Provide a channel ID, or disable this module.");
        return;
    }

    let port = client.config.serverListPort;
    if (port == null){
        client.logger.warn("No port number provided for server list module to start an HTTP server on. Please provide one using the \"serverListPort\" config option.");
        return;
    }

    let key = client.config.serverListKey;
    if (key == null || key == ""){
        client.logger.warn("No server list key exists, or the config value is blank. A blank server list key is not allowed as this poses a security risk.");
        return;
    }

    channel = client.channels.cache.get(channel);

    // Remove all bot-created messages from the list channel (potentially old server records that weren't properly deleted)
    channel.messages.fetch({
        limit: 20
    }).then((messages) => {
        let listMessages = [];
        messages.filter(message => message.author.id === client.user.id).forEach(message => listMessages.push(message));
        channel.bulkDelete(listMessages);
    })

    // Start the HTTP server to listen for server list updates
    http.createServer((req, res) => {
        let data = []
        req.on('data', chunk => {
            data.push(chunk)
        })
        req.on('end', () => {
            let json;
            // Check if the data is correctly formatted JSON or not
            try {
                json = JSON.parse(data);
            } catch(e) {
                sendResponse(res, 200, "Success"); // malformed or request is being sent to check if server is online, send success and ignore it
                return;
            }
            // Make sure the provided auth key is correct, and set up a response
            if (json.authKey == null || json.authKey != key){
                client.logger.warn("Server list request contained an invalid Server Key.");
                sendResponse(res, 403, "Unauthorized");
                return;
            }

            // Execute code for the provided action
            if (actions[json.action] != null){
                actions[json.action](json, res);
            }
        })
    }).listen(port).once('error', (err) => {client.logger.warn(`An error occured while starting the server list module's HTTP server: ${err}`);});
    client.logger.log(`Server listening on port ${port} for server list module.`);
}; 
