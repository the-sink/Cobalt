const fetch = require("node-fetch");
const fs = require("fs");
var running = false;

exports.run = async (client, message, args, level) => {
    if (running) {
        message.reply("the bot is already running a completion task! Please wait for it to finish first.");
        return;
    }
    var str = message.content.replace(`${client.config.prefix}complete `, "");
    message.reply("<a:loading:776537774391164949> Completing your prompt (this will probably take around 2 minutes)...")
        .then(msg => {
            running = true;
            try {
                fetch('http://192.168.1.92:7001', {
                        method: 'post',
                        body:    str,
                        headers: { 'Content-Type': 'text/plain' },
                    })
                    .then(async function(res){
                        running = false;
                        if (res.ok) {
                            var text = await res.text();
                            var response = `<@${message.author.id}>, ` + str + text;
                            msg.edit(response.substring(0, 1999));
                        } else {
                            throw 'Server error';
                        }
                    })
                    .catch(err => {
                        throw 'Fetch error';
                    });
            } catch(err){
                running = false;
                msg.edit(`<@${message.author.id}>, an error occured while executing the completion task. If this keeps happening, something is *probably* wrong.`);
            }
        });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "complete",
  category: "AI",
  description: "Completes a given prompt using GPT-2. This command takes a little while to execute.",
  usage: "complete This morning Donald Trump tweeted about "
};
