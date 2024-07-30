using NBA.Interfaces;
using NBA.Models;
using NBA.Models.Type;
using System.Data;
using System.Data.SqlClient;

namespace NBA.Repo
{
    internal class BasketballSQL : IBasketballRepo
    {
        static private readonly string serverName = "NOTE-SFP";
        static private readonly string databaseName = "Basketball";
        static private readonly string connectionString = $"Data Source={serverName};Initial Catalog={databaseName};Integrated Security=True";

        private static readonly SqlConnection conn = new(connectionString);

        internal static void Initialize()
        {
            conn.Open();
        }

        public int RegisterPlay(int gameId, int quarter, int playerId, PlayType type)
        {
            string procedure = "RegisterPlay";
            using SqlCommand cmd = new(procedure, conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@GameId", gameId);
            cmd.Parameters.AddWithValue("@Quarter", quarter);
            cmd.Parameters.AddWithValue("@PlayerId", playerId);
            cmd.Parameters.AddWithValue("@At", DateTime.Now - GetGame(gameId).At);
            cmd.Parameters.AddWithValue("@Type", type);

            return cmd.ExecuteNonQuery();
        }

        int IBasketballRepo.CreateGame(string? homeTeamId, string? visitorTeamId, DateTime at)
        {
            using SqlCommand cmd = new("CreateGame", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@HomeTeamId", homeTeamId);
            cmd.Parameters.AddWithValue("@VisitorTeamId", visitorTeamId);
            cmd.Parameters.AddWithValue("@At", at);

            return cmd.ExecuteNonQuery();
        }

        List<Play> IBasketballRepo.GetLastPlays(int gameId, int playerId, int quarter, int topRows)
        {
            List<Play> plays = [];

            string getPlays = $@"SELECT TOP {topRows} 
                                        p.Points,
                                        p.Type,
                                        p.At 
                                 FROM Play AS p 
                                 JOIN Participation AS pa 
                                   ON pa.Id = p.ParticipationId 
                                 JOIN Selection AS s
                                   ON pa.SelectionId = s.Id
                                 WHERE pa.GameId = {gameId}
                                   AND pa.Quarter = {quarter}
                                   AND s.PlayerId = {playerId}
                                 ORDER BY p.At DESC;";

            using SqlCommand getPlaysCommand = new SqlCommand(getPlays, conn);

            using (SqlDataReader reader = getPlaysCommand.ExecuteReader())
            {
                while (reader.Read())
                {
                    int points = reader.GetInt32(0);
                    string lastPlayType = reader.GetString(1);
                    TimeSpan at = reader.GetTimeSpan(2);

                    plays.Add(new Play()
                    {
                        Points = reader.GetInt32(0),
                        Type = reader.GetString(1),
                        At = reader.GetTimeSpan(2)
                    });
                }
            }
            return plays;
        }

        public Game GetGame(int gameId)
        {
            string getTime = $"SELECT At FROM Game WHERE Game.Id = {gameId}";
            using SqlCommand getTimeCmd = new(getTime, conn);

            return (Game)getTimeCmd.ExecuteScalar();
        }

        public Player GetPlayer(int playerId)
        {
            string getNameCommand = $"SELECT p.Name FROM Player AS p WHERE p.Id = {playerId}";
            using SqlCommand getPlayerName = new SqlCommand(getNameCommand, conn);

            return (Player)getPlayerName.ExecuteScalar();
        }

        public Selection? GetSelection(int gameId, int playerId)
        {
            using (SqlConnection conn = new SqlConnection("your_connection_string"))
            {
                string getSelectionHomeTeam = $@"SELECT @SelectionId = se.Id
                                                   FROM Selection AS se
		                                           JOIN Game AS ga
		                                             ON ga.HomeTeamId = se.TeamId
		                                             AND ga.SeasonId = se.SeasonId
		                                           WHERE ga.Id = {gameId} 
		                                             AND se.PlayerId = {playerId}";

                string getSelectionVisitorTeam = $@"SELECT @SelectionId = se.Id
                                                   FROM Selection AS se
		                                           JOIN Game AS ga
		                                             ON ga.VisitorTeamId = se.TeamId
		                                             AND ga.SeasonId = se.SeasonId
		                                           WHERE ga.Id = {gameId} 
		                                             AND se.PlayerId = {playerId}";

                using (SqlCommand getSelectionH = new SqlCommand(getSelectionHomeTeam, conn))
                {
                    if (getSelectionHomeTeam == null)
                    {
                        using (SqlCommand getSelectionV = new SqlCommand(getSelectionVisitorTeam, conn))
                        {
                            using (SqlDataReader reader = getSelectionV.ExecuteReader())
                            {
                                Selection selection = new()
                                {
                                    Id = reader.GetInt32(0)
                                };
                                return selection;
                            }
                        }
                    }
                    else
                        using (SqlDataReader reader = getSelectionH.ExecuteReader())
                        {
                            Selection selection = new()
                            {
                                Id = reader.GetInt32(0)
                            };
                            return selection;
                        }
                }
            }
        }
    }
}