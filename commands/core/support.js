const Discord = require('discord.js')

module.exports = {
    config: {
        name: "support",
        aliases: [],
        category: "core"
    },
    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setAuthor(`${client.user.username}`, message.guild.iconURL())
            .addField('เข้าร่วม :globe_with_meridians:  ', `[คลิก](${client.config.support})`, true)
            .setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())
        return message.channel.send(embed)
    }
}