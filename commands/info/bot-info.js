const Discord = require('discord.js')
const os = require('os');
const formatter = new Intl.NumberFormat('en')
const fs = require("fs");

module.exports = {
    config: {
        name: "bot-info",
        aliases: ["botinfo"],
        category: "info",
        cooldown: 10
    },
    run: async (client, message, args) => {
        let msg = await message.channel.send('**กำลังโหลดข้อมูล...**')

        const guildsCounts = await client.shard.fetchClientValues("guilds.cache.size");
        const guildsCount = guildsCounts.reduce((p, count) => p + count);
        const usersCounts = await client.shard.fetchClientValues("users.cache.size");
        const usersCount = usersCounts.reduce((p, count) => p + count);

        const results = await client.shard.broadcastEval(() => {
            return [
                Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                this.guilds.cache.size,
                this.shard.ids[0],
                Math.round(this.ws.ping)
            ];
        });

        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setAuthor(`ข้อมูลของบอท ${client.user.username}`, message.guild.iconURL())
            .setTimestamp()
            //.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())
            .addField(':robot: ชื่อของบอท', `${client.user.username}#${client.user.discriminator}`, false)
            .addField(':crown: ผู้พัฒนาบอท', `**[ทีมงาน All Time](${client.config.site}/#development)**`, false)
            .addField(':label: เวอร์ชั้น', `\`System ${client.config.version}\``, true)
            .addField(':file_folder: จํานวนเซิฟเวอร์', `\`${formatter.format(guildsCount)} เซิร์ฟเวอร์\``, true)
            .addField(':file_folder: สมาชิกทั้งหมด', `\`${formatter.format(usersCount)} คน\``, true)
            .addField(':file_folder: ช่องแชททั้งหมด', `\`${formatter.format(client.channels.cache.filter((ch) => ch.type === "text").size)} ห้อง\``, true)
            .addField(':file_folder: ช่องเสียงทั้งหมด', `\`${formatter.format(client.channels.cache.filter((ch) => ch.type === "voice").size)} ห้อง\``, true)
            .addField(':computer: ซีพียู', `\`\`\`CPU\`\`\``, false)
            .addField(':computer: ระบบปฏิบัติการ', `\`OS\``, true)
            .addField(':computer: ระบบบอท', `\`Discord Js: ${Discord.version}\nNode Js: ${process.version}\``, true)
            .addField(':computer: แรมที่ใช้ไป', `\`${((os.totalmem() - os.freemem()) / Math.pow(1024, 3)).toFixed(2)}/${(os.totalmem() / Math.pow(1024, 3)).toFixed(2)} GB\``, true)

            .addField("\u200B", "\u200B");
        results.forEach((shard) => {
            const title = `${client.emojis.cache.get('820556605144825875')} shard ${shard[2]} ${client.shard.ids.includes(shard[2]) ? "( ปัจจุบัน )" : ""}`
            embed.addField(title, `${shard[1]} servers\n${shard[3]} ms\n${shard[0]} mb`, true);
        })
        return msg.edit('', embed)
    }
}
