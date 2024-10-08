using NBA.Models;
using NBA.Services;
using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;
using System.Data;

namespace NBA.CLI;

[Description("\n\nAdds a play for an specific game")]

public class AddPlayCommand : NBACommand<AddPlayCommand.PlayParms>
{
    public sealed class PlayParms : CommandSettings
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

    public override int Execute(CommandContext context, PlayParms settings)
    {
        const int PLAYS_TO_TAKE = 5;

        var gameResult = NBAService.CheckGameForPlayer(settings.GameId, settings.PlayerId);
        if (gameResult.Code != 0) 
            return PrintResult(gameResult.Message, gameResult.Code);

        ShowData(settings.GameId, settings.Quarter, settings.PlayerId);

        while (true)
        {
            AnsiConsole.MarkupLine("\nType the letter of the play (or h for help) and press enter:");

            PlayType type = default;
            string choice = Console.ReadLine()?.ToUpper();

            switch (choice)
            {
                case "1":
                    type = PlayType.FreeThrowHit;
                    break;
                case "2":
                    type = PlayType.TwoPointerHit;
                    break;
                case "3":
                    type = PlayType.ThreePointerHit;
                    break;
                case "Q":
                    type = PlayType.FreeThrowMiss;
                    break;
                case "W":
                    type = PlayType.TwoPointerMiss;
                    break;
                case "E":
                    type = PlayType.ThreePointerMiss;
                    break;
                case "A":
                    type = PlayType.Assist;
                    break;
                case "R":
                    type = PlayType.Rebound;
                    break;
                case "T":
                    type = PlayType.Turnover;
                    break;
                case "B":
                    type = PlayType.Block;
                    break;
                case "F":
                    type = PlayType.Foul;
                    break;
                case "H":
                    {
                        var tableOptions = new Table();
                        tableOptions.AddColumn("Option").Centered();
                        tableOptions.AddColumn("Description");

                        tableOptions.AddRow("1", "Made a one pointer bucket");
                        tableOptions.AddRow("2", "Made a two pointer bucket");
                        tableOptions.AddRow("3", "Made a three pointer bucket");
                        tableOptions.AddRow("q", "Missed a one pointer shot");
                        tableOptions.AddRow("w", "Missed a two pointer shot");
                        tableOptions.AddRow("e", "Missed a three pointer shot");
                        tableOptions.AddRow("a", "Assist");
                        tableOptions.AddRow("r", "Rebound");
                        tableOptions.AddRow("t", "Turnover");
                        tableOptions.AddRow("b", "Block");
                        tableOptions.AddRow("f", "Foul");
                        tableOptions.AddRow("x", "Exit");

                        AnsiConsole.Write(tableOptions);
                        continue;
                    }
                case "X":
                    return 0;
                default:
                    Console.WriteLine("Invalid choice. Please try again.");
                    continue;
            }

            var playResult = NBAService.AddPlay(settings.PlayerId, gameResult.Game, settings.Quarter, gameResult.IsHomePlayer, type, PLAYS_TO_TAKE);
            if (playResult.Code != 0)
                return PrintResult(playResult.Message, playResult.Code);

            ShowLastPlays(playResult.Participation, settings.GameId, settings.PlayerId, settings.Quarter);
        }
    }

    private static void ShowData(string gameId, int quarter, string playerId)
    {
        var result = NBAService.GetPlayer(playerId);
        if (result.Code != 0)
            PrintResult(result.Message, result.Code);
        else
            AnsiConsole.MarkupLine($"Game Id: {gameId}\nCurrent Time: {DateTime.Now}\nQuarter: {quarter}\nPlayer: {result.Player.Name}");
    }

    private static void ShowLastPlays(Participation participation, string gameId, string playerId, int quarter)
    {
        var plays = participation.Plays.Where(p => p.Quarter == quarter)
                                       .ToList();

        var tableOptions = new Table();
        tableOptions.AddColumn("Points");
        tableOptions.AddColumn("Type");
        tableOptions.AddColumn("At");
        tableOptions.Title = new TableTitle("\n\nLast 5 Plays");

        foreach (var play in plays)
            tableOptions.AddRow($"{play.Points}", $"{play.Type}", $"{play.At}");

        AnsiConsole.Write(tableOptions);
    }
}