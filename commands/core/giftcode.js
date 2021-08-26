const fetch = require('node-fetch')
const Discord = require('discord.js')
const fs = require("fs")

module.exports = {
    config: {
        name: "giftcode",
        aliases: [],
        category: "core"
    },
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send('กรุณาระบุลิงก์')
        let code = args[0].split('gift.truemoney.com/campaign/?v=')[1]
        if (!code) return message.channel.send('ลิงก์ไม่ถูกต้อง')
        const phonenumber = ('0986967174')

        let gift;

        try {
            gift = await fetch(`https://gift.truemoney.com/campaign/vouchers/${code}/redeem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'V1/5.15.0 (com.tdcm.truemoneywallet; build:674; iOS 13.3.1) Alamofire/4.8.2'
                },
                body: JSON.stringify({
                    mobile: phonenumber,
                    voucher_hash: code
                })
            }).then(res => res.json())
        } catch (err) {
            console.error(err)
        }

        function type() {
            let stats = gift.status.code
            if (stats == 'VOUCHER_OUT_OF_STOCK') return message.channel.send('ลิงก์นี้ถูกใช้ไปแล้ว')
            if (stats == 'VOUCHER_NOT_FOUND') return message.channel.send('ไม่พบอั่งเปานี้')
            if (stats == 'VOUCHER_EXPIRED') return message.channel.send('อั่งเปาหมดอายุ')
            if (stats == 'SUCCESS') return message.channel.send(`รับเงินจาก ${gift.data.owner_profile.full_name}\nเป็นจำนวน ${gift.data.my_ticket.amount_baht} บาท`)
            return;
        }
        return type()
    }
}
