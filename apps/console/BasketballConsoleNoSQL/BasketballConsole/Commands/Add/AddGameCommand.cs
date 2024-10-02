using NBA.Repo;
using NBA.Models;
using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;

namespace NBA.Commands;

[Description("\n\nAdds a game to the data base")]

public class AddGameCommand : Command<AddGameCommand.GameParms>
{
    public sealed class GameParms : GlobalCommandSettings
    {
        [CommandOption("-o|--home <HOMETEAMIID>")]
        [Description("The id of the home team")]
        public string HomeTeamId { get; set; }

        [CommandOption("-v|--visitor <VISITORSTEAMID>")]
        [Description("The id of the visitor team")]
        public string VisitorTeamId { get; set; }

        [CommandOption("-a|--at <AT>")]
        [Description("The date of the game")]
        public DateTime At { get; set; }
    }

    public override int Execute(CommandContext context, GameParms settings)
    {
        var lastSeason = Basketball.Repo.GetLastSeason();

        var homeTeam = lastSeason.Teams.FirstOrDefault(t => t.TeamId == settings.HomeTeamId);
        if (homeTeam is null)
        {
            AnsiConsole.MarkupLine($"[red]Home team not found.[/]");
            return 128;
        }

        var visitorTeam = lastSeason.Teams.FirstOrDefault(t => t.TeamId == settings.VisitorTeamId);
        if (visitorTeam is null)
        {
            AnsiConsole.MarkupLine($"[red]Visitor team not found.[/]");
            return 128;
        }

        var game = Game.FactoryFrom(lastSeason.Id, homeTeam, visitorTeam, settings.At);

        bool success = Basketball.Repo.CreateGame(game).Result;

        if (!success)
        {
            AnsiConsole.MarkupLine($"[red]Failed to add the game to the database.[/]");
            return 1;
        }

        AnsiConsole.MarkupLine($"[green]Game added to the database.[/]");
        return 0;
    }
}