// This file contains sensitive tokens that, if shared, could do significant damage. Do not share your real config.js with anyone you don't trust, and do not post it online.
// Make sure your .gitignore contains a "config.js" entry before committing.
// Similarly, the "data/" directory can contain sensitive information. Ensure that is not committed either.

const config = {
  // The prefix you must place before a command for it to be registered by the bot (such as "~command" vs "!command")
  "prefix": "-",

  // Bot Admins, level 9 by default. Array of user ID strings.
  "admins": [],

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
    "playerCount": true,
    "markov": true
  },

  // Guild channel IDs for certain functionality
  "channels": {
    "serverList": "",
    "logChannel": ""
  },

  // API endpoints, needed for some commands
  "endpoints": {},

  // Emojis to use in bot messages (such as success/error indicators)
  "emojis": {
    "error": "<:error:000000000000000000>"
  },

  "serverListPort": 2572,

  "markovLength": 50,
  "markovMessages": 10,

  "modRole": "Moderator",
  "adminRole": "Administrator",

  "systemNotice": "true", // This gives a notice when a user tries to run a command that they do not have permission to use.

  "welcomeChannel": "welcome",
  "welcomeMessage": "Say hello to {{user}}, everyone! We all need a warm welcome sometimes :D",
  "welcomeEnabled": "false",

  // PERMISSION LEVEL DEFINITIONS.

  permLevels: [
    // This is the lowest permisison level, this is for non-roled users.
    { level: 0,
      name: "User", 
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },

    // This is your permission level, the staff levels should always be above the rest of the roles.
    { level: 2,
      // This is the name of the role.
      name: "Moderator",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          const modRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
          if (modRole && message.member.roles.cache.has(modRole.id)) return true;
        } catch (e) {
          return false;
        }
      }
    },

    { level: 3,
      name: "Administrator", 
      check: (message) => {
        try {
          const adminRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
          return (adminRole && message.member.roles.cache.has(adminRole.id));
        } catch (e) {
          return false;
        }
      }
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    { level: 9,
      name: "Bot Admin",
      check: (message) => config.admins.includes(message.author.id)
    },

    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    // Updated to utilize the Teams type from the Application, pulls a list of "Owners" from it.
    { level: 10,
      name: "Bot Owner", 
      // Another simple check, compares the message author id to a list of owners found in the bot application.
      check: (message) => message.client.owners.includes(message.author.id)
    }
  ]
};

module.exports = config;
