module.exports = async (client, message) => { // https://labs.bible.org/api/?passage=random&type=json
  if (message.author.bot) return;
  if (client.inspectRestricted){
    client.inspectRestricted(message)
  }

  if (true) { // Math.floor(Math.random() * 100) == 1
    message.reply("test");
  }
};
