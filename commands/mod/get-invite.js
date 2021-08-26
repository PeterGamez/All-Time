module.exports = {
    config: {
        name: "get-invite",
        aliases: [],
        category: "mod",
        userPerms: "MOD"
    },
    run: async (client, message, args) => {
        if (Number(args[0].length !== 18)) return message.lineReplyNoMention(`กรุณาระบุไอดีให้ถูกต้อง เลขไอดีมีเพียง 18 หลัก`)
        const guild = client.guilds.cache.get(args[0])
        if (guild == null) return message.lineReplyNoMention(`กรุณาระบุข้อมูลให้ถูกต้อง`)
        const channel = guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0)
        channel.createInvite({
            maxAge: 60,
            maxUses: 1
        }).then(async (invite) => {
            message.delete()
            message.author.send(`https://discord.gg/${invite.code}`)
        })
    }
}
