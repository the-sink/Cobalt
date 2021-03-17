const fetch = require("node-fetch");
const Discord = require("discord.js");

exports.run = async (client, message, args, level) => {
    if (client.roblox == null){
        client.sendEmbed(message, {
            title: "Bot Error",
            description: "``noblox.js`` is currently unavailable. Please notify the bot owner if this command is supposed to be enabled.",
            color: 0xee3333
        });
        client.logger.warn("Someone tried to run \"becometester\" but noblox.js is not accessible. Maybe client.robloxCookie is empty/doesn't exist?");
    }

    message.channel.startTyping();
    try {
        await fetch(`https://verify.eryn.io/api/user/${message.author.id}`)
        .then(res => res.json())
        .then(body => {
            if (body.status == "ok"){ // Successfully obtained Roblox account
                (async () => {
                    let name = body.robloxUsername;
                    let id = body.robloxId;
                    let authorData = {name: name, image: `https://www.roblox.com/headshot-thumbnail/image?userId=${id}&width=420&height=420&format=png`, url: `https://www.roblox.com/users/${id}/profile`};
                    let currentRole = await client.roblox.getRankInGroup(970502, id);
                    switch (currentRole) {
                        case 1:
                            let role = message.guild.roles.cache.find(role => role.name === "Tester");
                            let success = true;
                            client.settings.set(`uidCache_${message.author.id}`, id);
                            await client.roblox.setRank({group: 970502, target: id, rank: 2}); // group id, user id, and new rank id
                            message.member.roles.add(role).catch(err => {
                                success = false;
                                client.logger.warn(`Error while attempting to give user the Tester role: ${err}`);
                            });
                            if (success) {
                                client.sendEmbed(message, {
                                    title: "Promotion Success",
                                    description: "You have been promoted to the Project Tester rank! This gives you access to the CVRF development build as well as the discord channel and rank.",
                                    color: 0x33ee33,
                                    url: "https://www.roblox.com/groups/970502/JK-Production",
                                    author: authorData,
                                    footer: "Note: You must stay on this server or the rank will be removed!"
                                });
                            } else {
                                client.sendEmbed(message, {
                                    title: "Bot Error",
                                    description: "You were probably promoted on Roblox, but an error occured while attempting to give the Tester rank on Discord. Please contact the bot owner (the problem was loggged).",
                                    color: 0xee3333,
                                    author: authorData
                                });
                            }
                            break;
                        case 0:
                            client.sendEmbed(message, {
                                title: "Promotion Rejected",
                                description: "You are not in the group. Please join JKR Productions on Roblox to be promoted to Project Tester. Click the next above to navigate to the group page.",
                                color: 0xee3333,
                                url: "https://www.roblox.com/groups/970502/JK-Production",
                                author: authorData
                            });
                            break;
                        default:
                            client.sendEmbed(message, {
                                title: "Promotion Rejected",
                                description: "You are already a Project Tester or higher in JKR!",
                                color: 0xee3333,
                                author: authorData
                            });
                            break;
                    }
                })();
            } else {
                client.sendEmbed(message, {
                    title: "Promotion Rejected",
                    description: "Could not identify your Roblox account. Have you verified with RoVer using the ``!verify`` command?",
                    color: 0xee3333
                });
            }
        });
        message.channel.stopTyping();
    } catch (err) {
        client.sendEmbed(message, {
            title: "Network Error",
            description: "Request to RoVer API unsuccessful. The RoVer API might be down.",
            color: 0xee3333
        });
        client.logger.warn(`Error while requesting Roblox account from RoVer API: ${err}`);
        message.channel.stopTyping();
    };
};

exports.conf = {
enabled: true,
guildOnly: true,
aliases: [],
permLevel: "User"
};

exports.help = {
name: "becometester",
category: "Miscelaneous",
description: "If eligible, promotes the user who executed the command to the Project Tester rank in the group.",
usage: "becometester"
};
