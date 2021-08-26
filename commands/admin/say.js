const Discord = require('discord.js')

module.exports = {
    config: {
        name: "say",
        aliases: [],
        category: "admin",
        userPerms: "MANAGE_MESSAGES"
    },
    run: async (client, message, args) => {

        message.delete()
        if (!args.slice(0).join(' ')) return message.lineReplyNoMention(`โปรดใส่ข้อความที่ต้องการจะประกาศ`).then(msg => msg.delete({ timeout: 10000 }))
        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setDescription(args.slice(0).join(' '))
            .setFooter(`ผู้ส่ง ${message.author.tag}`)
        return message.channel.send(embed)
    }
}