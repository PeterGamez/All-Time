const Discord = require('discord.js')

module.exports = {
    config: {
        name: "spin",
        aliases: [],
        category: "fun"
    },
    run: async (client, message, args) => {

        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setTitle('เกมส์ทายด้านเหรียญ')
            .setDescription(`<@${message.author.id}> กรุณากดอีโมจิภายใน 10 วินาที`)
            .setImage('https://i.imgur.com/EOtNvek.gif')
            .setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())
            .setTimestamp()

        let msg = await message.channel.send(embed)
        const g0 = '🇦'
        const g1 = '🇿'

        await msg.react(g0)
        await msg.react(g1)

        const rps = [g0, g1]
        function getResult(me, clientChosen) {
            if ((me.emoji.name === g0 && clientChosen === g0) ||
                (me.emoji.name === g1 && clientChosen === g1)) {
                return ":smile: คุณชนะ";
            } else {
                return ":sob: คุณแพ้";
            }
        }
        function getResult2(clientChosen) {
            if (clientChosen === g0) return 'https://i.imgur.com/g6diTWf.png'
            if (clientChosen === g1) return 'https://i.imgur.com/5cBXqHn.png'
        }

        const filter = (reaction, sent) => {
            return rps.includes(reaction.emoji.name) && sent.id === message.author.id;
        };

        msg.awaitReactions(filter, { max: 1, time: 10 * 1000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first()

                const botChoice = rps[Math.floor(Math.random() * rps.length)];

                embed.setDescription(getResult(reaction, botChoice))
                    .setImage(getResult2(botChoice))

                msg.edit(embed);
            })
            .catch(collected => {
                embed.setImage('https://i.imgur.com/xhnIhUW.jpg')
                msg.edit(embed)
            })
    }
}