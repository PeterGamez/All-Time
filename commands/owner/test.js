const fs = require("fs")
const Discord = require('discord.js')
const moment = require('moment')
const disbut = require('discord-buttons')

module.exports = {
    config: {
        name: "test",
        aliases: [],
        category: "owner",
        userPerms: "OWNER"
    },
    run: async (client, message, args) => {
        message.channel.send(client.users.cache.get(args[0]).tag)
        //.format('DD/MM/YYYY k:mm')
        /*const embed = new Discord.MessageEmbed()
            .setColor('ec96c1')
            .setDescription(`start`)
            .setTimestamp()

        const yes = new disbut.MessageButton()
            .setStyle("green")
            .setLabel("Yes")
            .setID('yes')

        const no = new disbut.MessageButton()
            .setStyle("red")
            .setLabel("No")
            .setID('no')

        const msg = await message.channel.send({ buttons: [yes, no], embed: embed })

        const collector = msg.createButtonCollector((button) => button.clicker.user.id === message.author.id, { time: 60 * 1000 });

        collector.on("collect", (b) => {

            b.reply.defer();

            if (b.id == "yes") {
                yes.setDisabled()
                no.setDisabled()
                embed.setDescription(`yes`)
                return msg.edit({ buttons: [yes, no], embed: embed })
            }
            else if (b.id == "no") {
                yes.setDisabled()
                no.setDisabled()
                embed.setDescription(`no`)
                return msg.edit({ buttons: [yes, no], embed: embed })
            }
        })
        collector.on('end', (b) => {
            yes.setDisabled()
            no.setDisabled()
            embed.setDescription(`end`)
            return msg.edit({ buttons: [yes, no], embed: embed })
        })*/
    }
}
