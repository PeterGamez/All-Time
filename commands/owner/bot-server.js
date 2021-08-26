const Discord = require('discord.js')
const formatter = new Intl.NumberFormat('en')
const disbut = require('discord-buttons')

module.exports = {
    config: {
        name: "bot-server",
        aliases: ["server-list"],
        category: "owner",
        userPerms: "OWNER"
    },
    run: async (client, message, args) => {

        let i0 = 0;
        let i1 = 10;
        let page = 1;

        const results = await client.shard.broadcastEval(() => {
            return this.guilds.cache.array();
        });

        function getguild(i, guild) {
            if (guild.preferredLocale == 'en-US') return (`**${i + 1}** - :flag_us: **${guild.name}** (${guild.id})\n${formatter.format(guild.memberCount)} members\n`)
            return (`**${i + 1}** - :flag_${guild.preferredLocale}: **${guild.name}** (${guild.id})\n${formatter.format(guild.memberCount)} members\n`)
        }
        let guilds = [];
        results.forEach((a) => guilds = [...guilds, ...a]);

        let description = `Total servers: ${guilds.length}\n\n` +
            guilds.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
                .map((r, i) => getguild(i, r))
                .slice(0, 10)
                .join("\n");

        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.guild.iconURL())
            .setColor(client.config.color)
            .setFooter(`ใช้คำสั่งโดย ${message.author.tag}`, message.author.avatarURL())
            .setTitle(`Page: ${page}/${Math.ceil(guilds.length / 10)}`)
            .setDescription(description);

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
                i0 = i0 - 10;
                i1 = i1 - 10;
                page = page - 1;

                if (i0 < 0) {
                    return msg.delete(), message.delete()
                }

                description = `Total servers: ${guilds.length}\n\n` +
                    guilds.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
                        .map((r, i) => getguild(i, r))
                        .slice(i0, i1)
                        .join("\n");

                embed.setTitle(`Page: ${page}/${Math.round(guilds.length / 10)}`)
                    .setDescription(description);
                return msg.edit({ buttons: [left, right], embed: embed })
            }

            if (b.id == "right") {
                i0 = i0 + 10;
                i1 = i1 + 10;
                page = page + 1;

                if (i1 > guilds.length + 10) {
                    return msg.delete(), message.delete()
                }
                if (!i0 || !i1) {
                    return msg.delete(), message.delete()
                }

                description = `Total servers: ${guilds.length}\n\n` +
                    guilds.sort((a, b) => b.memberCount - a.memberCount).map((r) => r)
                        .map((r, i) => getguild(i, r))
                        .slice(i0, i1)
                        .join("\n");

                embed.setTitle(`Page: ${page}/${Math.round(guilds.length / 10)}`)
                    .setDescription(description);
                return msg.edit({ buttons: [left, right], embed: embed })
            }
        })
        collector.on('end', (b) => {
            left.setDisabled()
            right.setDisabled()
            return msg.edit({ buttons: [left, right], embed: embed })
        })
    }
}