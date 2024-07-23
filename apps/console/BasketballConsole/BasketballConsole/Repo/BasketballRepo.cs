using System.Data;
using System.Data.SqlClient;
using NBA.Models;
using NBA.Repo.Models;

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

        internal static List<Play> GetLastPlays(int gameId, int quarterId, int playerId, int topRows)
        {
            using (var context = new ApplicationDbContext())
            {
                var plays = (from p in context.Plays
                             join pa in context.Participations on p.ParticipationId equals pa.Id
                             join s in context.Selections on pa.SelectionId equals s.Id
                             join pl in context.Players on s.PlayerId equals pl.Id
                             where pa.GameId == gameId && s.PlayerId == playerId
                             orderby p.At descending
                             select new Play
                             {
                                 Points = p.Points,
                                 Type = p.Type,
                                 At = p.At
                             })
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
