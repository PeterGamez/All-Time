const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
    config: {
        name: "channel-info",
        aliases: ["channel", "channelinfo"],
        category: "info"
    },
    run: async (client, message, args) => {

        let channel = message.guild.channels.cache.get(message.channel.id)

        if (args[0]) {
            try {
                channel = (message.guild.channels.cache.get(message.mentions.channels.first().id))
            } catch {
                channel = null
            }
        }

        if (Number(args[0])) {
            try {
                if (args[0].length !== 18) return message.channel.send(`<@${message.author.id}> กรุณาระบุไอดีให้ถูกต้อง เลขไอดีมีเพียง 18 หลัก`)
                channel = message.guild.channels.cache.get(args[0])
            } catch {
                channel = null
            }
        }

        if (channel == null) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อมูลให้ถูกต้อง`)

        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setTitle('Channel Information')
            .addField(`ID`, channel.id, true)
            .addField(`Name`, channel.name, true)
            .addField(`Mention`, `\`${channel}\``, true)
            .addField(`Category`, channel.parent.name, true)
        if (channel.nsfw !== undefined) embed.addField(`NSFW`, channel.nsfw, true)
        embed.addField(`Created`, `<t:${String(channel.createdTimestamp).slice(0, 10)}:R>`, true)

        return message.channel.send(embed)
    }
}