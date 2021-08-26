const formatter = new Intl.NumberFormat('en');

module.exports = {
    config: {
        name: 'ready'
    },
    run: async (client) => {
        const results = [
            client.shard.broadcastEval('this.shard.ids[0]'),
            client.shard.broadcastEval('this.guilds.cache.size'),
            client.shard.broadcastEval('this.users.cache.size'),
            client.shard.fetchClientValues('guilds.cache.size'),
            //client.shard.fetchClientValues("users.cache.size"),
            //client.shard.fetchClientValues("channels.cache.size")
        ];
        Promise.all(results).then(async shard => {
            console.log(`[${new Date().toString().split(" ", 5).join(" ")}] Ready in shard (${shard[0]}) guild count (${shard[1]}) user count (${formatter.format(shard[2])})`)
            /*await client.channels.cache.get('867652107120803840').setName(`『💻』 System : ${client.config.version}`)
            await client.channels.cache.get('868403000618676315').setName(`『📖』 Servers : ${formatter.format(shard[3])}`)
            await client.channels.cache.get('867651912839725057').setName(`『👤』 Users : ${formatter.format(shard[4])}`)
            await client.channels.cache.get('868410537887813633').setName(`『💬』 Channels : ${formatter.format(shard[5])}`)*/
        })
        const guildsCounts = await client.shard.fetchClientValues("guilds.cache.size");
        const guildsCount = guildsCounts.reduce((p, count) => p + count);
        client.user.setActivity(`!help | ${guildsCount} Server`, { type: 'WATCHING' })
    },
};