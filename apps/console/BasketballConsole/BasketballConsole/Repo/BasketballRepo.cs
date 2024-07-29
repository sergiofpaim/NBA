using System.Data;
using System.Data.SqlClient;
using NBA.Models;
using NBA.Repo.Models;
using Spectre.Console;

namespace NBA.Repo
{
    internal static class BasketballRepo
    {
        static private readonly string serverName = "NOTE-SFP";
        static private readonly string databaseName = "Basketball";
        static private readonly string connectionString = $"Data Source={serverName};Initial Catalog={databaseName};Integrated Security=True";

        private static readonly SqlConnection conn = new(connectionString);

        internal static void Initialize()
        {
            conn.Open();
        }


        internal static int RegisterPlay(int gameId, int quarter, int playerId, TimeSpan timeDiff, string? type)
        {
            string procedure = "RegisterPlay";
            using SqlCommand cmd = new(procedure, conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@GameId", gameId);
            cmd.Parameters.AddWithValue("@Quarter", quarter);
            cmd.Parameters.AddWithValue("@PlayerId", playerId);
            cmd.Parameters.AddWithValue("@At", timeDiff);
            cmd.Parameters.AddWithValue("@Type", type);

            return cmd.ExecuteNonQuery();
        }

        internal static int CreateGame(string? homeTeamId, string? visitorTeamId, DateTime at)
        {
            using SqlCommand cmd = new("CreateGame", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@HomeTeamId", homeTeamId);
            cmd.Parameters.AddWithValue("@VisitorTeamId", visitorTeamId);
            cmd.Parameters.AddWithValue("@At", at);

            return cmd.ExecuteNonQuery();
        }

        internal static List<Play> GetLastPlays(int gameId, int playerId, int quarter, int topRows)
        {
            using (var context = new ApplicationDbContext())
            {
                var plays = context.Plays
                    .Where(p => context.Participations
                      .Any(pa => pa.Id == p.ParticipationId
                           && pa.GameId == gameId
                           && pa.Quarter == quarter
                           && context.Selections
                              .Any(s => s.PlayerId == playerId 
                                   && s.Id == pa.SelectionId)))
                    .OrderByDescending(p => p.At)
                    .Take(topRows)
                    .ToList();

                    return plays;
            }
        }

        internal static DateTime GetGameStart(int gameId)
        {
            using (var context = new ApplicationDbContext())
            {
                var game = context.Games.FirstOrDefault(g => g.Id == gameId);
                if (game == null)
                {
                    throw new InvalidOperationException("Game not found.");
                }
                return game.At;
            }
        }

        internal static string GetPlayerName(int playerId)
        {
            string getNameCommand = $"SELECT p.Name FROM Player AS p WHERE p.Id = {playerId}";
            using SqlCommand getPlayerName = new SqlCommand(getNameCommand, conn);

            return (string)getPlayerName.ExecuteScalar();
        }
    }
}
