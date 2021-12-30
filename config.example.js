// This file contains sensitive tokens that, if shared, could do significant damage. Do not share your real config.js with anyone you don't trust, and do not post it online.
// Make sure your .gitignore contains a "config.js" entry before committing.
// Similarly, the "data/" directory can contain sensitive information. Ensure that is not committed either.

const config = {
  // The prefix you must place before a command for it to be registered by the bot (such as "~command" vs "!command")
  "prefix": "-",

  // The bot owner's user ID (you). Be sure you add yourself to the admin array below as well!
  "owner": "0",

  // Bot Admins, level 9 by default. Array of user ID strings.
  "admins": ["0"],

  ///// The following are secrets, do not share these with anyone! /////

  // Your Bot's Token. Available on https://discord.com/developers/applications/me
  "token": "",

  // Your Roblox account's (you should probably use a separate bot account, not your main one) security token to be used by noblox.js.
  "robloxCookie": "",

  // The key to be used for authorizing server list-related network messages.
  "serverListKey": "",

  //////////////////////////////////////////////////////////////////////

  // List of modules that can be enabled/disabled
  "modules": {
    "serverList": false,
    "restrictedRole": true,
    "muteHandler": true,
    "ai": true,
    "finance": true,
    "playerCount": true
  },

  // Guild channel IDs for certain functionality
  "channels": {
    "serverList": "",
    "logChannel": ""
  },

  "blockedChannels": [],

  // API endpoints, needed for some commands
  "endpoints": {},

  // Emojis to use in bot messages (such as success/error indicators)
  "emojis": {
    "error": "<:error:000000000000000000>"
  },

  "serverListPort": 2572,

  "modRole": "Moderator",
  "adminRole": "Administrator",

  "systemNotice": "true", // This gives a notice when a user tries to run a command that they do not have permission to use.

  "welcomeChannel": "welcome",
  "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
  "welcomeEnabled": "false",

  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    { level: 0,
      name: "User", 
      check: () => true
    },

    { level: 2,
      name: "Moderator",
      check: (interaction) => {
        try {
          const modRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === config.settings.modRole.toLowerCase());
          if (modRole && interaction.member.roles.cache.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: "Administrator", 
      check: (interaction) => {
        try {
          const adminRole = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === config.settings.adminRole.toLowerCase());
          return (adminRole && interaction.member.roles.cache.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },

    { level: 9,
      name: "Bot Admin",
      check: (interaction) => config.admins.includes(interaction.member.id)
    },

    { level: 10,
      name: "Bot Owner", 
      check: (interaction) => interaction.member.id === config.owner
    }
  ]
};

module.exports = config;
