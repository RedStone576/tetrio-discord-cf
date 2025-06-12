import { ch } from "@haelp/teto/ch"
import EmbedBuilder from "@discord-additions/embed-builder"

const roleColor = {
    sysop:   0x17A585,
    admin:   0xff4E8A,
    mod:     0xCC80F2,
    halfmod: 0x5F76FE,
    bot:     0x65468A,
    user:    0x486A43,
    anon:    0x486A43, 
    hidden:  0xFF0000,
    banned:  0xFF0000
} as const

const roleEmote = {
    sysop:   "<:sysop:1324967991514890280>",
    admin:   "<:admin:1324967994291523705>",
    mod:     "<:mod:1324967989484982353>",
    halfmod: "<:halfmod:1324967996518568008>",
    bot:     "<:verified:899275755463278632>",
    user:    "",
    anon:    ":detective:", 
    hidden:  ":ghost:", 
    banned:  ":no_entry_sign:"
} as const


export default async function(query: string)
{
    let user: ch.Types.User

    try {
        user = await ch.users.get(query)
    }

    catch(e: any)
    {
        if (e.toString().toLowerCase().includes("no such user")) return { err: "No such user!" }
        else return { err: "Something went wrong!" }
    }

    const embed = new EmbedBuilder()
    .setThumbnail(user.avatar_revision ? `https://tetr.io/user-content/avatars/${user._id}.jpg?rv=${user.avatar_revision}` : "https://tetr.io/res/avatar.png")
    .setColor(user._id === "6031fedbaa921e2fb0c7153b" ? 0xD7342A : roleColor[user.role])
    .setFooter(user._id) 
    .addField("• Joined", user.ts ? `<t:${Math.round(Date.parse(user.ts) / 1000)}:R>` : `Here since the beginning (around <t:${new Date(parseInt(user._id.substring(0, 8), 16) * 1000).getTime() / 1000}:R>)`)

    {
        const stringRole = user._id === "6031fedbaa921e2fb0c7153b" ? ":transgender_flag:" : roleEmote[user.role]
        // there's more country i think
        const stringCountry = user.country ? `:flag_${user.country.toLowerCase()}:`.replace(":flag_xm:", "<:flag_xm:899547861937709127>") : ""
    
        embed.setTitle(`${stringRole} ${user.username.toUpperCase()} ${stringCountry}`)
    }

    if (user.role === "anon")
    {
        embed.setDescription("**ANONYMOUS ACCOUNT**")
        return embed.toJSON()
    }

    if (user.role === "banned" || user.role === "hidden")
    {
        embed.setDescription("**BANNED ACCOUNT**")
        return embed.toJSON()
    }

    if (user.xp !== -1) embed.addField("• Level", Math.round(Math.pow(user.xp / 500, 0.6) + (user.xp / (5000 + Math.max(0, user.xp - 4000000) / 5000)) + 1).toString())

    {
        let friends = user.friend_count > 0 ? `🤍 ${user.friend_count}` : ""
        let bio     = user.bio ? user.bio : ""

        if (user.role === "bot")
        {   
            //embed.removeTitle()  
            let botmaster = user.botmaster!.split(", ").length > 1
            ? `This is a **BOT ACCOUNT** operated by:\n- **${user.botmaster!.split(", ").join("**\n- **")}**`
            : `This is a **BOT ACCOUNT** operated by **${user.botmaster}**`

            embed.setDescription(`${friends}${friends ? "\n\n" : ""}${bio}${bio ? "\n\n" : ""}${botmaster}`)
            return embed.toJSON()
        }

        embed.setDescription(`${friends}${friends ? "\n\n" : ""}${bio}`)
    }

    {
        const top3   = user.ar_counts.t3   ? `<:frameT3:1324960471312371742> ${user.ar_counts.t3}`     : ""
        const top5   = user.ar_counts.t5   ? `<:frameT5:1324960468305186876> ${user.ar_counts.t5}`     : ""
        const top10  = user.ar_counts.t10  ? `<:frameT10:1324960488932638821> ${user.ar_counts.t10}`   : ""
        const top25  = user.ar_counts.t25  ? `<:frameT25:1324960486340431933> ${user.ar_counts.t25}`   : ""
        const top50  = user.ar_counts.t50  ? `<:frameT50:1324960490601844818> ${user.ar_counts.t50}`   : ""
        const top100 = user.ar_counts.t100 ? `<:frameT100:1324960465578758185> ${user.ar_counts.t100}` : ""

        //typing bit wrong lol
        // @ts-ignore
        const issued   = user.ar_counts[100] ? `<:frameIssued:1324960484595732540> ${user.ar_counts[100]}` : ""
        // @ts-ignore
        const diamond  = user.ar_counts[5] ? `<:frameDiamond:1324960479746981949> ${user.ar_counts[5]}` : ""
        // @ts-ignore
        const platinum = user.ar_counts[4] ? `<:framePlatinum:1325209707409051688> ${user.ar_counts[4]}` : ""
        // @ts-ignore
        const gold     = user.ar_counts[3] ? `<:frameGold:1324960482695839775> ${user.ar_counts[3]}` : ""
        // @ts-ignore
        const silver   = user.ar_counts[2] ? `<:frameSilver:1324960473896063048> ${user.ar_counts[2]}` : ""
        // @ts-ignore
        const bronze   = user.ar_counts[1] ? `<:frameBronze:1324960477771468882> ${user.ar_counts[1]}` : ""

        embed.addField(`• Achievements (${user.ar} AR)`, `${top3} ${top5} ${top10} ${top25} ${top50} ${top100}\n${issued} ${diamond} ${platinum} ${gold} ${silver} ${bronze}`)
    }

    //embed.setDescription((user.friend_count > 0 ? `${user.friend_count} 🤍` : "") + (user.bio ? `\n\n${user.bio}` : ""))

    return embed.toJSON()
}
