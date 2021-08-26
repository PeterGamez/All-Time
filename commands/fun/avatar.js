const Discord = require('discord.js')

module.exports = {
    config: {
        name: "avatar",
        aliases: ["view"],
        category: "fun"
    },
    run: async (client, message, args) => {

        let user = message.member.user

        if (args[0]) {
            try {
                user = (client.users.cache.get(message.mentions.users.first().id))
            } catch {
                user = null
            }
        }
        if (Number(args[0])) {
            try {
                if (args[0].length !== 18) return message.channel.send(`<@${message.author.id}> กรุณาระบุไอดีให้ถูกต้อง เลขไอดีมีเพียง 18 หลัก`)
                user = client.users.cache.get(args[0])
            } catch {
                user = null
            }
        }
        if (user == null) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อมูลให้ถูกต้อง`)

        function link(user) {
            let l1 = user.displayAvatarURL({ dynamic: true }).split('.')[3]
            if (l1.split('webp')) {
                let l2 = user.displayAvatarURL().split('webp')[0]
                return `${l2}png?size=1024`
            }
            return user.displayAvatarURL({ dynamic: true, size: 1024 })
        }
        
        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())
            .setDescription(`<@${user.id}> | [view full size](${link(user)})`)
            .setImage(link(user))
        return message.channel.send(embed)
    }
}
