module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (client.inspectRestricted){
    client.inspectRestricted(message)
  }

  const level = client.permlevel(message);

  if (message.content == "c!deploy" && level == 10) {
    client.commands.get("deploy").run(client, message, {}, level);
  }
};
