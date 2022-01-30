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
            (async () => {
                try {
                    const response = await client.openai.complete({
                        engine: 'davinci',
                        prompt: str,
                        maxTokens: 100,
                        temperature: 0.3,
                        topP: 0.3,
                        presencePenalty: 0,
                        frequencyPenalty: 0.5,
                        bestOf: 1,
                        n: 1,
                        stream: false
                    });
                    console.log(response.data);
                    interaction.editReply(`${str + response.data.choices[0].text}`);
                    running = false;
                } catch(err){
                    running = false;
                    console.log(err);
                    interaction.editReply(`A bot error has occured.`);
                    running = false;
                }
            })();
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
