import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from "slash-create/web"

export default class Command extends SlashCommand 
{
    constructor(creator: SlashCreator) 
    {
        super(creator, {
            name: "bestgirl",
            description: "Tell you who is the best girl",
        })
    }

    async run() 
    {
        return "loal"
    }
}
