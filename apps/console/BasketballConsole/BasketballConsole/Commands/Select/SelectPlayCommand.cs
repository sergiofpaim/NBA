using NBA.Models;
using NBA.Repo;
using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;

namespace NBA.Commands;

[Description("\n\nSelects the plays of a specific player in a specific game and quarter, from the data base")]

public class SelectPlayCommand : Command<SelectPlayCommand.GameParms>
{
    public sealed class GameParms : CommandSettings
    {
        [CommandOption("-g|--game <GAMEID>")]
        [Description("The game Id")]
        public int GameId { get; set; }
        [CommandOption("-q|--quarter <QUARTER>")]
        [Description("The quarter of the play")]
        public int Quarter { get; set; }

        [CommandOption("-p|--player <PLAYERID>")]
        [Description("The id of the player")]
        public int PlayerId { get; set; }
    }
    public override int Execute(CommandContext context, GameParms settings)
    {
        IBasketballRepo repo = new BasketballRepoEF();

        var selection = repo.CheckSelection(settings.GameId, settings.PlayerId);
        if (selection == 0)
            throw new Exception("Player does not participate in the team for the season");

        ShowAllPlays(settings.GameId, settings.PlayerId, settings.Quarter);

        return 0;
    }

    private void ShowAllPlays(int gameId, int playerId, int quarter)
    {
        IBasketballRepo repo = new BasketballRepoEF();
        List<Play> plays = repo.GetLastPlays(gameId, playerId, quarter);

        var tableOptions = new Table();
        tableOptions.Title = new TableTitle($"\n\n{repo.GetPlayerName(playerId)}'s plays in game {gameId}");
        tableOptions.AddColumn("Points");
        tableOptions.AddColumn("Type");
        tableOptions.AddColumn("At");

        foreach (var play in plays)
            tableOptions.AddRow($"{play.Points}", $"{play.Type}", $"{play.At}");

        AnsiConsole.Write(tableOptions);
    }
}