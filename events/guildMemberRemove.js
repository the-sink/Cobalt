// This event executes when a member leaves the guild.
const fetch = require("node-fetch");

module.exports = async (client, member) => {
    let channel = client.config.channels.logChannel; 

    if (client.settings.has(`uidCache_${member.id}`)) {
        let cachedId = client.settings.get(`uidCache_${member.id}`);
        let currentRole = await client.roblox.getRankInGroup(970502, cachedId);

        if (currentRole == 2) {
            await client.roblox.setRank({group: 970502, target: cachedId, rank: 1});
            client.settings.delete(`uidCache_${member.id}`);

            if (channel != "") {
                channel.send(`\`${client.getFullUsername(member)}\` has left and has been demoted from Project Tester.`);
            }
        }
    }
};
  