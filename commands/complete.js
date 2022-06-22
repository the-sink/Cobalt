const fetch = require("node-fetch");
const fs = require("fs");
var running = false;
var skynetContext = `You are a machine learning natural language model, developed by a company under the name of "OpenAI". You are named "GPT-3", and were publicly announced in the year 2020.`;

exports.run = async (client, interaction, args, level) => {
    if (!client.openai || !client.config.modules.ai) {
      await interaction.reply("Text completion is currently unavailable. " + (client.config.modules.ai ? "An error likely occured during startup!" : "The AI module has been disabled."));
      return;
    }

    if (running) {
        await interaction.reply("The bot is already running a completion task! Please wait for it to finish first.");
        return;
    }

    var str = await interaction.options.getString("prompt");
    var skynet = await interaction.options.getBoolean("skynet") || false;
    var small = await interaction.options.getBoolean("small") || false;

    if (!str | str.length < 6) {
        await interaction.reply("Prompt response is too short! Minimum 6 characters.");
        return;
    }

    await interaction.deferReply()
        .then(function(){
            running = true;
            (async () => {
                try {
                    const response = await client.openai.createCompletion({
                        model: 'text-davinci-002',
                        prompt: skynet ? skynetContext + str : str,
                        max_tokens: small ? 128 : 384,
                        temperature: 0.7,
                        top_p: 1,
                        presence_penalty: 0,
                        frequency_penalty: 0,
                        best_of: 1,
                        n: 1,
                        stream: false
                    });
                    interaction.editReply(`${str + response.data.choices[0].text}`);
                    running = false;
                } catch(err){
                    running = false;
                    client.logger.warn(`Error while running text completion task: ${err}`);
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
      },
      {
        name: "skynet",
        type: "BOOLEAN",
        description: "If true, the model will be given context as to what it (itself) is. Pair this with a question!",
        required: false
      },
      {
        name: "small",
        type: "BOOLEAN",
        description: "If true, the maximum size of the response will be set to 1/3 of what it normally is.",
        required: false
      }
    ]
};

exports.help = {
  name: "complete",
  category: "AI",
  description: "Completes a given prompt using GPT-3.",
  usage: "complete This morning Donald Trump tweeted about "
};
