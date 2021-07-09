const fetch = require("node-fetch");
const fs = require("fs");
var running = false;

exports.run = async (client, message, args, level) => {
    if (running) {
        message.reply("the bot is already running a completion task! Please wait for it to finish first.");
        return;
    }
    var str = message.content.replace(`${client.config.prefix}complete `, "").replace(`${client.config.prefix}continue `, "");
    message.reply("<a:loading:776537774391164949> Completing your prompt (this will probably take around 1 ½ minutes)...")
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
                            var response = await client.clean(client, str + text.replace("<|endoftext|>", " ")); // `<@${message.author.id}>, ` + 
                            msg.delete();
                            message.reply(response.substring(0, 1900)).catch(err => {
                                running = false;
                                msg.edit(`<@${message.author.id}>, an error has occurred posting the response to Discord.`);
                            });
                        } else {
                            running = false;
                            msg.edit(`<@${message.author.id}>, an error has occurred generating the rest of that prompt.`);
                        }
                    })
                    .catch(err => {
                        running = false;
                        console.log(err);
                        if (err.code == "ECONNREFUSED") {
                            msg.edit(`<@${message.author.id}>, the gpt-2 server is currently offline. It may be undergoing maintenance or has crashed.`);
                        } else {
                            msg.edit(`<@${message.author.id}>, an error has occurred fetching the response.`);
                        }
                    });
            } catch(err){
                running = false;
                console.log(err);
                msg.edit(`<@${message.author.id}>, a bot error has occured.`);
            }
        });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["continue"],
  permLevel: "User"
};

exports.help = {
  name: "complete",
  category: "AI",
  description: "Completes a given prompt using GPT-2. This command is also known as \"the shitpost creator\".",
  usage: "complete This morning Donald Trump tweeted about "
};
