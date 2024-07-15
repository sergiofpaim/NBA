using NBA.Type;
using NBA.Utils;
using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

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

            Console.WriteLine("Write the type of the play:\n");
            Console.Write("Enter your choice: ");
            Console.WriteLine("\n\n1. Made a one pointer bucket");
            Console.WriteLine("\n2. Made a two pointer bucket");
            Console.WriteLine("\n3. Made a three pointer bucket");
            Console.WriteLine("\nq. Missed a one pointer shot");
            Console.WriteLine("\nw. Missed a two pointer shot");
            Console.WriteLine("\ne. Missed a three pointer shot");
            Console.WriteLine("\na. Assist");
            Console.WriteLine("\nr. Rebound");
            Console.WriteLine("\nt. Turnover");
            Console.WriteLine("\nb. Block");
            Console.WriteLine("\nf. Foul");
            Console.WriteLine("\nX. Exit\n");

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
