using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;

namespace NBA.Commands;

[Description("\n\nType the data for each parameter")]

public class AddPlayCommand : Command<AddSettings>
{
    public override int Execute(CommandContext context, AddSettings settings)
    {
        {
            DateTime gameTime;
            string serverName = "NOTE-SFP";
            string databaseName = "Basketball";
            string connectionString = $"Data Source={serverName};Initial Catalog={databaseName};Integrated Security=True";
            string getTimeQuery = "SELECT At FROM Game WHERE Game.Id = GameId";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                using (SqlCommand getTimeCmd = new SqlCommand(getTimeQuery, conn))
                {
                    gameTime = (DateTime)getTimeCmd.ExecuteScalar();
                }

                TimeSpan timeDifference = DateTime.Now - gameTime;

                using (SqlCommand cmd = new SqlCommand("RegisterPlay", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@GameId", settings.GameId);
                    cmd.Parameters.AddWithValue("@Quarter", settings.Quarter);
                    cmd.Parameters.AddWithValue("@PlayerId", settings.PlayerId);
                    cmd.Parameters.AddWithValue("@Type", settings.Type);
                    cmd.Parameters.AddWithValue("@At", timeDifference);

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

            return 0;
        }
    }
}
