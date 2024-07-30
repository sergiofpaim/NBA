using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;

namespace NBA.Commands;

[Description("\n\nAdds a game to the data base")]

public class AddGameCommand : Command<AddGameCommand.GameParms>
{
    public sealed class GameParms : CommandSettings
    {
        [CommandOption("-o|--home <HOMETEAMIID>")]
        [Description("The id of the home team")]
        public string? HomeTeamId { get; set; }

        [CommandOption("-v|--visitor <VISITORSTEAMID>")]
        [Description("The id of the visitor team")]
        public string? VisitorTeamId { get; set; }

        [CommandOption("-a|--at <AT>")]
        [Description("The date of the game")]
        public DateTime At { get; set; }
    }

    public override int Execute(CommandContext context, GameParms settings)
    {
        int rowsAffected = Repository.Main.CreateGame(settings.HomeTeamId, settings.VisitorTeamId, settings.At);

        if (rowsAffected > 0)
            AnsiConsole.MarkupLine($"[green]Game added to the database.[/]");
        else
            AnsiConsole.MarkupLine($"[red]Failed to add the game to the database.[/]");
        
        return 0;
    }
}