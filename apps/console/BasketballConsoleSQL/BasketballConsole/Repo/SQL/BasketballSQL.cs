using NBA.Interfaces;
using NBA.Models;
using NBA.Models.ValueObjects;
using System.Data;
using System.Data.SqlClient;

namespace NBA.Repo
{
    internal class BasketballSQL : IBasketballRepo
    {
        static private readonly string serverName = "NOTE-SFP";
        static private readonly string databaseName = "Basketball";
        static private readonly string connectionString = $"Data Source={serverName};Initial Catalog={databaseName};Integrated Security=True;MultipleActiveResultSets=True";


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

        public int CreateGame(string homeTeamId, string visitorTeamId, DateTime at)
        {
            using SqlCommand cmd = new("CreateGame", conn);

            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@HomeTeamId", homeTeamId);
            cmd.Parameters.AddWithValue("@VisitorTeamId", visitorTeamId);
            cmd.Parameters.AddWithValue("@At", at);

            return cmd.ExecuteNonQuery();
        }

        public List<GamePlay> GetLastPlays(int gameId, int playerId, int quarter, int topRows = 0)
        {
            List<GamePlay> gamePlays = [];
            List<Tables.Play> plays = [];
            string getPlays;

            string topClause = topRows > 0 ? $"TOP {topRows}" : "";

            getPlays = $@"SELECT {topClause} * 
                          FROM Play AS p 
                          JOIN Participation AS pa 
                            ON pa.Id = p.ParticipationId 
                          JOIN Selection AS s
                            ON pa.SelectionId = s.Id
                          WHERE pa.GameId = {gameId}
                            AND pa.Quarter = {quarter}
                            AND s.PlayerId = {playerId}
                          ORDER BY p.At DESC;";

            using SqlCommand getPlaysCommand = new(getPlays, conn);
            using SqlDataReader reader = getPlaysCommand.ExecuteReader();

            while (reader.Read())
            {
                Tables.Play play = new()
                {
                    Id = reader.GetInt32(0),
                    ParticipationId = (int)(reader.IsDBNull(1) ? (int?)null : reader.GetInt32(1)),
                    Type = reader.IsDBNull(2) ? null : reader.GetString(2),
                    Points = reader.IsDBNull(3) ? 0 : reader.GetInt32(3),
                    At = reader.IsDBNull(4) ? null : reader.GetTimeSpan(4)
                };
                plays.Add(play);
            }

            foreach (var play in plays)
                gamePlays.Add(GamePlay.FactorFrom(play, quarter));

            return gamePlays;
        }

        public Game GetGame(int gameId)
        {
            string getGameQuery = $"SELECT * FROM Game WHERE Id = @gameId";
            using SqlCommand getGameCmd = new(getGameQuery, conn);
            getGameCmd.Parameters.AddWithValue("@gameId", gameId);

            using SqlDataReader gameReader = getGameCmd.ExecuteReader();
            if (!gameReader.Read())
                throw new InvalidOperationException("Game not found.");

            var game = new Tables.Game()
            {
                SeasonId = gameReader["SeasonId"] as string,
                HomeTeamId = gameReader["HomeTeamId"] as string,
                VisitorTeamId = gameReader["VisitorTeamId"] as string,
                At = gameReader.GetDateTime(gameReader.GetOrdinal("At"))
            };

            Tables.Team homeTeam = GetTeam(game.HomeTeamId);

            Tables.Team visitorTeam = GetTeam(game.VisitorTeamId);

            var homeTeamPlayerIds = GetPlayerIds(game.HomeTeamId, game.SeasonId);

            var visitorTeamPlayerIds = GetPlayerIds(game.VisitorTeamId, game.SeasonId);

            return Game.FactoryFrom(game, homeTeam, visitorTeam, homeTeamPlayerIds, visitorTeamPlayerIds);
        }

        private Tables.Team GetTeam(string teamId)
        {
            string getTeamQuery = $"SELECT * FROM Team WHERE Id = @teamId";
            using SqlCommand getTeamCmd = new(getTeamQuery, conn);
            getTeamCmd.Parameters.AddWithValue("@teamId", teamId);

            using SqlDataReader teamReader = getTeamCmd.ExecuteReader();
            if (teamReader.Read())
            {
                return new Tables.Team
                {
                    Id = teamId,
                    Name = teamReader["Name"] as string
                };
            }
            else
            {
                throw new InvalidOperationException("Team not found.");
            }
        }

        private List<string> GetPlayerIds(string teamId, string seasonId)
        {
            string getPlayersQuery = $"SELECT PlayerId FROM Selection WHERE TeamId = @teamId AND SeasonId = @seasonId";
            using SqlCommand getPlayersCmd = new(getPlayersQuery, conn);
            getPlayersCmd.Parameters.AddWithValue("@teamId", teamId);
            getPlayersCmd.Parameters.AddWithValue("@seasonId", seasonId);

            var playerIds = new List<string>();
            using (SqlDataReader playersReader = getPlayersCmd.ExecuteReader())
            {
                while (playersReader.Read())
                {
                    playerIds.Add(playersReader["PlayerId"] as string);
                }
            }

            return playerIds;
        }

        public Player GetPlayer(int playerId)
        {
            string getNameCommand = $"SELECT * FROM Player AS p WHERE p.Id = {playerId}";
            using SqlCommand getPlayerCmd = new(getNameCommand, conn);

            using SqlDataReader reader = getPlayerCmd.ExecuteReader();
            if (reader.Read())
            {
                var player = new Tables.Player()
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    Name = reader["Name"] as string,
                    BornOn = reader.IsDBNull(reader.GetOrdinal("BornOn"))
                        ? DateOnly.MinValue
                        : DateOnly.FromDateTime(reader.GetDateTime(reader.GetOrdinal("BornOn"))),
                    Position = reader["Position"] as string
                };
                return Player.FactoryFrom(player);
            }
            else
                return null;
        }

        public PlayerSelection GetSelection(int gameId, int playerId)
        {
            string querySelection = $@"SELECT *
                                       FROM Selection AS se
                                       JOIN Game AS ga ON (ga.HomeTeamId = se.TeamId OR ga.VisitorTeamId = se.TeamId)
                                                       AND ga.SeasonId = se.SeasonId
                                       WHERE ga.Id = @GameId
                                         AND se.PlayerId = @PlayerId";

            string queryName = $@"SELECT p.Name 
                                  FROM Selection AS se
                                  JOIN Game AS ga ON (ga.HomeTeamId = se.TeamId OR ga.VisitorTeamId = se.TeamId)
                                                  AND ga.SeasonId = se.SeasonId
                                  JOIN Player AS p ON se.PlayerId = p.Id
                                  WHERE p.Id = @PlayerId";

            string playerName = null;

            using (SqlCommand command = new(querySelection, conn))
            {
                command.Parameters.AddWithValue("@GameId", gameId);
                command.Parameters.AddWithValue("@PlayerId", playerId);

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        var selection = new Tables.Selection()
                        {
                            Id = reader.GetInt32(reader.GetOrdinal("Id")),
                            PlayerId = reader.IsDBNull(reader.GetOrdinal("PlayerId")) ? 0 : reader.GetInt32(reader.GetOrdinal("PlayerId")),
                            SeasonId = reader["SeasonId"] as string,
                            TeamId = reader["TeamId"] as string,
                            Jersey = reader.IsDBNull(reader.GetOrdinal("Jersey")) ? 0 : reader.GetInt32(reader.GetOrdinal("Jersey"))
                        };
                        reader.Close();

                        using (SqlCommand nameCommand = new(queryName, conn))
                        {
                            nameCommand.Parameters.AddWithValue("@PlayerId", playerId);

                            using (SqlDataReader nameReader = nameCommand.ExecuteReader())
                            {
                                if (nameReader.Read())
                                    playerName = nameReader.GetString(nameReader.GetOrdinal("Name"));
                            }
                        }
                        return PlayerSelection.FactoryFrom(selection, playerName);
                    }
                }
            }
            return null;
        }
    }
}