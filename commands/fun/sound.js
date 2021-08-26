const Discord = require('discord.js')

module.exports = {
    config: {
        name: "sound",
        aliases: [],
        category: "fun"
    },
    run: async (client, message, args) => {
        const { channel } = message.member.voice
        if (!channel) return message.channel.send(`<@${message.author.id}> คุณต้องอยู่ในช่องเสียงเพื่อใช้คำสั่งนี้`)
        if (message.guild.me.voice.channel && message.guild.me.voice.channel.id !== channel.id) return message.channel.send(`<@${message.author.id}> มีผู้ใช้งานบอทอยู่ ณ ขนะนี้`)
        
        run()
        function run() {
            
            channel.join()
            .then(connection => {
                const dispatcher = connection.play(`../sound/${args[0]}.mp3`)
                dispatcher.on("speaking", (speaking) => {
                    if (!speaking) {
                        channel.leave();
                    }
                });
            }).catch(err => console.log(err))
            message.delete()
        }
        
    }
}