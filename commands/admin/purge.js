const Discord = require('discord.js')

module.exports = {
    config: {
        name: "purge",
        aliases: [],
        category: "admin",
        userPerms: "MANAGE_MESSAGES"
    },
    run: async (client, message, args) => {

        if (!Number(args[0])) return message.channel.send(`คุณ \`${message.author.tag}\` กรุณาระบุจำนวนข้อความ`)
        let messagecount = Number(args[0])
        if (messagecount < 2) return message.channel.send(`ข้อความสามารถระบุได้แค่ตั้งแต่ 2 ถึง 100 หากมากกว่า 100 จะถูกปรับเป็น 100`)
        if (messagecount > 100) messagecount = 100
        await message.delete()
        return message.channel.messages.fetch({ limit: messagecount }).then(messages => message.channel.bulkDelete(messages, true));
    }
}
