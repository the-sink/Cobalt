const fetch = require("node-fetch");
const { Configuration, OpenAIApi } = require('openai');

module.exports = async (client) => {
    try {
        const config = new Configuration({
            apiKey: client.config.openAIKey
        });

        client.openai = new OpenAIApi(config);
    } catch (err) {
        client.logger.warn(`Unable to create OpenAI API object: ${err}`);
    };

    try {
        await fetch('https://inspirobot.me/api?getSessionID=1')
            .then(res => res.text())
            .then(body => { client.settings.set('inspireSessionKey', body); });
    } catch (err) {
        client.logger.warn(`Unable to retrieve a new session key for the InspiroBot audio command: ${err}`);
    };
};