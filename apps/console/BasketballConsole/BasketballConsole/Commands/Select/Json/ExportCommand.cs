using NBA.Models.CosmosDB;
using NBA.Models.Type;
using NBA.Repo.CosmosDB;
using Newtonsoft.Json;
using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;

namespace NBA.Commands.Select.Json
{
    public class ExportCommand : Command<ExportCommand.SelectParms>
    {
        public class SelectParms : CommandSettings
        {
            [CommandOption("-i|--id <ID>")]
            [Description("The id of the player")]
            public string Id { get; set; }
        }

        public override int Execute(CommandContext context, SelectParms settings)
        {
            var player = BasketballCosmos.GetAsync(settings.Id).Result;

            if (player is null)
                AnsiConsole.MarkupLine($"[Red] No items found.[/]");
            else
            {
                string jsonString = JsonConvert.SerializeObject(player, Formatting.Indented);
                AnsiConsole.MarkupLine(jsonString);
            }
            return 0;
        }
    }
}