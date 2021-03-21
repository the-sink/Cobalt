const finance = require("yahoo-finance");
const Enmap = require("enmap");
let economy = new Enmap({name: "economy"});

function ensureData(member){
    economy.ensure(member.id, {
        bank: 0,
        cash: 0,
        assets: {},
        lastDaily: 0
    });
}

module.exports = async (client) => {
    client.finance = {};

    client.finance.inquiry = function(member){
        ensureData(member);
        return economy.get(member.id);
    }

    /*finance.quote({
        symbol: 'BTC',
        modules: ['price']
    }, function(err, quotes){
        console.log(quotes);
    });*/
};