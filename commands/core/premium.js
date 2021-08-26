const Discord = require('discord.js')
const fs = require("fs")
const moment = require('moment')

module.exports = {
    config: {
        name: "premium",
        aliases: [],
        category: "core"
    },
    run: async (client, message, args) => {

        let msg = {
            "unid": `<@${message.author.id}> กรุณาระบุไอดีให้ถูกต้อง เลขไอดีมีเพียง 18 หลัก`,
            "guild": {
                "stats": "สะถานะพรีเมี่ยมของ",
                "unpremium": "กิลนี้ยังไม่เคยเป็นพรีเมี่ยม",
                "timeout": "หมดอายุการใช้งาน"
            },
            "stats": {
                "server": "สถานะพรีเมียมสำหรับเซิร์ฟเวอร์นี้:",
                "unpremium": "ยังไม่เคยเป็นพรีเมี่ยม",
                "timeout": "หมดอายุการใช้งาน"
            }
        }

        let premium = JSON.parse(fs.readFileSync(`../db/premium.json`, "utf8"))
        const emoji = client.emojis.cache.get('835871282787516447')

        const embed_user = new Discord.MessageEmbed()
            .setTitle(`${emoji} All Time Premium`)
            .setColor(client.config.color)
            .setFooter(`สนใจเช่าระบบได้ที่ allzone.online`, message.author.avatarURL())

        const embed_guild = new Discord.MessageEmbed()
            .setTitle(`${emoji} All Time Premium`)
            .setColor(client.config.color)
            .setThumbnail(message.guild.iconURL())
            .addField('All Time Premium มีระบบอะไรบ้าง', 'สามารถดูระบบทั้งหมดได้ที่ [Documents](https://docs.allzone.online/help/special)')
            .setFooter(`สนใจเช่าระบบได้ที่ allzone.online`, message.author.avatarURL())

        if (!args[0]) {
            if (!premium.guild[message.guild.id]) {
                embed_guild.setDescription(`${msg.stats.server} ${msg.stats.unpremium}`)
                return message.channel.send(embed_guild)
            }

            let guild_time = moment.unix(premium.guild[message.guild.id].time).format('DD/MM/YYYY k:mm')

            embed_guild.setDescription(`\`\`\`
${msg.stats.server} ใช้งานได้ถึงวันที่『${guild_time}』
\`\`\``)
            if (premium.guild[message.guild.id].time < moment().format('X')) {
                embed_guild.setDescription(`${msg.stats.server} ${msg.stats.timeout}`)
            }
            return message.channel.send(embed_guild)
        }
        if (args[0] == 'redeem') {
            if (!premium.guild[message.guild.id]) return message.channel.send(msg.guild.unpremium)
            if (!premium.user[message.author.id]) return message.channel.send(msg.user.unpremium)
            if (premium.user[message.author.id].credit < premium.guild[message.guild.id].credit)
                return message.channel.send(`<@${message.author.id}> เครดิตของคุณไม่พอ
กิลนี้ต้องใช้ ${premium.guild[message.guild.id].credit} เครดิต ต่อการใช้งาน 30 วัน`)

            const time = 30

            if (premium.guild[message.guild.id].time < moment().format('X')) premium.guild[message.guild.id].time = moment().format('X')
            premium.guild[message.guild.id].time = moment.unix(premium.guild[message.guild.id].time).add(time, 'days').format('X')
            premium.user[message.author.id].credit = premium.user[message.author.id].credit - premium.guild[message.guild.id].credit


            embed_user.setThumbnail(message.guild.iconURL())
                .setDescription(`\`\`\`
เพื่มระยะเวลาพรีเมี่ยมของ ${message.guild.name} อีก ${time} วันสำเร็จ
สามารถใช้งานถึงวันที่ ${moment.unix(premium.guild[message.guild.id].time).format('DD/MM/YYYY k:mm')}
\`\`\``)

            message.channel.send(embed_user)

            return fs.writeFile(`../db/premium.json`, JSON.stringify(premium), err => { if (err) { console.log(err) } })
        }
        if (args[0] == 'check') {
            if (!premium.user[message.author.id]) return message.channel.send(`<@${message.author.id}> ยังไม่เคยซื้อพรีเมี่ยม`)
            embed_user.setDescription(`\`\`\`
เครดิตพรีเมี่ยมของ ${message.author.tag} มี ${premium.user[message.author.id].credit} เครดิต
\`\`\``)
            return message.channel.send(embed_user)
        }
        if (args[0] == 'user') {
            if (!client.config.ownerid.includes(message.author.id)) return message.channel.send(`<@${message.author.id}> ในการใช้งานคำสั่งนี้จำเป็นต้องมีสิทธิ์: \`Bot Owner\``)
            if (args[1] == 'add') {
                if (!client.users.cache.get(args[2])) return message.channel.send(msg.unid)
                if (!Number(args[3])) return message.channel.send(`<@${message.author.id}> กรุณาระบุจำนวนเครดิต`)
                if (!premium.user[args[2]]) premium.user[args[2]] = { "credit": 1 }

                premium.user[args[2]].credit = premium.user[args[2]].credit + Number(args[3])

                message.channel.send(`เพื่มเครดิตของ ${client.users.cache.get(args[2]).tag} อีก ${args[3]} เครดิตสำเร็จ`)
                return fs.writeFile(`../db/premium.json`, JSON.stringify(premium), err => { if (err) { console.log(err) } })
            }
            if (args[1] == 'reset') {
                if (!client.users.cache.get(args[2])) return message.channel.send(msg.unid)
                if (!premium.user[args[2]]) return message.channel.send(msg.user.unpremium)

                delete premium.user[args[2]]

                message.channel.send(`รีเซ็ตพรีเมี่ยมของ ${client.users.cache.get(args[2]).tag} สำเร็จ`)

                return fs.writeFile(`../db/premium.json`, JSON.stringify(premium), err => { if (err) { console.log(err) } })
            }
            if (args[1] == 'check') {
                if (!client.users.cache.get(args[2])) return message.channel.send(msg.unid)
                if (!premium.user[args[2]]) return message.channel.send(msg.user.unpremium)

                message.channel.send(`เครดิตของ ${client.users.cache.get(args[2]).tag} มี ${premium.user[args[2]].credit} เครดิต`)
            }
        }
        if (args[0] == 'guild') {
            if (!client.config.ownerid.includes(message.author.id)) return message.channel.send(`<@${message.author.id}> ในการใช้งานคำสั่งนี้จำเป็นต้องมีสิทธิ์: \`Bot Owner\``)

            if (args[1] == 'add') {
                if (!client.guilds.cache.get(args[2])) return message.channel.send(msg.unid)
                if (!Number(args[3])) return message.channel.send(`<@${message.author.id}> กรุณาระบุจำนวนวัน`)
                if (!premium.guild[args[2]]) premium.guild[args[2]] = { "time": moment().format('X'), "credit": 1 }

                if (premium.guild[args[2]].time < moment().format('X')) premium.guild[args[2]].time = moment().format('X')
                premium.guild[args[2]].time = moment.unix(premium.guild[args[2]].time).add(args[3], 'days').format('X')
                const guild = client.guilds.cache.get(args[2])
                guild.time = moment.unix(premium.guild[args[2]].time).format('DD/MM/YYYY k:mm')

                embed_guild.setThumbnail(guild.iconURL())
                    .setDescription(`\`\`\`
เพื่มระยะเวลาพรีเมี่ยมของ ${guild.name} อีก ${args[3]} วันสำเร็จ
สามารถใช้งานถึงวันที่ ${guild.time}
\`\`\``)
                message.channel.send(embed_guild)
                return fs.writeFile(`../db/premium.json`, JSON.stringify(premium), err => { if (err) { console.log(err) } })
            }
            if (args[1] == 'reset') {
                if (!client.guilds.cache.get(args[2])) return message.channel.send(msg.unid)
                if (!premium.guild[args[2]]) return message.channel.send(msg.guild.unpremium)
                const guild = client.guilds.cache.get(args[2])

                delete premium.guild[args[2]]

                embed_guild.setThumbnail(guild.iconURL())
                    .setDescription(`\`\`\`
รีเซ็ตพรีเมี่ยมของ ${guild.name} สำเร็จ
\`\`\``)
                message.channel.send(embed_guild)
                return fs.writeFile(`../db/premium.json`, JSON.stringify(premium), err => { if (err) { console.log(err) } })
            }
            if (args[1] == 'check') {
                if (!client.guilds.cache.get(args[2])) return message.channel.send(msg.unid)
                if (!premium.guild[args[2]]) {
                    embed_guild.setDescription(`\`\`\`
${msg.guild.stats}
${message.guild.name}
${msg.guild.unpremium}
\`\`\``)
                    return message.channel.send(embed_guild)
                }

                const guild = client.guilds.cache.get(args[2])
                guild.time = moment.unix(premium.guild[args[2]].time).format('DD/MM/YYYY k:mm')

                embed_guild.setThumbnail(guild.iconURL())
                    .setDescription(`\`\`\`
${msg.guild.stats}
${guild.name}
ใช้งานได้ถึงวันที่
『${guild.time}』
\`\`\``)
                if (premium.guild[args[2]].time < moment().format('X')) {
                    embed_guild.setDescription(`\`\`\`
${msg.guild.stats}
${guild.name}
${msg.guild.timeout}
\`\`\``)
                }
                return message.channel.send(embed_guild)
            }
        }
    }
}