const fetch = require("node-fetch");
const fs = require("fs");
var running = false;

exports.run = async (client, interaction, args, level) => {
    if (running) {
        await interaction.reply("The bot is already running a completion task! Please wait for it to finish first.");
        return;
    }
    var str = await interaction.options.getString("prompt");
    console.log(str);
    if (!str | str.length < 6) {
        await interaction.reply("Prompt response is too short! Minimum 6 characters.");
        return;
    }

    await interaction.deferReply()
        .then(function(){
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
                            var response = await client.clean(client, str + text.replace("<|endoftext|>", " ")); // `<@${interaction.author.id}>, ` + 
                            interaction.editReply(response.substring(0, 1900)).catch(err => {
                                running = false;
                                interaction.editReply(`An error has occurred posting the response to Discord.`);
                            });
                        } else {
                            running = false;
                            interaction.editReply(`An error has occurred generating the rest of that prompt.`);
                        }
                    })
                    .catch(err => {
                        running = false;
                        console.log(err);
                        if (err.code == "ECONNREFUSED") {
                            interaction.editReply(`The gpt-2 server is currently offline. It may be undergoing maintenance or has crashed.`);
                        } else {
                            interaction.editReply(`An error has occurred fetching the response.`);
                        }
                    });
            } catch(err){
                running = false;
                console.log(err);
                interaction.editReply(`A bot error has occured.`);
            }
        });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["continue"],
  permLevel: "User"
};

exports.options = function(client){
    return [
      {
        name: "prompt",
        type: "STRING",
        description: "The prompt to be completed.",
        required: true
      }
    ]
};

exports.help = {
  name: "complete",
  category: "AI",
  description: "Completes a given prompt using GPT-2. This command is also known as \"the shitpost creator\".",
  usage: "complete This morning Donald Trump tweeted about "
};
