using NBA.Models.CosmosDB;
using NBA.Repo.CosmosDB;
using Newtonsoft.Json.Linq;
using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;

namespace TestCosmos.Commands
{
    public class ImportCommand : Command<ImportCommand.Settings>
    {
        public class Settings : CommandSettings
        {
            [CommandOption("-f|--file <FILE_PATH>")]
            [Description("The path to the json file containing the JSON data")]
            public string FilePath { get; set; }
        }

        public override int Execute(CommandContext context, Settings settings)
        {
            //var playerIds = string.Join("\n", BasketballCosmos.CreatePlayer(settings.FilePath).GetAwaiter().GetResult().Select(p => p.Id));

            //if (playerIds is null)
            //    AnsiConsole.MarkupLine($"[Red] Failed to add player to the database.[/]");

            //else
            //    AnsiConsole.MarkupLine($"[green]Player of id:\n\n{playerIds}\n\nAdded to the database.[/]");

            return 0;
        }
    }
}
