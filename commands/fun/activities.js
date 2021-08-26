const Discord = require("discord.js")
const fetch = require("node-fetch");

module.exports = {
    config: {
        name: "activities",
        aliases: [],
        category: "fun"
    },

    run: async (client, message, args) => {

        function game_run(name, id) {
            fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
                method: "POST",
                body: JSON.stringify({
                    max_age: 60 * 60 * 60,
                    max_uses: 0,
                    target_application_id: id,
                    target_type: 2,
                    temporary: true,
                    validate: null
                }),
                headers: {
                    "Authorization": `Bot ${client.config.token.main}`,
                    "Content-Type": "application/json"
                }
            }).then(res => res.json()).then(invite => {
                if (!invite.code) return message.lineReplyNoMention(`เกิดข้อผิดพลาดขณะสร้างห้อง ${name}`)
                if (invite.code == '50013') return message.lineReplyNoMention(`เกิดข้อผิดพลาดขณะสร้างห้อง ${name}`)

                const embed = new Discord.MessageEmbed()
                    .setColor(client.config.color)
                    .setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())
                    .setAuthor(name, message.guild.iconURL())
                    .setDescription(`**สร้างห้องสำหรับเล่น ${name} เรียบร้อยแล้ว
ลิงก์เชิญสามารถใช้งานได้ 1 ชั่วโมง**

*ระบบนี้รองรับการใช้งานผ่าน คอมพิวเตอร์เท่านั้น*`)
                return message.channel.send(`https://discord.gg/${invite.code}`, embed)
            })
        }
        const { channel } = message.member.voice;
        if (!channel) return message.lineReplyNoMention("คุณต้องอยู่ในช่องเสียงเพื่อใช้คำสั่ง")

        function getbot(p) {
            return message.channel.send(`${client.user.tag} ไม่มีสิทธิ์ \`${p}\` กรุณาติดต่อแอดมิน`)
        }
        if (!channel.permissionsFor(client.user).has("VIEW_CHANNEL")) return getbot(`View Channel`)
        else if (!channel.permissionsFor(client.user).has("CREATE_INSTANT_INVITE")) return getbot(`Create Instant Invite`)
        
        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setTitle('🎶 Activities')
            .setDescription(`**1️⃣ : YouTube Together
2️⃣ : Betrayal.io
3️⃣ : Poker Night
4️⃣ : Fishington.io
5️⃣ : Chess in The Park
❌ : ยกเลิกคำสั่ง**`)
            .setFooter('กรุณากดอีโมจิภายใน 60 วินาที')
            .setTimestamp()
        message.channel.send(embed).then(async msg => {
            msg.react('1️⃣')
            msg.react('2️⃣')
            msg.react('3️⃣')
            msg.react('4️⃣')
            msg.react('5️⃣')
            msg.react('❌')
            const filter = (reaction, sent) => {
                return ['1️⃣', '2️⃣', '3️⃣', '4️⃣','5️⃣', '❌'].includes(reaction.emoji.name) && sent.id === message.author.id;
            };
            msg.awaitReactions(filter, { max: 1, time: 60 * 1000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first()
                    if (reaction.emoji.name === '1️⃣') return game_run('Youtube', '755600276941176913')
                    else if (reaction.emoji.name === '2️⃣') return game_run('Betrayal.io', '773336526917861400')
                    else if (reaction.emoji.name === '3️⃣') return game_run('Pokger', '755827207812677713')
                    else if (reaction.emoji.name === '4️⃣') return game_run('Fishing.io', '814288819477020702')
                    else if (reaction.emoji.name === '5️⃣') return game_run('Chess in The Park', '832012774040141894')
                    else if (reaction.emoji.name === '❌') return message.channel.send(`ยกเลิกการสร้างเกม`)
                })
        }).catch(() => {
            return message.channel.send('หมดเวลาในการใช้งานคำสั่ง')
        })
    }
}
