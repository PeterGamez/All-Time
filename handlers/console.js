const formatter = new Intl.NumberFormat('en');

module.exports = (client) => {
    process.openStdin().addListener("data", async res => {

        if (!res.toString().startsWith('/')) return;
        const args = res.toString().slice('/'.length).trim().split(/ +/);
        const cmd = args.shift().toLowerCase();

        if (cmd == 'checkbot') {
            const guildsCounts = await client.shard.fetchClientValues("guilds.cache.size");
            const guildsCount = guildsCounts.reduce((p, count) => p + count);
            const usersCounts = await client.shard.fetchClientValues("users.cache.size");
            const usersCount = usersCounts.reduce((p, count) => p + count);
            const channelCounts = await client.shard.fetchClientValues("channels.cache.size");
            const channelCount = channelCounts.reduce((p, count) => p + count);
            let uptime = ``;
            let totalSeconds = (client.uptime / 1000);
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let days = Math.floor(hours / 24)

            if (hours > 23) {
                hours = 0;
            }
            if (minutes > 60) {
                minutes = 0;
            }
            
            uptime += `${days} days ${hours} hours ${minutes} minutes`;

            return console.log(`[${new Date().toString().split(" ", 5).join(" ")}]
${formatter.format(guildsCount)} Servers
${formatter.format(usersCount)} Users
${formatter.format(channelCount)} Channels
${Math.round(client.ws.ping)} ms
${uptime}\n`)
        }
        else if (cmd == 'restart') {
            const guildsCounts = await client.shard.fetchClientValues("guilds.cache.size");
            const guildsCount = guildsCounts.reduce((p, count) => p + count);

            await client.destroy()
            await console.clear()
            await client.login(client.config.token.main)

            client.user.setActivity(`!help | ${guildsCount} Server`, { type: 'WATCHING' })

            const results = [
                client.shard.broadcastEval('this.shard.ids[0]'),
                client.shard.broadcastEval('this.guilds.cache.size'),
                client.shard.broadcastEval('this.users.cache.size')
            ];
            return Promise.all(results).then(shard => {
                console.log(`[${new Date().toString().split(" ", 5).join(" ")}]
Restart shard ${shard[0]} guild count ${shard[1]} user count ${formatter.format(shard[2])}\n`)
            })
        }
        else if (cmd == 'leave-server') {
            if (!args[0]) return console.log('Please enter guild id')
            if (client.guilds.cache.get(args[0])) {
                client.guilds.cache.get(args[0]).leave()
                return console.log(`[${new Date().toString().split(" ", 5).join(" ")}]
Successfully leave guild id ${args[0]}\n`)
            }
        }
        else return console.log("command not found\n")
    });
}
