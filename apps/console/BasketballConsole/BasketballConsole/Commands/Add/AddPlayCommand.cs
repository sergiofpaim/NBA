using NBA.Type;
using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;

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
        using SqlConnection conn = new(Program.connectionString);
        conn.Open();

        string getNameCommand = $"SELECT p.Name FROM Player AS p WHERE p.Id = {settings.PlayerId}";

        using SqlCommand getPlayerName = new SqlCommand(getNameCommand, conn);
        string playerName = (string)getPlayerName.ExecuteScalar();

        AnsiConsole.MarkupLine($"Game Id: {settings.GameId}\nCurrent Time: {DateTime.Now}\nQuarter: {settings.Quarter}\nPlayer: {playerName}");

        while (true)
        {
            DateTime gameTime;
            string procedure = "RegisterPlay";
            string getTime = $"SELECT At FROM Game WHERE Game.Id = {settings.GameId}";
            string getPlays = "SELECT TOP 5 pl.Name, p.Points, p.Type, p.At " +
                                  "FROM Play AS p " +
                                  "JOIN Participation AS pa " +
                                  "ON pa.Id = p.ParticipationId " +
                                  "JOIN Selection AS s " +
                                  "ON pa.SelectionId = s.Id " +
                                  "JOIN Player as pl " +
                                  "ON s.PlayerId = pl.Id " +
                                  $"WHERE pa.GameId = {settings.GameId} " +
                                  $"AND s.PlayerId = {settings.PlayerId} " +
                                  "ORDER BY p.At DESC;";

            using SqlCommand cmd = new(procedure, conn);
            using SqlCommand getTimeCmd = new(getTime, conn);
            using SqlCommand getPlaysCommand = new SqlCommand(getPlays, conn);

            using (SqlDataReader reader = getPlaysCommand.ExecuteReader())
            {
                Console.WriteLine("Name\tPoints\tType\tAt");
                Console.WriteLine(new string('-', 40));

                while (reader.Read())
                {
                    string name = reader.GetString(0);
                    int points = reader.GetInt32(1);
                    string lastPlayType = reader.GetString(2);
                    TimeSpan at = reader.GetTimeSpan(3);

                    Console.WriteLine($"{name}\t{points}\t{lastPlayType}\t{at}");
                }
            }

            gameTime = (DateTime)getTimeCmd.ExecuteScalar();
            TimeSpan timeDifference = DateTime.Now - gameTime;

            PlayType? type = null;

            AnsiConsole.MarkupLine("\nWrite the type of the play:\n");
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
                case "-H":
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
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@GameId", settings.GameId);
            cmd.Parameters.AddWithValue("@Quarter", settings.Quarter);
            cmd.Parameters.AddWithValue("@PlayerId", settings.PlayerId);
            cmd.Parameters.AddWithValue("@At", timeDifference);
            cmd.Parameters.AddWithValue("@Type", type.ToString());

            int rowsAffected = cmd.ExecuteNonQuery();

            if (rowsAffected > 0)
                AnsiConsole.MarkupLine($"[green]Play added to the database.[/]");
            else
                AnsiConsole.MarkupLine($"[red]Failed to add the play to the database.[/]");
        }
    }
}
