const Discord = require("discord.js")
const permissionslist = require('../../../db/permissions.json');
const quickdb = require("../../../quick.db/index.js");
const prefix = quickdb("../db/prefix.sqlite");

module.exports = {
    config: {
        name: 'message'
    },
    run: async (message, client) => {

        if (message.author.bot || message.channel.type === "dm") return;

        client.prefix = client.config.prefix
        if (prefix.get(`prefix.${message.guild.id}`)) client.prefix = prefix.get(`prefix.${message.guild.id}`)

        if (message.content.trim().split(/ +/).shift().toLowerCase() === `<@!${client.user.id}>`) {
            const embed = new Discord.MessageEmbed()
                .setDescription(`**• Prefix**: \`${client.prefix}\``)
                .setColor("GREEN")
            message.channel.send(embed)
        }

        if (!message.content.startsWith(client.prefix)) return;

        const args = message.content.slice(client.prefix.length).trim().split(/ +/);
        const cmd = args.shift().toLowerCase();

        const commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))

        if (commandfile) {

            const now = Date.now()
            const timestamps = client.cooldowns.get(commandfile.config.name)
            const cooldownAmount = (commandfile.config.cooldown || 5) * 1000

            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000
                    return message.lineReplyNoMention(`กรุณารอ ${timeLeft.toFixed(1)} วินาที เพื่อใช้งานคำสั่ง \`${commandfile.config.name}\``).catch(() => { return; })
                }
            };

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

            if (commandfile.config.userPerms) {
                if (checkUserPerms(commandfile.config.userPerms) == true) {
                    try {
                        return message.lineReplyNoMention(`ในการใช้งานคำสั่งนี้ตุณจำเป็นต้องมีสิทธิ์: \`${permissionslist[commandfile.config.userPerms]}\``).catch(() => { return; })
                    } catch {
                        return;
                    }
                }
            }

            if (commandfile.config.clientPerms) {
                if (checkclientPerms(commandfile.config.clientPerms) == true) {
                    try {
                        return message.lineReplyNoMention(`${client.user.tag} ไม่มีสิทธิ์ \`${permissionslist[commandfile.config.clientPerms]}\` กรุณาติดต่อแอดมิน`).catch(() => { return; })
                    } catch {
                        return;
                    }
                }
            }

            run(message.channel)
        }

        function checkUserPerms(Permissions) {
            if (Permissions == "OWNER") {
                if (!client.config.ownerid.includes(message.author.id)) return true
            }
            else if (Permissions == "MOD") {
                if (!client.config.modid.includes(message.author.id)) return true
            }
            else if (!message.member.hasPermission(Permissions)) return true
            else return false
        }

        function checkclientPerms(Permissions) {
            if (!message.guild.me.hasPermission(Permissions)) return true
            return false
        }

        function run(guild) {
            const permissions = guild.permissionsFor(client.user)
            function getbot(p) {
                return message.lineReplyNoMention(`${client.user.tag} ไม่มีสิทธิ์ \`${p}\` กรุณาติดต่อแอดมิน`).catch(() => { return; })
            }
            if (!permissions.has("VIEW_CHANNEL")) return getbot(`View Channel`)
            else if (!permissions.has("SEND_MESSAGES")) return getbot(`Send Message`)
            else if (!permissions.has("EMBED_LINKS")) return getbot(`Embed Links`)
            else if (!permissions.has("ATTACH_FILES")) return getbot(`Attach Files`)
            else if (!permissions.has("READ_MESSAGE_HISTORY")) return getbot(`Read Message History`)
            else if (!permissions.has("MANAGE_MESSAGES")) return getbot(`Manage Message`)
            else if (!permissions.has("ADD_REACTIONS")) return getbot(`Add Reactions`)
            else if (!permissions.has("USE_EXTERNAL_EMOJIS")) return getbot(`Use External Emojis`)
            else return commandfile.run(client, message, args)
        }
    }
}