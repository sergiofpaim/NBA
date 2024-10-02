using NBA.Models;
using NBA.Models.ValueObjects;
using NBA.Repo;
using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;

namespace NBA.Commands;

[Description("\n\nSelects the plays of a specific player in a specific game and quarter, from the data base")]

public class ListPlayCommand : Command<ListPlayCommand.GameParms>
{
    public sealed class GameParms : GlobalCommandSettings
    {
        [CommandOption("-g|--game <GAMEID>")]
        [Description("The game Id")]
        public string GameId { get; set; }
        [CommandOption("-q|--quarter <QUARTER>")]
        [Description("The quarter of the play")]
        public int Quarter { get; set; }

        [CommandOption("-p|--player <PLAYERID>")]
        [Description("The id of the player")]
        public string PlayerId { get; set; }
    }
    public override int Execute(CommandContext context, GameParms settings)
    {
        var game = Basketball.Repo.GetGame(settings.GameId);
        var participation = Basketball.Repo.GetParticipation(settings.GameId, settings.PlayerId);

        if (!game.HomePlayerIds.Contains(settings.PlayerId.ToString()) && !game.VisitorPlayerIds.Contains(settings.PlayerId.ToString()))
            throw new Exception("Player does not participate in the team for the season");
        else
            ShowAllPlays(participation, game);

        return 0;
    }

    private void ShowAllPlays(Participation participation, Game game)
    {
        List<GamePlay> plays = participation.Plays.OrderByDescending(p => p.At).ToList();

        Table tableOptions = new()
        {
            Title = new TableTitle($"\n\n{participation.PlayerName}'s plays in the" +
                                            $" '{game.HomeTeamName} vs" +
                                            $" {game.VisitorTeamName}' game" +
                                            $" on: {game.At}")
        };
        tableOptions.AddColumn("Points");
        tableOptions.AddColumn("Type");
        tableOptions.AddColumn("At");

        foreach (var play in plays)
            tableOptions.AddRow($"{play.Points}", $"{play.Type}", $"{play.At}");

        AnsiConsole.Write(tableOptions);
    }
}