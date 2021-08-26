const Discord = require('discord.js')

module.exports = {
    config: {
        name: "rps",
        aliases: [],
        category: "fun"
    },
    run: async (client, message, args) => {

        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setTitle('เกมส์เปายิงฉุบ')
            .setDescription(`<@${message.author.id}> กรุณากดอีโมจิภายใน 10 วินาที`)
            .setImage('https://i.imgur.com/ZvX4DrC.gif')
            .setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())
            .setTimestamp()

        let msg = await message.channel.send(embed)
        const g0 = '✌️'
        const g1 = '✊'
        const g2 = '✋'

        await msg.react(g1)
        await msg.react(g2)
        await msg.react(g0)

        const rps = [g0, g1, g2]
        function getResult(me, clientChosen) {
            if ((me.emoji.name === g1 && clientChosen === g0) ||
                (me.emoji.name === g2 && clientChosen === g1) ||
                (me.emoji.name === g0 && clientChosen === g2)) {
                return ":smile: คุณชนะ";
            } else if (me.emoji.name === clientChosen) {
                return "😑 เสมอ";
            } else {
                return ":sob: คุณแพ้";
            }
        }
        function getResult2(clientChosen) {
            if (clientChosen === g0) return 'https://i.imgur.com/dZOVJ4r.jpg'
            if (clientChosen === g1) return 'https://i.imgur.com/hdG222Q.jpg'
            if (clientChosen === g2) return 'https://i.imgur.com/O3ZLDRr.jpg'
        }

        const filter = (reaction, sent) => {
            return rps.includes(reaction.emoji.name) && sent.id === message.author.id;
        };

        msg.awaitReactions(filter, { max: 1, time: 10 * 1000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first()

                const botChoice = rps[Math.floor(Math.random() * rps.length)]

                embed.setDescription(getResult(reaction, botChoice))
                    .setImage(getResult2(botChoice))

                msg.edit(embed)
            })
            .catch(collected => {
                embed.setImage('https://i.imgur.com/bBMSqvf.jpg')
                msg.edit(embed)
            })

    }
}