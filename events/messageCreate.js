module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (client.inspectRestricted){
    client.inspectRestricted(message)
  }
};
