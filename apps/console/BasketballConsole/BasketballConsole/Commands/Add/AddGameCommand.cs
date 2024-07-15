using Spectre.Console;
using Spectre.Console.Cli;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;

namespace NBA.Commands;

[Description("\n\nAdds a game to the data base")]

public class AddGameCommand: Command<AddGameCommand.GameParms>
{
    public sealed class GameParms : CommandSettings
    {
        [CommandOption("-o|--home <HOMETEAMIID>")]
        [Description("The id of the home team")]
        public string HomeTeamId { get; set; }

        [CommandOption("-v|--visitor <VISITORSTEAMID>")]
        [Description("The id of the visitor team")]
        public string VisitorTeamId { get; set; }

        [CommandOption("-a|--at <AT>")]
        [Description("The date of the game")]
        public DateTime At { get; set; }
    }
    public override int Execute(CommandContext context, GameParms settings)
    {
        {
            using (SqlConnection conn = new SqlConnection(Program.connectionString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand("CreateGame", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@HomeTeamId", settings.HomeTeamId);
                    cmd.Parameters.AddWithValue("@VisitorTeamId", settings.VisitorTeamId);
                    cmd.Parameters.AddWithValue("@At", settings.At);

                    int rowsAffected = cmd.ExecuteNonQuery();
                    if (rowsAffected > 0)
                    {
                        AnsiConsole.MarkupLine($"[green]Game added to the database.[/]");
                    }
                    else
                    {
                        AnsiConsole.MarkupLine($"[red]Failed to add the game to the database.[/]");
                    }
                }
            }

            return 0;
        }
    }
}
