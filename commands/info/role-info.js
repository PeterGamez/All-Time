const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
    config: {
        name: "role-info",
        aliases: ["role", "roleinfo"],
        category: "info"
    },
    run: async (client, message, args) => {

        let role = null

        if (args[0]) {
            try {
                role = (message.guild.roles.cache.get(message.mentions.roles.first().id))
            } catch {
                role = null
            }
        }

        if (Number(args[0])) {
            try {
                if (args[0].length !== 18) return message.channel.send(`<@${message.author.id}> กรุณาระบุไอดีให้ถูกต้อง เลขไอดีมีเพียง 18 หลัก`)
                role = message.guild.roles.cache.get(args[0])
            } catch {
                role = null
            }
        }

        if (role == null) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อมูลให้ถูกต้อง`)

        const embed = new Discord.MessageEmbed()
            .setColor(role.color.toString(16).padStart(6, '0'))
            .setTitle('Role Information')
            .addField(`ID`, role.id, true)
            .addField(`Name`, role.name, true)
            .addField(`Mention`, `\`${role}\``, true)
            .addField(`Color`, `#${role.color.toString(16).padStart(6, '0')}`, true)
            .addField(`Members`, role.members.size, true)
            .addField(`Created`, `<t:${String(role.createdTimestamp).slice(0, 10)}:R>`, true)
            .addField(`Position (from top)`, `${message.guild.roles.cache.size - role.position}/${message.guild.roles.cache.size}`, true)
            .addField(`Hoisted`, role.hoist, true)
            .addField(`Mentionable`, role.mentionable, true)

        return message.channel.send(embed)
    }
}