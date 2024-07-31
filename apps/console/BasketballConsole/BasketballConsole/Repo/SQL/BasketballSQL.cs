using NBA.Interfaces;
using NBA.Models;
using NBA.Repo.Type;
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

        public BasketballSQL()
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
            cmd.Parameters.AddWithValue("@Type", type.ToString());

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

            string getPlays = $@"SELECT TOP {topRows} * 
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
                    Play play = new Play
                    {
                        Id = reader.GetInt32(reader.GetOrdinal("Id")),
                        ParticipationId = reader.IsDBNull(1) ? (int?)null : reader.GetInt32(1),
                        Type = reader.IsDBNull(2) ? null : reader.GetString(2),
                        Points = reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3),
                        At = reader.IsDBNull(4) ? (TimeSpan?)null : reader.GetTimeSpan(4)
                    };
                    plays.Add(play);
                }
            }
            return plays;
        }

        public Game GetGame(int gameId)
        {
            string getTime = $"SELECT * FROM Game WHERE Game.Id = {gameId}";
            using SqlCommand getTimeCmd = new(getTime, conn);

            using SqlDataReader reader = getTimeCmd.ExecuteReader();
            if (reader.Read())
            {
                return new Game
                {
                    SeasonId = reader["SeasonId"] as string,
                    HomeTeamId = reader["HomeTeamId"] as string,
                    VisitorTeamId = reader["VisitorTeamId"] as string,
                    At = reader.GetDateTime(reader.GetOrdinal("At"))
                };
            }
            else
                return null;
        }

        public Player GetPlayer(int playerId)
        {
            string getNameCommand = $"SELECT * FROM Player AS p WHERE p.Id = {playerId}";
            using SqlCommand getPlayerCmd = new SqlCommand(getNameCommand, conn);

            using SqlDataReader reader = getPlayerCmd.ExecuteReader();
            if (reader.Read())
            {
                return new Player
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    Name = reader["Name"] as string,
                    BornOn = reader.IsDBNull(reader.GetOrdinal("BornOn")) ? (DateOnly?)null : DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("BornOn"))),
                    Position = reader["Position"] as string
                };
            }
            else
                return null;
        }

        public Selection? GetSelection(int gameId, int playerId)
        {
            string query = $@"SELECT *
                              FROM Selection AS se
                              JOIN Game AS ga ON (ga.HomeTeamId = se.TeamId OR ga.VisitorTeamId = se.TeamId)
                                              AND ga.SeasonId = se.SeasonId
                              WHERE ga.Id = @GameId
                                AND se.PlayerId = @PlayerId";

            using (SqlCommand command = new SqlCommand(query, conn))
            {
                command.Parameters.AddWithValue("@GameId", gameId);
                command.Parameters.AddWithValue("@PlayerId", playerId);

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new Selection
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            PlayerId = reader.IsDBNull(reader.GetOrdinal("PlayerId")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("PlayerId")),
                            SeasonId = reader["SeasonId"] as string,
                            TeamId = reader["TeamId"] as string,
                            Jersey = reader.IsDBNull(reader.GetOrdinal("Jersey")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("Jersey"))
                        };
                    }
                }
            }
            return null;
        }
    }
}