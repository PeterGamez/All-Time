const config = require('../config.json')
const { ShardingManager } = require('discord.js');

const manager = new ShardingManager('./bot.js', {
    token: config.token.main,
    totalShards: 1
});

manager.on('shardCreate', shard => {
    console.log(`[${new Date().toString().split(" ", 5).join(" ")}] Main System Launched shard (${shard.id})`);

    shard.on("death", (process) => {
        console.error(`[${new Date().toString().split(" ", 5).join(" ")}] Shard (${shard.id}) closed unexpectedly! PID: ${process.pid} Exit code: ${process.exitCode}`);

        if (process.exitCode === null) {
            console.warn(`[${new Date().toString().split(" ", 5).join(" ")}] WARNING: Shard (${shard.id}) exited with NULL error code`);
        }
    });
    shard.on("disconnect", (event) => {
        console.warn(`[${new Date().toString().split(" ", 5).join(" ")}] Shard (${shard.id}) disconnected. Dumping socket close event...`);
        console.log(event);
    });
    shard.on("reconnecting", () => {
        console.warn(`[${new Date().toString().split(" ", 5).join(" ")}] Shard (${shard.id}) is reconnecting...`);
    });
    shard.on('error', (error) => {
        console.error(`[${new Date().toString().split(" ", 5).join(" ")}] Shard (${shard.id}) is ${error}`);
    });
});

manager.spawn(this.totalShards, 5500, -1);
