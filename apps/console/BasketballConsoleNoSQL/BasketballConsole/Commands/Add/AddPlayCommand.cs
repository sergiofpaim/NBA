using NBA.Interfaces;
using NBA.Models;
using NBA.Models.ValueObjects;
using NBA.Repo;
using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;
using System.Data;
using System.Linq;

namespace NBA.Commands;

[Description("\n\nAdds a play for an specific game")]

public class AddPlayCommand : Command<AddPlayCommand.PlayParms>
{
    public sealed class PlayParms : GlobalCommandSettings
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
        int points = 0;

        var game = Basketball.Repo.GetGame(settings.GameId);
        var teamName = Basketball.Repo.GetTeam(settings.PlayerId, settings.GameId);
        var player = Basketball.Repo.GetPlayer(settings.PlayerId);
        var participation = Basketball.Repo.GetParticipation(settings.GameId, settings.PlayerId);

        if (!game.HomePlayerIds.Contains(settings.PlayerId.ToString()) && !game.VisitorPlayerIds.Contains(settings.PlayerId.ToString()))
            throw new Exception("Player does not participate in the team for the season");

        ShowData(settings.GameId, settings.Quarter, settings.PlayerId);

        while (true)
        {
            AnsiConsole.MarkupLine("\nType the letter of the play (or h for help) and press enter:");

            PlayType? type = null;
            string choice = Console.ReadLine()?.ToUpper();

            switch (choice)
            {
                case "1":
                    {
                        type = PlayType.FreeThrowHit;
                        points = 1;
                    }
                    break;
                case "2":
                    {
                        type = PlayType.TwoPointerHit;
                        points = 2;
                    }
                    break;
                case "3":
                    {
                        type = PlayType.ThreePointerHit;
                        points = 3;
                    }
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

            var minutes = TimeSpan.FromMinutes((DateTime.Now - game.At).TotalMinutes % 15);
            var newPlay = GamePlay.FactoryFrom(settings.Quarter, type, points, minutes);

            if (participation == null)
            {
                participation = Participation.FactoryFrom(game, player, teamName, newPlay);
            }
            else
                participation.Plays.Add(newPlay);

            try
            {
                bool success = Basketball.Repo.Update(participation);
                if (!success)
                    AnsiConsole.MarkupLine($"[red]Failed to add the play to the database.[/]");
                else
                    AnsiConsole.MarkupLine($"[green]Play added to the database.[/]");

                ShowLastPlays(participation, settings.GameId, settings.PlayerId, settings.Quarter);
            }
            catch (InvalidConstraintException ex)
            {
                AnsiConsole.MarkupLine(ex.Message);
            }
        }
    }

    private void ShowData(string gameId, int quarter, string playerId)
    {
        AnsiConsole.MarkupLine($"Game Id: {gameId}\nCurrent Time: {DateTime.Now}\nQuarter: {quarter}\nPlayer: {Basketball.Repo.GetPlayer(playerId).Name}");
    }

    private void ShowLastPlays(Participation participation, string gameId, string playerId, int quarter)
    {
        var plays = participation.Plays.OrderByDescending(p => p.At)
                                       .Take(5)
                                       .ToList();

        var tableOptions = new Table();
        tableOptions.Title = new TableTitle("\n\nLast 5 Plays");
        tableOptions.AddColumn("Points");
        tableOptions.AddColumn("Type");
        tableOptions.AddColumn("At");

        foreach (var play in plays)
            tableOptions.AddRow($"{play.Points}", $"{play.Type}", $"{play.At}");

        AnsiConsole.Write(tableOptions);
    }
}