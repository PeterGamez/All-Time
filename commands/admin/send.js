const Discord = require('discord.js')

module.exports = {
    config: {
        name: "send",
        aliases: [],
        category: "admin",
        userPerms: "MANAGE_MESSAGES"
    },
    run: async (client, message, args) => {

        message.delete()
        
        if (!args[0]) return message.lineReplyNoMention(`กรุณาแท็กสมาชิก`)
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!args.slice(1).join(' ')) return message.lineReplyNoMention(`โปรดใส่ข้อความที่ต้องการจะประกาศ`).then(msg => msg.delete({ timeout: 10000 }))
        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setDescription(args.slice(1).join(' '))
            .setFooter(`ผู้ส่ง ${message.author.tag} จาก ${message.guild.name}`)
        try {
            user.send(embed)
        } catch {
            return message.channel.send(`${user.username} ปิดการรับข้อความส่วนตัว`)
        }
    }
}