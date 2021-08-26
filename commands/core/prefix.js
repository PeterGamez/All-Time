const Discord = require('discord.js');
const quickdb = require("../../../quick.db/index.js");
const db = quickdb("../db/prefix.sqlite");

module.exports = {
    config: {
        name: "prefix",
        aliases: [],
        category: "core"
    },
    run: async (client, message, args) => {

        const embed = new Discord.MessageEmbed()
            .setDescription(`**• Prefix**: \`${client.prefix}\``)
            .setColor(client.config.color)
            .setFooter(`เปลี่ยน Prefix ด้วยคำสั่ง ${client.prefix}prefix set (new prefix)`)

        if (args[0] == 'set') {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(`<@${message.author.id}> ในการใช้งานคำสั่งนี้จำเป็นต้องมีสิทธิ์: \`Manage Guild\``)

            if (!args[1]) return message.channel.send(embed)

            if (args[1].length > 3) return message.channel.send(`Prefix ห้ามมากกว่า 3 ตัว`)

            if (args[1] == client.config.prefix) {
                
                if (db.get(`prefix.${message.guild.id}`)) db.delete(`prefix.${message.guild.id}`)

                embed.setDescription(`**• Prefix** ถูกเปลี่ยนเป็น : \`${args[1]}\` เรียบร้อยแล้วครับ!`)
                .setFooter(`เปลี่ยน Prefix ด้วยคำสั่ง ${args[1]}prefix set (new prefix)`)

                return message.channel.send(embed)

            }

            db.set(`prefix.${message.guild.id}`, String(args[1]))

            embed.setDescription(`**• Prefix** ถูกเปลี่ยนเป็น : \`${args[1]}\` เรียบร้อยแล้วครับ!`)
            .setFooter(`เปลี่ยน Prefix ด้วยคำสั่ง ${args[1]}prefix set (new prefix)`)

            return message.channel.send(embed)
        }

        else return message.channel.send(embed)
    }
}