import { SlashCommand, CommandOptionType, SlashCreator, CommandContext } from "slash-create/web"

export default class Command extends SlashCommand 
{
    constructor(creator: SlashCreator) 
    {
        super(creator, {
            name: "test",
            description: "balls stuff",
        })
    }

    async run(ctx: CommandContext) 
    {
        parentCommand: switch (ctx.subcommands[0]) // subcommand
        {
            case "sub1": 
            {
                //ctx.send(ctx.options[ctx.subcommand[0]])
                console.dir(ctx.options)

                break parentCommand
            }

            case "sub2":
            {
                console.dir(ctx.options)

                break parentCommand
            }
        }

        return "h"
    }
}
