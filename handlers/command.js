const fs = require("fs")
const Discord = require('discord.js')

module.exports = (client) => {
    const load = async (dirs) => {
        const commands = fs.readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'))
        for (file of commands) {
            let pull = require(`../commands/${dirs}/${file}`)
            client.commands.set(pull.config.name, pull)
            if (pull.config.aliases) pull.config.aliases.forEach(a => client.aliases.set(a, pull.config.name))
            client.cooldowns.set(pull.config.name, new Discord.Collection())
        }
    };
    ["admin", "core", "fun", "info", "mod", "owner"].forEach(x => load(x))
}