const formatter = new Intl.NumberFormat('en');
const Discord = require("discord.js");
const quickdb = require("../../quick.db/index.js");
const db = quickdb("./db/prefix.sqlite");

module.exports = {
    config: {
        name: 'guildDelete'
    },
    run: async (guild, client) => {
        const webhook = require('../../webhook.json')
        const hook = new Discord.WebhookClient(webhook['id'].joinleave.id, webhook['id'].joinleave.token);
        await hook.send(`ออก \`${guild.name}\`, ${guild.id}
เจ้าของกิล ${guild.owner.user.username}, สมาชิกในกิล ${formatter.format(guild.memberCount - guild.members.cache.filter(member => member.user.bot).size)} คน ${formatter.format(guild.members.cache.filter(member => member.user.bot).size)} บอท`).catch((e) => { return console.log(e) })

        if (db.get(`prefix.${guild.id}`)) db.delete(`prefix.${guild.id}`)

        const results = [
            client.shard.fetchClientValues('guilds.cache.size'),
            client.shard.fetchClientValues("users.cache.size"),
            client.shard.fetchClientValues("channels.cache.size")
        ];
        Promise.all(results).then(async shard => {
            await client.channels.cache.get('868403000618676315').setName(`『📖』 Servers : ${formatter.format(shard[0])}`)
            await client.channels.cache.get('867651912839725057').setName(`『👤』 Users : ${formatter.format(shard[1])}`)
            await client.channels.cache.get('868410537887813633').setName(`『💬』 Channels : ${formatter.format(shard[2])}`)
            client.user.setActivity(`!help | ${shard[0]} Server`, { type: 'WATCHING' })
        })
    },
};
