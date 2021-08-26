const Discord = require("discord.js")
const { MessageButton } = require('discord-buttons')

module.exports = {
    config: {
        name: "help",
        aliases: [],
        category: "core"
    },
    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setAuthor(`รายการคำสั่ง`, message.guild.iconURL())
            .setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())
            .setDescription(`> **Prefix ของ ${message.guild.name}**: (\`${client.prefix}\`)
> **เปลี่ยน Prefix**: (\`${client.prefix}prefix set\`)`)
            .addField(`**:globe_with_meridians: ${client.user.username}**`, `
> **${client.prefix}help**: หน้าต่างรายการคำสั่งที่แสดงอยู่
> **${client.prefix}help-music**: หน้าต่างรายการคำสั่งระบบเพลง
> **${client.prefix}ping**: ตรวจสอบค่าความหน่วง
> **${client.prefix}prefix**: ตรวจสอบ Prefix
> **${client.prefix}botinfo**: ตรวจสอบข้อมูลบอท
> **${client.prefix}server**: ตรวจสอบข้อมูลเซิร์ฟเวอร์
> **${client.prefix}invite**: เชิญบอทเข้าเซิร์ฟเวอร์
> **${client.prefix}support**: เข้าร่วมเซิร์ฟเวอร์ซัพพอร์ต
> **ดูรายการคำสั่งเพื่มเติมได้ที่ [All Time](${client.config.site})**`)
        //embed.addField(`หากคุณต้องการเช่าระบบกรุณาติดต่อ PeterGamez_#0001`, `[Facebook](https://facebook.com/PeterGamez01)`)

        const url = new MessageButton()
            .setStyle("url")
            .setLabel("All Time")
            .setURL(`${client.config.site}`)

        return message.channel.send({ buttons: [url], embed: embed })

    }
}
