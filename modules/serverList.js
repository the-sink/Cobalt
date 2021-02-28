const http = require("http");

module.exports = (client) => {
    if (client.config.modules.serverList != true) {return;}
    let channel = client.config.channels.serverList;
    if (channel == "") {
        client.logger.warn("Server list module stopping! Config option \"channels.serverList\" is empty. Provide a channel ID, or disable this module.");
        return;
    }

    let port = client.config.serverListPort;

    if (port == null){
        client.logger.warn("No port number provided for server list module to start an HTTP server on. Please provide one using the \"serverListPort\" config option.");
        return;
    }

    try {
        http.createServer((req, res) => {
            let data = []
            req.on('data', chunk => {
                data.push(chunk)
            })
            req.on('end', () => {

            })
        }).listen(port);
    } catch(e) {
        client.logger.warn(`An error occured while starting the server list module's HTTP server: ${e}`);
        return;
    }
    client.logger.log(`Server listening on port ${port} for server list module.`);
}; 
