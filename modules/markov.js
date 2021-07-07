const MarkovChain = require("markovchain");
var markov = new MarkovChain('');

module.exports = async (client) => {
    client.markov = markov;
    client.markov.numMessages = 0;
};