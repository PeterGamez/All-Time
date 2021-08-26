const Discord = require('discord.js')

module.exports = {
    config: {
        name: "invite",
        aliases: [],
        category: "core"
    },
    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setAuthor(`${client.user.username}`, message.guild.iconURL())
            .addField('เชิญบอท :busts_in_silhouette: ', `[คลิก](${client.config.invite_bot})`, true)
            .setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())
        return message.channel.send(embed)
    }
}