import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from "slash-create/web"

export default class Command extends SlashCommand 
{
    constructor(creator: SlashCreator) 
    {
        super(creator, {
            name: "bicalculator",
            description: "calculate how gay you feel today",
        })
    }

    async run(ctx: CommandContext) 
    {
        const seed  = Number(ctx.user.id) / 100000
       
        const date  = new Date(new Date().toLocaleString("en", { timeZone:"Asia/Jakarta" })) // GMT+7 in the meanwhile
        const day   = date.getDate()
        const month = date.getMonth() + 1
        const year  = date.getFullYear()
       
        const chance = Math.abs(Math.floor((Math.sin((seed * 31 + day) * 31 + month + year * 31) * 10000)) % 101)
       
        if (chance <= 10)       return `> •<t:${Math.round(date.getTime()/1000)}:D>•\n> Huh, you are feeling totally disinterested in either boys or girls today`
        else if (chance <= 20)  return `> •<t:${Math.round(date.getTime()/1000)}:D>•\n> What the! You are feeling interested in BOTH boys and girls today`
        else if (chance <= 40)  return `> •<t:${Math.round(date.getTime()/1000)}:D>•\n> You are feeling cute around boys today`
        else if (chance <= 60)  return `> •<t:${Math.round(date.getTime()/1000)}:D>•\n> Wow! You seems to really interested in boys today`
        else if (chance <= 80)  return `> •<t:${Math.round(date.getTime()/1000)}:D>•\n> You are feeling cute around girls today`
        else if (chance <= 100) return `> •<t:${Math.round(date.getTime()/1000)}:D>•\n> Wow! You seems to really interested in girls today`
    }
}
