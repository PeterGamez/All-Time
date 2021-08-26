const Discord = require('discord.js');
const quickdb = require("../../../quick.db/index.js");
const verify = quickdb('../db/verify.sqlite');

module.exports = {
    config: {
        name: "setting-verify",
        aliases: ["sv"],
        category: "admin",
        userPerms: "MANAGE_GUILD"
    },
    run: async (client, message, args) => {

        const cmd = args.slice(1).join(' ').split('?')[1]

        if (!args.join(' ')) {
            const emoji = `${client.emojis.cache.get('870537659859222558')}${client.emojis.cache.get('870537659490111489')}`
            const embed = new Discord.MessageEmbed()
                .setColor(client.config.color)
                .setTitle('Verify System Panel')
                .addField('[1] Stats', `${emoji}${verify.get(`guild.${message.guild.id}.stats`) !== false ? `Enable` : `Disable`}`)
                .addField('[2] Command', `${emoji}${verify.get(`guild.${message.guild.id}.cmd`)}`)
                .addField('[3] Channel', `${emoji}${verify.get(`guild.${message.guild.id}.channel`) !== false ? `<#${verify.get(`guild.${message.guild.id}.channel`)}>` : "Disable"}`)
                .addField('[4] Role Add', `${emoji}${verify.get(`guild.${message.guild.id}.add`) !== false ? `<@&${verify.get(`guild.${message.guild.id}.add`)}>` : "Disable"}\n${emoji}${verify.get(`guild.${message.guild.id}.add2`) !== false ? `<@&${verify.get(`guild.${message.guild.id}.add2`)}>` : "Disable"}`)
                .addField('[5] Role Remove', `${emoji}${verify.get(`guild.${message.guild.id}.remove`) !== false ? `<@&${verify.get(`guild.${message.guild.id}.remove`)}>` : "Disable"}\n${emoji}${verify.get(`guild.${message.guild.id}.remove2`) !== false ? `<@&${verify.get(`guild.${message.guild.id}.remove2`)}>` : "Disable"}`)
            return message.channel.send(embed)
        }
        if (cmd == '0 on') {
            if (!client.config.ownerid.includes(message.author.id)) return;
            let guild = args[0]
            if (!client.guilds.cache.get(guild)) return message.channel.send(`<@${message.author.id}> All Time ไม่ได้อยู่ในกิลที่ระบุ`)
            if (verify.get(`guild.${guild}`)) return message.channel.send(`<@${message.author.id}> กิลที่ระบุเปิดการใช้งานระบบยืนยันตัวตนไว้แล้ว`)
            verify.set(`guild.${guild}`, {
                "stats": false,
                "cmd": false,
                "channel": false,
                "add": false,
                "add2": false,
                "remove": false,
                "remove2": false
            })
            return message.channel.send(`🟢 เปิดการใช้งานระบบยืนยันตัวตนในกิล ${guild} สำเร็จ`)
        }
        if (cmd == '0 off') {
            if (!client.config.ownerid.includes(message.author.id)) return;
            let guild = args[0]
            if (!client.guilds.cache.get(guild)) return message.channel.send(`<@${message.author.id}> All Time ไม่ได้อยู่ในกิลที่ระบุ`)
            if (!verify.get(`guild.${guild}`)) return message.channel.send(`<@${message.author.id}> กิลที่ระบุไม่ได้เปิดใช้งานระบบยืนยันตัวตน`)
            verify.delete(`guild.${guild}`)
            return message.channel.send(`🔴 ยกเลิกการใช้งานระบบยืนยันตัวตนในกิล ${guild} สำเร็จ`)
        }
        if (!verify.get(`guild.${message.guild.id}`)) return;

        if (cmd == '1') {
            if (!args[0]) return message.channel.send(`กรุณาระบุคำสั่งที่ต้องการตั้ง`)
            if (args[0] == 'false') {
                verify.set(`guild.${message.guild.id}.cmd`, false)
                return message.channel.send(`ยกเลิกการใช้งานคำสั่งที่ห้องยืนยันตัวตนสำเร็จ`)
            }
            verify.set(`guild.${message.guild.id}.cmd`, args[0])
            return message.channel.send(`คำสั่งในการยืนยันตัวตนคือ ${args[0]}`)
        }

        if (cmd == '2') {
            if (args[0] == 'th') {
                verify.set(`guild.${message.guild.id}.lang`, 'th')
                return message.channel.send(`ตอบกลับผู้ใช้งานคำสั่งเป็นภาษา ไทย`)
            }
            if (args[0] == 'en') {
                verify.set(`guild.${message.guild.id}.lang`, 'en')
                return message.channel.send(`ตอบกลับผู้ใช้งานคำสั่งเป็นภาษา อังกฤษ`)
            }
            else return message.channel.send(`กรุณาระบุเพียง th หรือ en`)
        }
        if (cmd == '3') {
            let channel = null
            if (args[0]) {
                try {
                    channel = (message.guild.channels.cache.get(message.mentions.channels.first().id))
                } catch {
                    channel = null
                }
            }
            if (Number(args[0])) {
                try {
                    if (args[0].length !== 18) return message.channel.send(`<@${message.author.id}> กรุณาระบุไอดีให้ถูกต้อง เลขไอดีมีเพียง 18 หลัก`)
                    channel = message.guild.channels.cache.get(args[0])
                } catch {
                    channel = null
                }
            }
            if (channel == null) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อมูลให้ถูกต้อง`)
            verify.set(`guild.${message.guild.id}.channel`, channel.id)
            return message.channel.send(`กำหนดห้องที่ใช้คำสั่งเป็น ${channel}`)
        }
        if (cmd == '4') {
            if (!args[0]) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อมูลให้ถูกต้อง`)
            if (args[0] == 'reset') {
                verify.set(`guild.${message.guild.id}.add`, false)
                verify.set(`guild.${message.guild.id}.add2`, false)
                return message.channel.send(`รีเซ็ตบทบาทสำเร็จ`)
            }
            let role = null
            if (Number(args[0])) {
                try {
                    if (args[0].length !== 18) return message.channel.send(`<@${message.author.id}> กรุณาระบุไอดีให้ถูกต้อง เลขไอดีมีเพียง 18 หลัก`)
                    role = message.guild.roles.cache.get(args[0])
                } catch {
                    role = null
                }
            }
            if (role == null) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อมูลให้ถูกต้อง`)
            let role2 = null
            if (Number(args[1])) {
                try {
                    if (args[1].length !== 18) return message.channel.send(`<@${message.author.id}> กรุณาระบุไอดีให้ถูกต้อง เลขไอดีมีเพียง 18 หลัก`)
                    role2 = message.guild.roles.cache.get(args[1])
                } catch {
                    role2 = null
                }
            }
            verify.set(`guild.${message.guild.id}.add`, role.id)
            if (role2 !== null) verify.set(`guild.${message.guild.id}.add2`, role2.id)
            const msg = (`${role.name} ${role2 !== null ? `และ ${role2.name}` : ""}`)
            return message.channel.send(`เมื่อยืนยันเสร็จ จะมอบบทบาท ${msg}`)
        }
        if (cmd == '5') {
            if (!args[0]) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อมูลให้ถูกต้อง`)
            if (args[0] == 'reset') {
                verify.set(`guild.${message.guild.id}.remove`, false)
                verify.set(`guild.${message.guild.id}.remove2`, false)
                return message.channel.send(`รีเซ็ตบทบาทสำเร็จ`)
            }
            let role = null
            if (Number(args[0])) {
                try {
                    if (args[0].length !== 18) return message.channel.send(`<@${message.author.id}> กรุณาระบุไอดีให้ถูกต้อง เลขไอดีมีเพียง 18 หลัก`)
                    role = message.guild.roles.cache.get(args[0])
                } catch {
                    role = null
                }
            }
            if (role == null) return message.channel.send(`<@${message.author.id}> กรุณาระบุข้อมูลให้ถูกต้อง`)
            let role2 = null
            if (Number(args[1])) {
                try {
                    if (args[1].length !== 18) return message.channel.send(`<@${message.author.id}> กรุณาระบุไอดีให้ถูกต้อง เลขไอดีมีเพียง 18 หลัก`)
                    role2 = message.guild.roles.cache.get(args[1])
                } catch {
                    role2 = null
                }
            }
            verify.set(`guild.${message.guild.id}.remove`, role.id)
            if (role2 !== null) verify.set(`guild.${message.guild.id}.remove2`, role2.id)
            let msg = (`${role.name} ${role2 !== null ? `และ ${role2.name}` : ""}`)
            return message.channel.send(`เมื่อยืนยันเสร็จ จะปลดบทบาท ${msg}`)
        }
    }
}