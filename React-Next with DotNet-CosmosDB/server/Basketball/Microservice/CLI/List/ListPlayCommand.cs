using NBA.Models;
using NBA.Services;
using NBA.ViewModels;
using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;

namespace NBA.CLI;

[Description("\n\nSelects the plays of a specific player in a specific game and quarter, from the data base")]

public class ListPlayCommand : NBACommand<ListPlayCommand.GameParms>
{
    const int PLAYS_TO_TAKE = 5;

    public sealed class GameParms : CommandSettings
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
        var participationResult = TransactionService.GetParticipation(settings.GameId, settings.PlayerId, PLAYS_TO_TAKE);
        if (participationResult.Code != 0)
            return PrintResult(participationResult.Message, participationResult.Code);

        var game = TransactionService.GetGame(settings.GameId);

        return ShowAllPlays(participationResult.PayLoad, game.PayLoad);
    }

    private static int ShowAllPlays(ParticipationVM participation, Game game)
    {
        Table tableOptions = new()
        {
            Title = new TableTitle($"\n\n {game.HomeTeamName} vs" +
                                   $" {game.VisitorTeamName}' game" +
                                   $" on: {game.At}")
        };
        tableOptions.AddColumn("Points");
        tableOptions.AddColumn("Type");
        tableOptions.AddColumn("At");

        foreach (var play in participation.Plays)
            tableOptions.AddRow($"{play.Points}", $"{play.Type}", $"{play.At}");

        AnsiConsole.Write(tableOptions);
        return 0;
    }
}