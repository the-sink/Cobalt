const fetch = require("node-fetch");

module.exports = async (client, message) => { // https://labs.bible.org/api/?passage=random&type=json
  if (message.author.bot) return;
  if (client.inspectRestricted){
    client.inspectRestricted(message)
  }

  if (Math.floor(Math.random() * 100) == 1) {
    await fetch("https://labs.bible.org/api/?passage=random&type=json")
    .then(res => res.json())
    .then(body => {
      message.reply(body[0]['text'])
      .then(message => {
        setTimeout(function(){
          message.delete();
        }, 2500);
      });
    });
  }
};