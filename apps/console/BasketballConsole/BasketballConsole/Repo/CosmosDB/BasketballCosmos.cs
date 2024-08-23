using Microsoft.Azure.Cosmos;
using NBA.Interfaces;
using NBA.Models.CosmosDB;
using NBA.Models.Type;
using NBA.ViewModels;
using Newtonsoft.Json.Linq;
using System.ComponentModel;
using System.Net;

namespace NBA.Repo.CosmosDB
{
    internal class BasketballCosmos : IBasketballRepo
    {
        private static readonly string EndpointUri = "https://localhost:8081";
        private static readonly string PrimaryKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
        private static readonly string DatabaseId = "NBA";

        public static CosmosClient CosmosClient { get; private set; }
        public static Microsoft.Azure.Cosmos.Container Container { get; private set; }

        public BasketballCosmos()
        {
            CosmosClient = new CosmosClient(EndpointUri, PrimaryKey, new CosmosClientOptions
            {
                SerializerOptions = new CosmosSerializationOptions
                {
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                }
            });
        }

        internal static Player Get(string id)
        {
            if (Container == null)
            {
                Console.WriteLine("Cosmos DB container is not initialized.");
                return null;
            }

            try
            {
                var response = Container.ReadItemAsync<Player>(id, new PartitionKey(id)).GetAwaiter().GetResult();
                return response.Resource;
            }
            catch (CosmosException ex)
            {
                Console.WriteLine($"Error fetching item: {ex.StatusCode} - {ex.Message}");
                return null;
            }
        }

        internal static List<Player> CreatePlayer(string filePath)
        {
            Container = CosmosClient.GetContainer(DatabaseId, "Player");
            string jsonContent = File.ReadAllText(filePath);
            var jsonArray = JArray.Parse(jsonContent);
            var players = jsonArray.ToObject<List<Player>>();

            foreach (var player in players)
            {
                var created = Create(player);
            }

            return players;
        }

        public int RegisterPlay(int gameId, int quarter, int playerId, PlayType type)
        {
            throw new NotImplementedException();
        }

        public int CreateGame(string homeTeamId, string visitorTeamId, DateTime at)
        {
            var seasonId = GetSeason();
            var homeTeam = seasonId.Teams.FirstOrDefault(t => t.TeamId == homeTeamId);
            var visitorTeam = seasonId.Teams.FirstOrDefault(t => t.TeamId == visitorTeamId);

            if (homeTeam == null || visitorTeam == null)
            {
                throw new Exception("Team does not participate in the Season");
            }

            var game = new Game
            {
                Id = (int.Parse(GetLastGame().Id) + 1).ToString(),
                SeasonId = seasonId.Id,
                HomeTeamId = homeTeamId,
                HomeTeamName = homeTeam.TeamName,
                HomePlayerIds = homeTeam.Players.Select(p => p.PlayerId).ToList(),
                VisitorTeamId = visitorTeamId,
                VisitorTeamName = visitorTeam.TeamName,
                VisitorPlayerIds = visitorTeam.Players.Select(p => p.PlayerId).ToList(),
                At = at
            };

            Container = CosmosClient.GetContainer(DatabaseId, "Game");
            var result = Container.CreateItemAsync(game, new PartitionKey(game.Id)).GetAwaiter().GetResult();

            return result.StatusCode == HttpStatusCode.Created ? 1 : 0;
        }

        private Season GetSeason()
        {
            Container = CosmosClient.GetContainer(DatabaseId, "Season");
            var query = Container.GetItemQueryIterator<Season>("SELECT * FROM c");
            var seasons = new List<Season>();

            while (query.HasMoreResults)
            {
                var response = query.ReadNextAsync().GetAwaiter().GetResult();
                seasons.AddRange(response);
            }

            return seasons
                   .OrderByDescending(s => s.Id)
                   .FirstOrDefault();
        }

        private Game GetLastGame()
        {
            Container = CosmosClient.GetContainer(DatabaseId, "Game");
            var query = Container.GetItemQueryIterator<Game>("SELECT * FROM c");
            var games = new List<Game>();

            while (query.HasMoreResults)
            {
                var response = query.ReadNextAsync().GetAwaiter().GetResult();
                games.AddRange(response);
            }

            return games
                   .OrderByDescending(g => g.Id)
                   .FirstOrDefault() ?? new Game
                   {
                       Id = "0",
                       SeasonId = "0",
                       HomeTeamId = "0",
                       HomeTeamName = "Unknown",
                       HomePlayerIds = new List<string>(),
                       VisitorTeamId = "0",
                       VisitorTeamName = "Unknown",
                       VisitorPlayerIds = new List<string>(),
                       At = DateTime.MinValue
                   };
        }

        public List<PlayVM> GetLastPlays(int gameId, int playerId, int quarter, int topRows = 0)
        {
            throw new NotImplementedException();
        }

        public GameVM GetGame(int gameId)
        {
            throw new NotImplementedException();
        }

        public PlayerVM GetPlayer(int playerId)
        {
            throw new NotImplementedException();
        }

        public SelectionVM GetSelection(int gameId, int playerId)
        {
            throw new NotImplementedException();
        }

        internal static Player Create(Player player)
        {
            var response = Container.CreateItemAsync(player, new PartitionKey(player.Id)).GetAwaiter().GetResult();
            return response;
        }
    }
}
