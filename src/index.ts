import commands from "./cmds/mod"
import { SlashCreator, CloudflareWorkerServer } from "slash-create/web"

const server = new CloudflareWorkerServer()
let creator: SlashCreator

// wrangler secret put <name>
declare const DISCORD_APP_ID: string
declare const DISCORD_PUBLIC_KEY: string
declare const DISCORD_BOT_TOKEN: string
declare const DISCORD_GUILD_ID: string
declare const TETRIO_BOT_TOKEN: string

function makeCreator(env: Record<string, any>) 
{
    creator = new SlashCreator({
        allowedMentions: {
            everyone: false,
            roles: false,
            users: false
        },
        applicationID: env.DISCORD_APP_ID,
        publicKey: env.DISCORD_PUBLIC_KEY,
        token: env.DISCORD_BOT_TOKEN
    })
    
    creator.withServer(server).registerCommands(commands)

    creator.on("warn", (message) => console.warn(message))
    creator.on("error", (error) => console.error(error.stack || error.toString()))
    creator.on("commandRun", (command, _, ctx) => console.info(`${ctx.user.username} (${ctx.user.id}) ran command ${command.commandName}`))
    creator.on("commandError", (command, error) => console.error(`Err command ${command.commandName}:`, error.stack || error.toString()))
}

export default {
    async fetch(request: any, env: Record<string, any>, ctx: any) 
    {
        if (!creator) makeCreator(env)
        return server.fetch(request, env, ctx)
    }
}
