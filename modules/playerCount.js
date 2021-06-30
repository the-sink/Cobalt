module.exports = async (client) => {
    if (client.roblox === undefined) {
        client.logger.warn("Skipping startup of activity module because no Roblox cookie is defined.");
        return;
    }

    var channel;

    if (client.config.channels.serverList !== undefined && client.config.modules.serverList) {
        channel = client.channels.cache.get(client.config.channels.serverList);     
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    async function main() {
        while (true) {
            var info = await client.roblox.getPlaceInfo(257223268);
            if (channel !== undefined){
                channel.setTopic(`${info.OnlineCount} online players | ${numberWithCommas(info.VisitedCount)} total visits`)
            }
            client.user.setActivity(`;help | ${info.OnlineCount} playing CVRF`, { type: 'PLAYING' })
                .catch(console.error);
            await new Promise(resolve => setTimeout(resolve, 60000)); // Updates every 60 seconds
        }
    }
      
    main();
};