const delay = require('delay');

module.exports = {
    config: {
        name: "steal-emoji",
        aliases: ["add-emoji"],
        category: "admin",
        userPerms: "ADMINISTRATOR",
        clientPerms: "MANAGE_EMOJIS"
    },
    run: async (client, message, args) => {

        if (!args) return message.channel.send(`กรุณาระบุ Emoji`)
        if (args.length > 20) return message.channel.send(`กำหนดการดึง Emoji สูงสุดที่ 20`)

        let url = []
        let count = 0
        const relay = 100

        for (a of args) {
            count = count + 1
            if (e = /<:.+:(\d+)>/gm.exec(a)) url.push({ "a": `https://cdn.discordapp.com/emojis/${e[1]}.png?v=1`, "b": count })

            else if (e = /<a:.+:(\d+)>/gm.exec(a)) url.push({ "a": `https://cdn.discordapp.com/emojis/${e[1]}.gif?v=1`, "b": count })
        }

        for (a of url) {
            delay(relay).then(() => {
                message.guild.emojis.create(a.a, `steal_emoji_${a.b}`).catch(() => { return; })
            })
        }
        message.channel.send(`ดึง Emoji จำนวน ${count} เสร็จสิ้น ใช้เวลา ${(count * relay / 1000).toFixed(1)} วินาที\nกรุณาเปลี่ยนชื่อ Emoji ที่ดึงมาก่อนใช้งานคำสั่งครั้งถัดไป ถ้าไม่เปลี่ยนคำสั่งจะไม่สามารถใช้งานได้`)
    }
}