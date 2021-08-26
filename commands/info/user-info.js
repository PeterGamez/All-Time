const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
    config: {
        name: "user-info",
        aliases: ["user", "userinfo"],
        category: "info"
    },
    run: async (client, message, args) => {

        let user = message.guild.members.cache.get(message.author.id)

        if (args[0]) {
            try {
                user = (message.guild.members.cache.get(message.mentions.users.first().id))
            } catch {
                user = null
            }
        }

        if (Number(args[0])) {
            try {
                if (args[0].length !== 18) return message.channel.send(`<@${message.author.id}> กรุณาระบุไอดีให้ถูกต้อง เลขไอดีมีเพียง 18 หลัก`)
                user = message.guild.members.cache.get(args[0])
            } catch {
                user = null
            }
        }

        if (user == null) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อมูลให้ถูกต้อง`)

        const emoji = `${client.emojis.cache.get('861092717676986398')}`
        const emoji2 = `${client.emojis.cache.get('865836371678461972')}`

        function drive(user) {
            const drive = user.presence.clientStatus
            if (user.presence.status == 'offline') return `${emoji}\`ไม่พบอุปกรณ์\``
            const entries = Object.entries(drive)
                .map((value, index) => `${emoji}\`${index + 1}. ${value[0][0].toUpperCase()}${value[0].slice(1)}\``)
                .join("\n")
            return `${entries}`
        }
        function stats(user) {
            if (user.presence.status == 'online') return `${emoji}\`ออนไลน์\``
            else if (user.presence.status == 'idle') return `${emoji}\`ไม่อยู่\``
            else if (user.presence.status == 'dnd') return `${emoji}\`ห้ามรบกวน\``
            else if (user.presence.status == 'offline') return `${emoji}\`ออฟไลน์\``
        }

        function link(user) {
            let l1 = user.displayAvatarURL({ dynamic: true }).split('.')[3]
            if (l1.split('webp')) {
                let l2 = user.displayAvatarURL().split('webp')[0]
                return `${l2}png?size=1024`
            }
            return user.displayAvatarURL({ dynamic: true, size: 1024 })
        }

        /*const embed = new Discord.MessageEmbed()
            .setAuthor(user.user.tag, user.user.displayAvatarURL())
            .setColor(user.roles.highest.color.toString(16).padStart(6, '0'))
            //.setThumbnail(link(user.user))
            .addField(`${emoji2}ชื่อ:`, `${emoji}\`${user.user.username}#${user.user.discriminator}\``, true)
            .addField(`${emoji2}ไอดี:`, `${emoji}\`${user.user.id}\``, true)
            .addField(`${emoji2}รูปโปรไฟล์:`, `${emoji}[ลิงก์โปรไฟล์](${link(user.user)})`, true)
            .addField(`${emoji2}เข้าร่วม Discord:`, `${emoji}\`${moment(user.user.createdTimestamp).format(`Do MMM YYYY`)}\`\n${emoji}\`${moment(user.user.createdTimestamp).fromNow()}\``, true)
            .addField(`${emoji2}เข้าร่วม Server:`, `${emoji}\`${moment(user.joinedTimestamp).format(`Do MMM YYYY`)}\`\n${emoji}\`${moment(user.joinedTimestamp).fromNow()}\``, true)
            .addField(`${emoji2}สถานะ:`, stats(user.user), true)
            .addField(`${emoji2}ใช้งานบนอุปกรณ์:`, drive(user.user), true)
            .addField(`${emoji2}ยศทั้งหมด:`, `${emoji}\`${user.roles.cache.size - 1} ยศ\``, true)
            .addField(`${emoji2}ยศสูงสุด:`, `${emoji}${user.roles.highest}`, true)
        return message.channel.send(embed)*/

        const embed = new Discord.MessageEmbed()
            .setAuthor(user.user.tag, user.user.displayAvatarURL())
            .setColor(user.roles.highest.color.toString(16).padStart(6, '0'))
            //.setThumbnail(link(user.user))
            .addField(`${emoji2}ชื่อ:`, `${emoji}\`${user.user.username}#${user.user.discriminator}\``, true)
            .addField(`${emoji2}ไอดี:`, `${emoji}\`${user.user.id}\``, true)
            .addField(`${emoji2}รูปโปรไฟล์:`, `${emoji}[ลิงก์โปรไฟล์](${link(user.user)})`, true)
            .addField(`${emoji2}เข้าร่วม Discord:`, `${emoji}<t:${String(user.user.createdTimestamp).slice(0, 10)}:R>`, true)
            .addField(`${emoji2}เข้าร่วม Server:`, `${emoji}<t:${String(user.joinedTimestamp).slice(0, 10)}:R>`, true)
            .addField(`${emoji2}สถานะ:`, stats(user.user), true)
            .addField(`${emoji2}ใช้งานบนอุปกรณ์:`, drive(user.user), true)
            .addField(`${emoji2}ยศทั้งหมด:`, `${emoji}\`${user.roles.cache.size - 1} ยศ\``, true)
            .addField(`${emoji2}ยศสูงสุด:`, `${emoji}${user.roles.highest}`, true)
        return message.channel.send(embed)
    }
}
