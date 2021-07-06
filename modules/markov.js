const Markov = require("js-markov");
var markov = new Markov();

module.exports = async (client) => {
    client.markov = markov;
    console.log(typeof(client.markov));
};