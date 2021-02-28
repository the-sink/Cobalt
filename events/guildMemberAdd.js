// This event executes when a new member joins a server. Let's welcome them!

module.exports = (client, member) => {
  // If welcome is off, don't proceed (don't welcome the user)
  if (client.config.welcomeEnabled !== "true") return;

  // Replace the placeholders in the welcome message with actual data
  const welcomeMessage = client.config.welcomeMessage.replace("{{user}}", member.user.tag);

  // Send the welcome message to the welcome channel
  // There's a place for more configs here.
  member.guild.channels.cache.find(c => c.name === client.config.welcomeChannel).send(welcomeMessage).catch(console.error);
};
