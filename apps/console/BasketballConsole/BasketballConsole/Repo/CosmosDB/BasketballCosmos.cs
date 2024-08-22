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
        private static readonly string ContainerId = "Player";

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
            Container = CosmosClient.GetContainer(DatabaseId, ContainerId);
        }

        internal static async Task<Player> GetAsync(string id)
        {
            if (Container == null)
            {
                Console.WriteLine("Cosmos DB container is not initialized.");
                return null;
            }

            try
            {
                var player = await Container.ReadItemAsync<Player>(id, new(id));

                return player;
            }
            catch (CosmosException ex)
            {
                Console.WriteLine($"Error exporting items: {ex.StatusCode} - {ex.Message}");
                return null;
            }
        }

        internal static async Task<List<Player>> CreatePlayerAsync(string filePath)
        {
            string jsonContent = await File.ReadAllTextAsync(filePath);

            var jsonArray = JArray.Parse(jsonContent);
            var players = jsonArray.ToObject<List<Player>>();

            foreach (var player in players)
            {
                Player created = await CreateAsync(player);

                if (created != null)
                    players = null;
            }

            return players;
        }

        public int RegisterPlay(int gameId, int quarter, int playerId, PlayType type)
        {
            throw new NotImplementedException();
        }

        public int CreateGame(string homeTeamId, string visitorTeamId, DateTime at)
        {
            var game = new Game
            {
                Id = GetMaxGame().Id + 1,
                SeasonId = GetMaxSeason().Id + 1,
                HomeTeamId = homeTeamId,
                HomeTeamName = GetMaxSeason().Teams.FirstOrDefault(t => t.TeamId == homeTeamId).TeamName,
                HomePlayerIds = GetMaxSeason().Teams.FirstOrDefault(t => t.TeamId == homeTeamId).Players.Select(p => p.PlayerId).ToList(),
                VisitorTeamId = visitorTeamId,
                VisitorTeamName = GetMaxSeason().Teams.FirstOrDefault(t => t.TeamId == visitorTeamId).TeamName,
                VisitorPlayerIds = GetMaxSeason().Teams.FirstOrDefault(t => t.TeamId == homeTeamId).Players.Select(p => p.PlayerId).ToList(),
                At = at
            };

            if (Container.CreateItemAsync(game, new PartitionKey(game.Id)).GetAwaiter().GetResult().StatusCode == HttpStatusCode.Created)
                return 1; 
            
            else
                return 0; 
        }

        private Season GetMaxSeason()
        {
            var query = Container.GetItemQueryIterator<Season>("SELECT * FROM c");
            List<Season> seasons = [];

            while (query.HasMoreResults)
            {
                var response = query.ReadNextAsync().GetAwaiter().GetResult();
                seasons.AddRange(response.Resource);
            }

            return seasons
                   .OrderByDescending(s => s.Id) 
                   .FirstOrDefault();
        }


        private Game GetMaxGame()
        {
            var query = Container.GetItemQueryIterator<Game>("SELECT * FROM c");
            List<Game> games = [];

            while (query.HasMoreResults)
            {
                var response = query.ReadNextAsync().GetAwaiter().GetResult();
                games.AddRange(response.Resource);
            }

            return games
                   .OrderByDescending(g => g.Id)
                   .FirstOrDefault();
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

        internal static async Task<Player> CreateAsync(Player player)
        {
            return await Container.CreateItemAsync(player, new PartitionKey(player.Id));
        }
    }
}