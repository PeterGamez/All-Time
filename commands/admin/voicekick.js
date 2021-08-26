const Discord = require('discord.js')

module.exports = {
    config: {
        name: "voicekick",
        aliases: [],
        category: "admin",
        userPerms: "MOVE_MEMBERS",
        clientPerms: "MOVE_MEMBERS"
    },
    run: async (client, message, args) => {

        return;
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

        
    }
}