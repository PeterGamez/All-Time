const Discord = require("discord.js"); require('discord-reply');
const client = new Discord.Client({ disableMentions: 'everyone' }); require('discord-buttons')(client);
client.config = require('./config.json');
client.login(client.config.token);

["aliases", "commands", "cooldowns"].forEach(x => client[x] = new Discord.Collection());
["command", "console", "event"].forEach(x => require(`./handlers/${x}`)(client));
