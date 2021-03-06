const readdir = require("fs").promises.readdir;

module.exports = async client => {
  // Log that the bot is online.
  client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users.`, "ready");
  
  // This loop ensures that client.application always contains up to date data
  // about the app's status. This includes whether the bot is public or not,
  // its description, owner(s), etc. Used for the dashboard among other things.
  // Updated every 10 minutes.
  client.application = await client.fetchApplication();
  try {
    client.guild = await client.guilds.cache.first();
  } catch(e) {
    client.logger.warn(`Could not fetch guild with error: ${e}`);
  }
  if (client.owners.length < 1) client.application.team ? client.owners.push(...client.application.team.members.keys()) : client.owners.push(client.application.owner.id);
  setInterval( async () => {
    client.owners = [];
    client.application = await client.fetchApplication();
    client.application.team ? client.owners.push(...client.application.team.members.keys()) : client.owners.push(client.application.owner.id);
  }, 600000);

  const modFiles = await readdir("./modules/");
  let numModules = 0;
  modFiles.forEach(file => {
    if (!file.endsWith(".js")) return;
    const moduleName = file.split(".")[0];
    if (client.config.modules[moduleName] == true){
      numModules++;
      require(`../modules/${file}`)(client);
  }});
  client.logger.log(`Loaded ${numModules} modules.`);

  // Make the bot "play the game" which is the help command with default prefix.
  //client.user.setActivity(`${client.config.prefix}help | v${process.env.npm_package_version}`, {type: "PLAYING"});
};
