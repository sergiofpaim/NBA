using Microsoft.Azure.Cosmos;
using NBA.Interfaces;
using NBA.Models.CosmosDB;
using NBA.Models.Type;
using NBA.ViewModels;
using Newtonsoft.Json.Linq;
using System.ComponentModel;
using System.Security.Principal;
using static TestCosmos.Commands.ImportCommand;

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

        internal static async Task<List<Player>> AddJsonAsync(string filePath)
        {
            string jsonContent = await File.ReadAllTextAsync(filePath);

            var jsonArray = JArray.Parse(jsonContent);
            var players = jsonArray.ToObject<List<Player>>();

            foreach (var player in players)
            {
                Player created = await CreateAsync(player);
            }

            return players;
        }

        internal static async Task<Player> CreateAsync(Player player)
        {
            return await Container.CreateItemAsync(player, new PartitionKey(player.Id));
        }


        public int RegisterPlay(int gameId, int quarter, int playerId, PlayType type)
        {
            throw new NotImplementedException();
        }

        public int CreateGame(string homeTeamId, string visitorTeamId, DateTime at)
        {
            throw new NotImplementedException();
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
    }
}