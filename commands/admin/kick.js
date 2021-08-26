const Discord = require('discord.js')

module.exports = {
    config: {
        name: "kick",
        aliases: [],
        category: "admin",
        userPerms: "KICK_MEMBERS",
        clientPerms: "KICK_MEMBERS"
    },
    run: async (client, message, args) => {

        let user = null

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

        if (!user.kickable) return message.channel.send(`<@${message.author.id}> ไม่สามารถเตะผู้ใช้ได้ เนื่องจากผู้ใช้คนนี้มีตำแหน่งที่สูงกว่าบอท`);
        
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "ไม่พบเหตุผลในการเตะ"

        user.kick(reason)
            .then(() => {
                message.channel.send(`${user.tag} ถูกเตะโดย ${message.author.tag} เพราะ: ${reason}`);
            })
            .catch(error => message.channel.send(`<@${message.author.id}> ไม่สามารถเตะผู้ใช้ได้เนื่องจาก: ${error.message}`));
    }
}