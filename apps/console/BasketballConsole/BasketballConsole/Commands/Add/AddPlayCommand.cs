using NBA.Type;
using NBA.Utils;
using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;

namespace NBA.Commands;

[Description("\n\nAdds a play for an specific game")]

public class AddPlayCommand : Command<AddPlayCommand.GameParms>
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
        {
            DateTime gameTime;
            string getTimeQuery = $"SELECT At FROM Game WHERE Game.Id = {settings.GameId}";

            AnsiConsole.MarkupLine($"\n\n Game Id: {settings.GameId}\n");
            AnsiConsole.MarkupLine($"\n Current Time: {DateTime.Now}\n");
            AnsiConsole.MarkupLine($"\n Quarter: {settings.Quarter}\n");
            AnsiConsole.MarkupLine($"\n Player: {settings.PlayerId}\n");

            while (true)
            {
                using SqlConnection conn = new(Program.connectionString);
                conn.Open();

                using SqlCommand cmd = new("RegisterPlay", conn);

                using SqlCommand getTimeCmd = new(getTimeQuery, conn);
                gameTime = (DateTime)getTimeCmd.ExecuteScalar();

                TimeSpan timeDifference = DateTime.Now - gameTime;

                string choice = Console.ReadLine()?.ToUpper() ?? "";
                PlayType? type = null;

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
                            AnsiConsole.MarkupLine("\nWrite the type of the play:\n");

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

                            AnsiConsole.Render(tableOptions);
                            continue;
                        }
                    case "X":
                        return 0;
                    default:
                        Console.WriteLine("Invalid choice. Please try again.");
                        break;
                }
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@GameId", settings.GameId);
                cmd.Parameters.AddWithValue("@Quarter", settings.Quarter);
                cmd.Parameters.AddWithValue("@PlayerId", settings.PlayerId);
                cmd.Parameters.AddWithValue("@At", timeDifference);
                cmd.Parameters.AddWithValue("@Type", type.ToString());

                string command = cmd.ShowCommand();

                int rowsAffected = cmd.ExecuteNonQuery();
                if (rowsAffected > 0)
                {
                    AnsiConsole.MarkupLine($"[green]Play added to the database.[/]");
                }
                else
                {
                    AnsiConsole.MarkupLine($"[red]Failed to add the play to the database.[/]");
                }
            }
        }
    }
}
