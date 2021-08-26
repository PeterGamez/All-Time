const Discord = require('discord.js')

module.exports = {
    config: {
        name: "ping",
        aliases: [],
        category: "core",
    },
    run: async (client, message, args) => {
        let msg = await message.channel.send('**กำลังโหลดข้อมูล...**')

        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setAuthor(client.user.username, message.guild.iconURL())
            .addField('ค่าความหน่วง 📶', `**${msg.createdTimestamp - message.createdTimestamp} ms!**`, true)
            .addField('ความเร็วการประมวลผล 🔀 ', `**${Math.round(client.ws.ping)} ms!**`, true)
            .setTimestamp()
            .setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())

        return msg.edit('', embed)
    }
}