const Discord = require('discord.js')
const fs = require("fs")
const moment = require('moment')
const disbut = require('discord-buttons')

let quickdb = require("../../../quick.db/index.js");
let db = quickdb("../db/responder.sqlite");

module.exports = {
    config: {
        name: "setting-autoresponder",
        aliases: ["sa"],
        category: "admin",
        userPerms: "MANAGE_GUILD"
    },
    run: async (client, message, args) => {

        let premium = JSON.parse(fs.readFileSync(`../db/premium.json`, "utf8"))

        if (!premium.guild[message.guild.id]) return;
        if (moment().format('X') > premium.guild[message.guild.id].time) return message.channel.send(`การเช่าระบบหมดอายุ กรุณาติดต่อแอดมิน`)

        if (args[0] == 'set') {
            if (args[1] == 'on') {
                if (!client.config.ownerid.includes(message.author.id)) return;
                const guild = args[2]
                if (!client.guilds.cache.get(guild)) return message.channel.send(`<@${message.author.id}> All Time ไม่ได้อยู่ในกิลที่ระบุ`)
                if (db.get(`data.${guild}`)) return message.channel.send(`<@${message.author.id}> กิลที่ระบุเปิดการใช้งานระบบถามตอบไว้แล้ว`)
                db.set(`data.${guild}`, {
                    "count": 0,
                    "channel": message.channel.id,
                    "autoresponder": []
                })
                return message.channel.send(`🟢 เปิดการใช้งานระบบถามตอบในกิล ${guild} สำเร็จ`)
            }
            if (args[1] == 'off') {
                if (!client.config.ownerid.includes(message.author.id)) return;
                const guild = args[2]
                if (!client.guilds.cache.get(guild)) return message.channel.send(`<@${message.author.id}> All Time ไม่ได้อยู่ในกิลที่ระบุ`)
                if (!db.get(`data.${guild}`)) return message.channel.send(`<@${message.author.id}> กิลที่ระบุไม่ได้เปิดใช้งานระบบถามตอบ`)
                db.delete(`data.${guild}`)
                return message.channel.send(`🔴 ยกเลิกการใช้งานระบบถามตอบในกิล ${guild} สำเร็จ`)
            }
        }
        if (!db.get(`data.${message.guild.id}`)) return;

        let auto = db.get(`data.${message.guild.id}.autoresponder`)

        if (!args[0]) {
            return message.channel.send(`ตรวจสอบคำอธิบายได้ที่ <${client.config.site}/help/resopnder>`)
        }

        if (args[0] == 'add') {

            if (!args[1]) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อความให้ถูกต้อง`)
            if (!args[2]) return message.channel.send(`<@${message.author.id}> กรุณาระบุคำตอบให้ถูกต้อง`)

            let status = false
            let status2 = 0

            for (data of auto) {
                if (data.a) status2 = status2 + 1
                if (data.a == args[0]) status = true
            }

            if (status == true) return message.channel.send(`<@${message.author.id}> คำนี้มีในระบบอยู่แล้ว`)
            if (status2 > db.get(`data.${message.guild.id}.count`)) return message.channel.send(`<@${message.author.id}> ตอนนี้คำเต็มขีดจำกัดแล้ว`)

            db.push(`data.${message.guild.id}.autoresponder`, {
                "a": args[1].toLowerCase(),
                "b": args.slice(2).join(' ')
            })

            return message.channel.send(`คำ \`${args[1]}\` จะตอบกลับด้วย \`${args.slice(2).join(' ')}\``)
        }

        if (args[0] == 'edit') {

            if (!args[1]) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อความให้ถูกต้อง`)
            if (!args[2]) return message.channel.send(`<@${message.author.id}> กรุณาระบุคำตอบให้ถูกต้อง`)

            let status = false

            for (data of auto) {
                if (data.a == args[1]) status = true
            }

            if (status == false) return message.channel.send(`<@${message.author.id}> คำนี้มีไม่มีในระบบ`)

            let newdata = []
            for (data of auto) {
                if (data.a !== args[1]) {
                    newdata.push(data)
                }
            }

            await db.set(`data.${message.guild.id}.autoresponder`, newdata)

            db.push(`data.${message.guild.id}.autoresponder`, {
                "a": args[1].toLowerCase(),
                "b": args.slice(2).join(' ')
            })

            return message.channel.send(`คำ \`${args[1]}\` จะตอบกลับด้วย \`${args.slice(2).join(' ')}\``)
        }

        if (args[0] == 'delete') {

            if (!args[1]) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อความให้ถูกต้อง`)

            let status = false

            for (data of auto) {
                if (data.a == args[1]) status = true
            }

            if (status == false) return message.channel.send(`<@${message.author.id}> คำนี้มีไม่มีในระบบ`)

            let newdata = []
            for (data of auto) {
                if (data.a !== args[1]) {
                    newdata.push(data)
                }
            }

            db.set(`data.${message.guild.id}.autoresponder`, newdata)

            return message.channel.send(`ลบคำ \`${args[1]}\` สำเร็จ`)
        }

        if (args[0] == 'list') {

            let page = 1
            let show = 15
            let num1 = (page * show) - show
            let num2 = page * show

            let data0 = []
            let data1 = 0
            for (data of auto) {
                if (data.a) {
                    data1 = data1 + 1;
                    data0.push({
                        "a": data.a,
                        "b": data.b,
                        "c": data1
                    })
                }
            }

            let getco = []
            for (data of data0) {
                if (data.c > num1 && data.c <= num2) {
                    getco.push({
                        "a": data.a,
                        "b": data.b,
                        "c": data.c
                    })
                }
            }

            let datashow = ``
            for (data of getco) {
                if (data.a) {
                    datashow += (`${data.c}. **${data.a}** : ${data.b}\n`)
                }
            }

            const embed = new Discord.MessageEmbed()
                .setAuthor(`รายการทั้งหมด ${data1}/${db.get(`data.${message.guild.id}.count`)}`, message.guild.iconURL())
                .setColor(client.config.color)
                .setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())
                .setTitle(`Page ${page}/${Math.ceil(data1 / show)}`)
                .setDescription(datashow);

            const left = new disbut.MessageButton()
                .setStyle("green")
                .setLabel("Left")
                .setID('left')

            const right = new disbut.MessageButton()
                .setStyle("green")
                .setLabel("Right")
                .setID('right')

            const msg = await message.channel.send({ buttons: [left, right], embed: embed })

            const collector = msg.createButtonCollector((button) => button.clicker.user.id === message.author.id, { time: 10 * 60 * 1000 });

            collector.on("collect", (b) => {
                b.reply.defer();

                if (b.id == "left") {

                    page = page - 1
                    num1 = num1 - show
                    num2 = num2 - show

                    if (page <= 0) return;

                    getco = []

                    for (data of data0) {
                        if (data.c > num1 && data.c <= num2) {
                            getco.push({
                                "a": data.a,
                                "b": data.b,
                                "c": data.c
                            })
                        }
                    }

                    datashow = ``

                    for (data of getco) {
                        if (data.a) {
                            datashow += (`${data.c}. **${data.a}** : ${data.b}\n`)
                        }
                    }

                    embed.setTitle(`Page ${page}/${Math.ceil(data1 / show)}`)
                        .setDescription(datashow);

                    return msg.edit({ buttons: [left, right], embed: embed })
                }

                if (b.id == "right") {

                    page = page + 1
                    num1 = num1 + show
                    num2 = num2 + show

                    if (page > Math.ceil(data1 / show)) return;

                    getco = []

                    for (data of data0) {
                        if (data.c > num1 && data.c <= num2) {
                            getco.push({
                                "a": data.a,
                                "b": data.b,
                                "c": data.c
                            })
                        }
                    }

                    datashow = ``

                    for (data of getco) {
                        if (data.a) {
                            datashow += (`${data.c}. **${data.a}** : ${data.b}\n`)
                        }
                    }

                    embed.setTitle(`Page ${page}/${Math.ceil(data1 / show)}`)
                        .setDescription(datashow);

                    return msg.edit({ buttons: [left, right], embed: embed })
                }
            })
            collector.on('end', (b) => {
                return msg.edit(embed)
            })
        }

        if (args[0] == 'reset') {

            message.channel.send(`ต้องการ Reset คำทั้งหมดใช่ไหม`)
                .then(async msg => {
                    msg.react('✅')
                    msg.react('❌')
                    const filter = (reaction, sent) => {
                        return ['✅', '❌'].includes(reaction.emoji.name) && sent.id === message.author.id;
                    };
                    msg.awaitReactions(filter, { max: 1, time: 60 * 1000, errors: ['time'] })
                        .then(collected => {
                            const reaction = collected.first()
                            if (reaction.emoji.name === '✅') {
                                db.set(`data.${message.guild.id}.autoresponder`, [])
                                return message.channel.send(`รีเซ็ตคำทั้งหมดสำเร็จ`)
                            }
                            if (reaction.emoji.name === '❌') {
                                return message.channel.send(`ยกเลิกการรีเซ็ตคำทั้งหมด`)
                            }
                        })
                        .catch(() => {
                            return;
                        })

                })
                .catch(() => {
                    return message.channel.send('ระบบได้ยกเลิกการใช้งานคำสั่ง')
                })
        }

        if (args[0] == 'channel') {

            let channel = null

            if (args[1]) {
                try {
                    channel = message.mentions.channels.first().id
                } catch {
                    channel = null
                }
            }

            if (Number(args[1])) {
                try {
                    if (args[1].length !== 18) return message.channel.send(`<@${message.author.id}> กรุณาระบุไอดีให้ถูกต้อง เลขไอดีมีเพียง 18 หลัก`)
                    channel = message.guild.channels.cache.get(args[1]).id
                } catch {
                    channel = null
                }
            }

            if (args[1] == 'true') channel = true

            db.set(`data.${message.guild.id}.autoresponder`, channel.id)

            return message.channel.send(`กำหนดห้องที่ใช้งานได้เป็น ${channel}`)
        }
    }
}