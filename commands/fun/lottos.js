const Discord = require('discord.js')

module.exports = {
    config: {
        name: "lottos",
        aliases: [],
        category: "fun"
    },
    run: async (client, message, args) => {
        function number(num) {
            let color = ""
            let code = "0123456789"
            for (var i = 0; i < num; i++)
                color += code.charAt(Math.floor(Math.random() * code.length))
            return color
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(`สุ่มหวยโดย : ${message.author.username}`, message.author.avatarURL())
            .setColor(client.config.color)
            .addField(':trophy: รางวัลที่ 1', number(6), false)
            .addField(':military_medal: เลขหน้า 3 ตัว', `${number(3)} ${number(3)}`, true)
            .addField(':military_medal: เลขท้าย 3 ตัว', `${number(3)} ${number(3)}`, true)
            .addField(':medal: เลขท้าย 2 ตัว', `${number(2)}`, true)
            .setTimestamp()
            .setFooter('คำเตือน : เนื้อหาเป็นเพียงการสุ่มเท่านั้น')
        return message.channel.send(embed)
    }
}