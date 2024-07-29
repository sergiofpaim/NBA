using NBA.Models;
using NBA.Repo;
using NBA.Repo.Type;
using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;

namespace NBA.Commands;

[Description("\n\nAdds a play for an specific game")]

public class AddPlayCommand : Command<AddPlayCommand.AddParms>
{
    public sealed class AddParms : CommandSettings
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

    public override int Execute(CommandContext context, AddParms settings)
    {
        IBasketballRepo repo = new BasketballRepoEF();

        ShowData(settings.GameId, settings.Quarter, settings.PlayerId);

        while (true)
        {
            AnsiConsole.MarkupLine("\nType the letter of the play (or h for help) and press enter:");

            PlayType? type = null;
            string choice = Console.ReadLine()?.ToUpper() ?? "";
            
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

            int rowsAffected = repo.RegisterPlay(settings.GameId, 
                                                 settings.Quarter,
                                                 settings.PlayerId,
                                                 type.ToString());

            if (rowsAffected > 0)
                AnsiConsole.MarkupLine($"[green]Play added to the database.[/]");
            else
                AnsiConsole.MarkupLine($"[red]Failed to add the play to the database.[/]");

            ShowLastPlays(settings.GameId, settings.PlayerId, settings.Quarter);
        }
    }

    private void ShowData(int gameId, int quarter, int playerId)
    {
        IBasketballRepo repo = new BasketballRepoEF();
        AnsiConsole.MarkupLine($"Game Id: {gameId}\nCurrent Time: {DateTime.Now}\nQuarter: {quarter}\nPlayer: {repo.GetPlayerName(playerId)}");
    }

    private void ShowLastPlays(int gameId, int playerId, int quarter)
    {
        IBasketballRepo repo = new BasketballRepoEF();
        List<Play> plays = repo.GetLastPlays(gameId, playerId, quarter, 5);

        var tableOptions = new Table();
        tableOptions.AddColumn("Points");
        tableOptions.AddColumn("Type");
        tableOptions.AddColumn("At");

        foreach (var play in plays)
            tableOptions.AddRow($"{play.Points}", $"{play.Type}", $"{play.At}");

        AnsiConsole.Write(tableOptions);
    }
}
