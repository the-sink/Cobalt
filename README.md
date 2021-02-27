# Cobalt
<a href="https://github.com/AStainlessSteelSink/cobalt/blob/main/LICENSE"> ![License](https://img.shields.io/github/license/AStainlessSteelSink/cobalt) </a>
<a href="https://github.com/discordjs"> ![discord.js](https://img.shields.io/badge/discord.js-v12.3.1-blue.svg?logo=npm) </a>
<a href="https://github.com/AStainlessSteelSink/cobalt/issues"> ![Issues](https://img.shields.io/github/issues/AStainlessSteelSink/cobalt) </a>

A bot used by the JKR Discord Server, based on the [guidebot framework](https://github.com/AnIdiotsGuide/guidebot) and with code snippets referenced from [woomy](https://github.com/woomyware/woomy).

This bot is currently being worked on and is no where near a functional state. It will be added to the main server once it is at a point of being just as functional (or more functional) than the existing Cobalt bot. A rewrite was needed due to how poorly written the first version of Cobalt is (trust me, it's bad, I haven't even shown any of the other JKR developers) and starting from a fairly sturdy framework seems like a helpful nudge to eventually have a much more well-rounded bot.

Also, it's in Discord.js instead of Eris - considering this bot is only intended to be used on one server, the Eris optimizations are not needed and Discord.js has a far more 'detailed' API and online support community.

Feel free to look around. If you find any issues or would like to make improvements to this bot, feel free to do so! Although this bot isn't *specifically* intended to be used outside of JKR, it's intentionally open source so others can contribute if they'd like.

## Requirements

- `git` command line ([Windows](https://git-scm.com/download/win)|[Linux](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)|[MacOS](https://git-scm.com/download/mac)) installed
- `node` [Version 12.0.0 or higher](https://nodejs.org)
- The node-gyp build tools. This is a pre-requisite for Enmap, but also for a **lot** of other modules. See [The Enmap Guide](https://enmap.evie.codes/install#pre-requisites) for details and requirements for your OS. Just follow what's in the tabbed block only, then come back here!

You also need your bot's token. This is obtained by creating an application in
the [Developer section](https://discord.com/developers) of discord.com. Check the [first section of this page](https://anidiots.guide/getting-started/the-long-version.html) 
for more info.

## Intents

For info about intents check out the [official Discord.js guide page](https://discordjs.guide/popular-topics/intents.html) and the [official Discord docs page](https://discord.com/developers/docs/topics/gateway#gateway-intents). Certain intents may require extra steps.

## Starting the bot

To start the bot, in the command prompt, run the following command:
`npm start`

## Inviting to a guild

To add the bot to your guild, you have to get an oauth link for it. 

You can use this site to help you generate a full OAuth Link, which includes a calculator for the permissions:
[https://finitereality.github.io/permissions-calculator/?v=0](https://finitereality.github.io/permissions-calculator/?v=0)
