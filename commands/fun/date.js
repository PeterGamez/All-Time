const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
    config: {
        name: "date",
        aliases: [],
        category: "fun"
    },
    run: async (client, message, args) => {
        let now = moment().utcOffset(7)
        let day_of_week = now.day()
        let day_of_week_th = {
            "0": "อาทิตย์",
            "1": "จันทร์",
            "2": "อังคาร",
            "3": "พุทธ",
            "4": "พฤหัสบดี",
            "5": "ศุกร์",
            "6": "เสาร์"
        }
        let day = now.date()
        let month = now.month()
        let month_th = {
            "0": "มกรากคม",
            "1": "กุมภาพันธ์",
            "2": "มีนาคม",
            "3": "เมษายน",
            "4": "พฤษภาคม",
            "5": "มิถุนายน",
            "6": "กรกฎาคม",
            "7": "สิงหาคม",
            "8": "กันยายน",
            "9": "ตุลาคม ",
            "10": "พฤศจิกายน",
            "11": "ธันวาคม"
        }
        let year = now.add(543, 'years').year()
        let hour = now.hour()
        let minute = now.minute()
        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setDescription(`:date: วัน${day_of_week_th[day_of_week]}ที่ ${day} ${month_th[month]} ${year}\n:alarm_clock: เวลา ${hour}:${minute}`)
            .setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())
        return message.channel.send(embed)
    }
}