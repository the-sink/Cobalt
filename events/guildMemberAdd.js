const fetch = require("node-fetch");

module.exports = (client, member) => {
  // If welcome is off, don't proceed (don't welcome the user)
  if (client.config.welcomeEnabled !== "true") return;

  // Replace the placeholders in the welcome message with actual data
  const welcomeMessage = client.config.welcomeMessage.replace("{{user}}", member.user.tag);

  // Send the welcome message to the welcome channel
  // There's a place for more configs here.
  member.guild.channels.cache.find(c => c.name === client.config.welcomeChannel).send(welcomeMessage).catch(console.error);

  let channel = client.config.channels.logChannel; 
  if (channel == "") return;

  // Log user's initial account association on join
  try {
    await fetch(`https://verify.eryn.io/api/user/${member.id}`)
    .then(res => res.json())
    .then(body => {
        if (body.status == "ok"){ // Successfully obtained Roblox account
          let name = body.robloxUsername;
          let id = body.robloxId;
          channel.send(`\`${client.getFullUsername(member)}\` (\`${name} / ${id}\`) has joined the server.`);
        } else {
          channel.send(`\`${client.getFullUsername(member)}\` has joined the server. They are not yet verified`);
        }
    });
  } catch(e) {
    client.logger.warn(`Error while checking for user's account association: ${e}`);
  }
};
