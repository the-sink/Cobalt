const fetch = require("node-fetch");
const fs = require("fs");

exports.run = async (client, message, args, level) => {
    var str = message.content.replace(`${client.config.prefix}complete `, "");
    message.reply("<a:loading:776537774391164949> Completing your prompt (this will probably take around 2 minutes)...")
        .then(msg => {
            fetch('http://192.168.1.92:7001', {
                    method: 'post',
                    body:    str,
                    headers: { 'Content-Type': 'text/plain' },
                })
                .then(res => {
                    if (res.ok) {
                        return res;
                    } else {
                        if (res.status == 409) {
                            msg.edit(`<@${msg.author.id}>, the bot is already running a completion task! Please wait for it to finish first.`);
                        } else {
                            msg.edit(`<@${msg.author.id}>, an error occured while executing the completion task. If this keeps happening, something is *probably* wrong.`);
                        }
                        return;
                    }
                })
                .then(res => res.text())
                .then(async function(text){
                    fs.writeFileSync("completion.txt", str + text);
                    msg.delete();
                    message.channel.send(`<@${msg.author.id}>`, {
                        files: [
                            "completion.txt"
                        ]
                    })
                });
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
