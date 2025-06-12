import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from "slash-create/web"
import { ch } from "@haelp/teto/ch"
import EmbedBuilder from "@discord-additions/embed-builder"

import formatProfile from "./profile"

export default class Command extends SlashCommand 
{
    constructor(creator: SlashCreator) 
    {
        super(creator, {
            name: "tetrio",
            description: "Fetch TETR.IO information",
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: "profile",
                    description: "Fetch a TETR.IO profile",
                    options: [{
                        name: "username",
                        description: "can be username, id, or @mention",
                        type: CommandOptionType.STRING,
                    }]
                },

                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: "sprint",
                    description: "Fetch someone's sprint",
                    options: [{
                        name: "username",
                        description: "can be username, id, or @mention",
                        type: CommandOptionType.STRING,
                    }]
                },

                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: "blitz",
                    description: "Fetch someone's blitz",
                    options: [{
                        name: "username",
                        description: "can be username, id, or @mention",
                        type: CommandOptionType.STRING,
                    }]
                },

                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: "league",
                    description: "Fetch someone's league",
                    options: [{
                        name: "username",
                        description: "can be username, id, or @mention",
                        type: CommandOptionType.STRING,
                    }]
                },

                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: "quickplay",
                    description: "Fetch someone's quickplay",
                    options: [{
                        name: "username",
                        description: "can be username, id, or @mention",
                        type: CommandOptionType.STRING,
                    }]
                },
            ]
        })
    }

    async run(ctx: CommandContext) 
    {
        // options.username is inside options[ctx.subcommands[0]].username
        const profileMode = ctx.subcommands[0] as "profile" | "sprint" | "blitz" | "league" | "quickplay"
        const queryRaw    = ctx.options[ctx.subcommands[0]].username as string

        //ctx.options[ctx.subcommands[0]].username.trim()
        //let usernameError = []
        //// edge cases be pulling my nails
        //if (!(/^[a-zA-Z0-9]+$/.test(queryRaw))) usernameError.push("No spaces or multiple arguments!")
        //if (!(/^<@!?[0-9]+>$/.test(queryRaw))) usernameError.push("No more than one mention!")
        //if (!(/^[a-zA-Z0-9]+$/.test(queryRaw))) usernameError.push("Alphanumeric only!")
        //return usernameError.join("\n")

        // this looks painful, rewrite later

        let queryType = ""
        let query     = ""

        if (!queryRaw) 
        {
            const id = await ch.users.search(`discord:id:${ctx.user.id}`)

            if (!id?.[0]) return "Please provide a username, a user id, or a mention as the query argument!\nOr link your Discord account on TETR.IO to fetch your own profile using the command with no argument"
        
            queryType = "self"
            query     = id[0]._id
        }

        else if (queryRaw.startsWith("<@") && queryRaw.endsWith(">"))
        {
            let mention = queryRaw.slice(2, -1)
            
            if (mention.startsWith("!")) mention = mention.slice(1)

            const id = await ch.users.search(`discord:id:${mention}`)

            if (!id?.[0]) return "That user does not have a linked TETR.IO account!"

            queryType = "discord_id", //"discord_mention"
            query     = id[0]._id
        }
        
        else if (queryRaw.length > 2 && queryRaw.length < 17) 
        {
            queryType = "tetrio_username"
            query     = queryRaw
        }

        else if (queryRaw.length > 16 && queryRaw.length < 19)
        {
            const id = await ch.users.search(`discord:id:${queryRaw}`)

            if (!id?.[0]) return "That user does not have a linked TETR.IO account!"
        
            queryType = "discord_id"
            query     = id[0]._id
        }

        else if (queryRaw.length === 24)
        {
            queryType = "tetrio_id"
            query     = queryRaw
        }

        // remove this
        else 
        {
            queryType = "unknown"
            query     = "unknown"
        }

        /*
        const modes = {
            "profile": (query: string) => 
            {
                const res = await formatProfile(query)

                if (!!res.err) return res.err
            
                return {
                    embeds: [res]
                }
            },
            "sprint": (query: string) => "balls",
            "blitz": (query: string) => "balls",
            "league": (query: string) => "balls",
            "quickplay": (query: string) => "balls",
        }*/

        parentCommand: switch (profileMode)
        {
            case "profile":
            {
                const res = await formatProfile(query)

                if (!!res.err) return res.err
            
                return {
                    embeds: [res]
                }
            }

            
        }

        return

        //return `> subcommand: ${profileMode}\n> queryRaw: ${queryRaw}\n> query: ${query}\n> queryType: ${queryType}`
    
        /*parentCommand: switch (ctx.subcommands[0]) // subcommand
        {
            case "profile": 
            {
                // options.username is inside options[ctx.subcommands[0]].username
                const query = ctx.options[ctx.subcommands[0]].username

                returnValue.subcommand = ctx.subcommands[0]
                returnValue.query      = query

                break parentCommand
            }

            case "sprint": 
            {
                const query = ctx.options[ctx.subcommands[0]].username

                returnValue.subcommand = ctx.subcommands[0]
                returnValue.query      = query

                break parentCommand
            }

            case "blitz": 
            {
                const query = ctx.options[ctx.subcommands[0]].username

                returnValue.subcommand = ctx.subcommands[0]
                returnValue.query      = query

                break parentCommand
            }

            case "league": 
            {
                const query = ctx.options[ctx.subcommands[0]].username

                returnValue.subcommand = ctx.subcommands[0]
                returnValue.query      = query

                break parentCommand
            }

            case "quickplay": 
            {
                const query = ctx.options[ctx.subcommands[0]].username

                returnValue.subcommand = ctx.subcommands[0]
                returnValue.query      = query

                break parentCommand
            }
        }*/
    }

        /*if (ctx.options.username.startsWith("<@") && ctx.options.username.endsWith('>')) 
        {
            let mention = ctx.options.username.slice(2, -1)

            if (mention.startsWith("!")) mention = mention.slice(1)

            const id  = await ch.users.search(`discord:id:${mention}`)
            const res = await ch.users.get(id[0]._id)

            console.log(res)

            ctx.send({
                content: `<@${mention}>`,
                embeds: [
                    format(res).toJSON()
                ]
            })

            return
        }
    
        console.log(ctx.options.username)
    
        return "h"
    
        if (!ctx.options.username)
        {
            //if 
            return "provide a username or link your account"
        }
    
        const query = ctx.options.username.toLowerCase()
        const res   = await ch.users.get(query)

        ctx.send({
            embeds: [
                format(res).toJSON()
            ]
        })*/
}

/* */

const colorRole = {
    sysop:   0x17A585,
    admin:   0xff4E8A,
    mod:     0xCC80F2,
    halfmod: 0x5F76FE,
    bot:     0x65468A,
    user:    0x486A43,
    anon:    0x486A43, 
    hidden:  0xFF0000,
    banned:  0xFF0000
}

const emoteRole = {
    sysop:   "",
    admin:   "",
    mod:     "",
    halfmod: "",
    bot:     "",
    user:    "",
    anon:    "", 
    hidden:  "", 
    banned:  ""
}

const symbolHeiros = {
    500000: "➕",
    400000: "█▄▄➕",
    100000: "█▄▄",
    90000: "▄█▀█▄▄",
    50000: "▄█▄",
    40000: "▄█▀▄█▄",
    10000: "▄█▀",
    9000: "👑▄█▀",
    5000: "―",
    4000: "👑―",
    1000: "👑",
    900: "★ 👑",
    500: "🌙",
    400: "★🌙",
    100: "★",
    90: "◇★",
    50: "◆",
    40: "◇◆",
    10: "◇",
    9: "☐◇",
    5: "⬛",
    4: "☐⬛",
    1: "☐"
}

function Hiero(score: number): string
{
    const hieroKeys = Object.keys(symbolHeiros)
    let text = ""

    score = Math.max(0, Math.floor(score))

    while (score >= 1) 
    {
        for (let i = hieroKeys.length - 1; i >= 0; i--) 
        {
            if (score / parseInt(hieroKeys[i]) >= 1) 
            {
                score -= parseInt(hieroKeys[i])
                // @ts-ignore
                text += symbolHeiros[hieroKeys[i]]
                break
            }
        }
    }

    return text
}

function format(user: ch.Types.User)
{
    const embed = new EmbedBuilder()
    .setTitle(user.username.toUpperCase())
    .setThumbnail(user.avatar_revision ? `https://tetr.io/user-content/avatars/${user._id}.jpg?rv=${user.avatar_revision}` : "https://tetr.io/res/avatar.png")
    .setColor(user._id === "6031fedbaa921e2fb0c7153b" ? 0xD7342A : colorRole[user.role])
    .setFooter(user._id)

    if (user.role === "anon")
    {
        embed.setDescription("Anonymous account")
        return embed
    }

    else if (user.role === "banned" || user.role === "hidden")
    {
        embed.setDescription("Banned account")
        return embed
    }

    else if (user.role === "bot")
    {
        //embed.removeTitle()
        embed.setDescription(`This bot is operated by **${user.botmaster}**`)
        return embed
    }

    const friends = user.friend_count > 0 ? `${user.friend_count} 🤍` : ""
    const bio     = user.bio              ? `\n\n${user.bio}`        : ""

    embed.setDescription(friends + bio)
    embed.addField("test", "balls\nh")

    return embed
}
