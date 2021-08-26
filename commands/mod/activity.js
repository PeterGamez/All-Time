module.exports = {
    config: {
        name: "activity",
        aliases: [],
        category: "mod",
        userPerms: "MOD"
    },
    run: async (client, message, args) => {
        
        const guildsCounts = await client.shard.fetchClientValues("guilds.cache.size");
        const guildsCount = guildsCounts.reduce((p, count) => p + count);
        client.user.setActivity(`!help | ${guildsCount} Server`, { type: 'WATCHING' })
    }
}
