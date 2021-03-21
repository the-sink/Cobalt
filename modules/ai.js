const fetch = require("node-fetch");

module.exports = async (client) => {
    try {
        await fetch('https://inspirobot.me/api?getSessionID=1')
            .then(res => res.text())
            .then(body => { client.settings.set('inspireSessionKey', body); });
    } catch (err) {
        client.logger.warn(`Unable to retrieve a new session key for the InspiroBot audio command: ${err}`);
    };
};