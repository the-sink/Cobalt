const fetch = require("node-fetch");

module.exports = async (client) => {
    var channel;

    if (client.config.channels.serverList !== undefined && client.config.modules.serverList) {
        channel = client.channels.cache.get(client.config.channels.serverList);     
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    setInterval( async () => {
        var info;
        await fetch('https://games.roblox.com/v1/games?universeIds=105407262')
            .then(res => res.json())
            .then(body => {info = body.data[0]});
        if (channel !== undefined){
            channel.setTopic(`${info.playing} online players | ${numberWithCommas(info.visits)} total visits`)
        }
        client.user.setActivity(`;help | ${info.playing} playing CVRF`, { type: 'PLAYING' });
      }, 180000);
};