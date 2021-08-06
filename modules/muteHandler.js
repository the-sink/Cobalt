module.exports = async (client) => {
    if (client.guild == null){
        client.logger.warn("Could not start up mute system, guild was not found.");
        return;
    }

    client.mutedRole = client.guild.roles.cache.find(role => role.name === "Muted");

    client.mute = async function(member, unmuteTime){
        var success = false;

        await member.roles.add(client.mutedRole).catch(function(e){
            client.logger.warn(e);
            return;
        }).then(function(){
            console.log(unmuteTime);
            if (unmuteTime) {
                client.mutes.set(member.id, unmuteTime);
            }
            success = true;
        });

        console.log(success);
        return success;
    }
    client.unmute = async function(member){
        var success = false;

        client.mutes.delete(member.id);
        await member.roles.remove(client.mutedRole).catch(function(e){
            client.logger.warn(e);
            return;
        }).then(function(){
            success = true;
        });

        return success;
    }
    client.getRemainingMuteLength = function(member){
        let unmuteTime = client.mutes.get(member.id);
        let length;
        if (unmuteTime != null){
            length = unmuteTime - Date.now();
        }
        return length;
    }

    let roles = await client.guild.members.fetch();
    setInterval(function(){ // Inspect list of muted users every 20 seconds, unmute anyone who's mute length has expired
        client.mutes.forEach(function(value, memberID){
            let currentTime = Date.now();
            if (currentTime >= value){
                let member = client.guild.members.cache.get(memberID);
                client.logger.log(`Member ${member.user.username}#${member.user.discriminator} is being unmuted`);
                client.unmute(member);
            }
        });
    }, 20000);
};