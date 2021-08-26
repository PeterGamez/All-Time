const formatter = new Intl.NumberFormat('en');
const Discord = require('discord.js')

module.exports = {
    config: {
        name: 'guildCreate'
    },
    run: async (guild, client) => {
        const webhook = require('../../../webhook.json')
        const hook = new Discord.WebhookClient(webhook['733649278165057588'].joinleave.id, webhook['733649278165057588'].joinleave.token);
        await hook.send(`เข้าร่วม \`${guild.name}\`, ${guild.id}
เจ้าของกิล ${guild.owner.user.username}, สมาชิกในกิล ${formatter.format(guild.memberCount - guild.members.cache.filter(member => member.user.bot).size)} คน ${formatter.format(guild.members.cache.filter(member => member.user.bot).size)} บอท`).catch((e) => { return console.log(e) })

        const guildsCounts = await client.shard.fetchClientValues("guilds.cache.size");
        const guildsCount = guildsCounts.reduce((p, count) => p + count);
        const usersCounts = await client.shard.fetchClientValues("users.cache.size");
        const usersCount = usersCounts.reduce((p, count) => p + count);
        const channelCounts = await client.shard.fetchClientValues("channels.cache.size");
        const channelCount = channelCounts.reduce((p, count) => p + count);

        await client.channels.cache.get('868403000618676315').setName(`『📖』 Servers : ${formatter.format(guildsCount)}`)
        await client.channels.cache.get('867651912839725057').setName(`『👤』 Users : ${formatter.format(usersCount)}`)
        await client.channels.cache.get('868410537887813633').setName(`『💬』 Channels : ${formatter.format(channelCount)}`)
        client.user.setActivity(`!help | ${guildsCount} Server`, { type: 'WATCHING' })

        if (!guild.members.cache.get(client.user.id).hasPermission('VIEW_AUDIT_LOG')) return;

        const addbotLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'ADD_BOT',
        });

        const addbotLog = addbotLogs.entries.first();

        if (!addbotLog) return;

        const user = client.users.cache.get(addbotLog.executor.id)
        const emoji = `${client.emojis.cache.get('870537659859222558')}${client.emojis.cache.get('870537659490111489')}`
        const emoji2 = `${client.emojis.cache.get('870537659725017159')}`
        const embed = new Discord.MessageEmbed()
            .setColor(client.config.color)
            .setTimestamp()
            .setDescription(`**สวัสดีครับ ${user.username}
ขอขอบคุณที่เชิญ ${client.user.username} เข้าร่วมเซิร์ฟเวอร์ ${guild.name}

เว็บไซต์บอท: <${client.config.site}>

${emoji2}Partner
${emoji}[Smilewin](https://smilewindiscord-th.web.app)
${emoji}[STAR ☆](https://star-galaxy.tk)
${emoji}[No One](https://no-one.xyz/invite)**`)

        return user.send(embed).catch(() => { return; })
    },
};
