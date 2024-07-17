using System.Data;
using System.Data.SqlClient;
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

        internal static List<PlaySummary> GetLastPlays(int gameId, int playerId, int topRows)
        {
            List<PlaySummary> plays = [];

            string getPlays = $@"SELECT TOP {topRows} 
                                        p.Points,
                                        p.Type, 
                                        p.At 
                                 FROM Play AS p 
                                 JOIN Participation AS pa 
                                   ON pa.Id = p.ParticipationId 
                                 JOIN Selection AS s
                                   ON pa.SelectionId = s.Id
                                 JOIN Player as pl
                                   ON s.PlayerId = pl.Id
                                 WHERE pa.GameId = {gameId}
                                   AND s.PlayerId = {playerId}
                                 ORDER BY p.At DESC;";

            using SqlCommand getPlaysCommand = new SqlCommand(getPlays, conn);

            using (SqlDataReader reader = getPlaysCommand.ExecuteReader())
            {
                Console.WriteLine("Points\tType\tAt");
                Console.WriteLine(new string('-', 40));

                while (reader.Read())
                {
                    int points = reader.GetInt32(0);
                    string lastPlayType = reader.GetString(1);
                    TimeSpan at = reader.GetTimeSpan(2);

                    plays.Add(new PlaySummary()
                    {
                        Points = reader.GetInt32(0),
                        Type = reader.GetString(1),
                        At = reader.GetTimeSpan(2)
                    });
                }
            }
            return plays;
        }

        internal static DateTime GetGameStart(int gameId)
        {
            string getTime = $"SELECT At FROM Game WHERE Game.Id = {gameId}";
            using SqlCommand getTimeCmd = new(getTime, conn);

            return (DateTime)getTimeCmd.ExecuteScalar();
        }

        internal static string GetPlayerName(int playerId)
        {
            string getNameCommand = $"SELECT p.Name FROM Player AS p WHERE p.Id = {playerId}";
            using SqlCommand getPlayerName = new SqlCommand(getNameCommand, conn);

            return (string)getPlayerName.ExecuteScalar();
        }
    }
}
