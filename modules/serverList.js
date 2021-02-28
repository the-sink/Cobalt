const { ENETUNREACH } = require("constants");
const http = require("http");
const { message } = require("noblox.js");

let servers = [];
let index = 1;
let channel;

function sendResponse(res, code, message){
    res.writeHead(code, {'Content-Type': 'text/html'});
    res.write(message);
    res.end();
}

let actions = {
    "start": function(json, res){ // Sent when a new server is created
        // If a server already exists with the same key, ignore it and send an error code
        if (servers[json.serverKey] != null){
            sendResponse(res, 500, "A server with that key is already running.");
            return;
        }

        // Create player list message
    },
    "playerAdd": function(json, res){ // Sent when a player has joined a server

    },
    "playerRemove": function(json, res){ // Sent when a player has left a server

    },
    "stop": function(json, res){ // Sent when a server is shutting down

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
    try {
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
                    client.logger.warn("Malformed/non-JSON data was sent to the server list module.");
                    return;
                }
                // Make sure the provided server key is correct, and set up a response
                if (json.serverKey == null || json.serverKey != key){
                    client.logger.warn("Server list request contained an invalid Server Key.");
                    sendResponse(res, 403, "Unauthorized");
                    return;
                }

                // Execute code for the provided call
                if (actions[json.call] != null){
                    actions[json.call](json, res);
                }
            })
        }).listen(port);
    } catch(e) {
        client.logger.warn(`An error occured while starting the server list module's HTTP server: ${e}`);
        return;
    }
    client.logger.log(`Server listening on port ${port} for server list module.`);
}; 
