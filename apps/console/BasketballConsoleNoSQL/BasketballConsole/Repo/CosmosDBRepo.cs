using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using NBA.Interfaces;
using NBA.Models;

namespace NBA.Repo
{
    internal class CosmosDBRepo : IBasketballRepo
    {
        private static readonly string EndpointUri = "https://localhost:8081";
        private static readonly string PrimaryKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
        private static readonly string DatabaseId = "NBA";

        public static CosmosClient CosmosClient { get; private set; }
        public static Container Container { get; private set; }

        public CosmosDBRepo()
        {
            CosmosClient = new CosmosClient(EndpointUri, PrimaryKey, new CosmosClientOptions
            {
                SerializerOptions = new CosmosSerializationOptions
                {
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                },
            });
        }

        public async Task<bool> CreateGame(Game game)
        {
            Container = CosmosClient.GetContainer(DatabaseId, "Game");

            try
            {
                await Container.CreateItemAsync(game, new PartitionKey(game.Id));
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating game: {ex.Message}");
                return false;
            }
        }

        public Game GetGame(int gameId)
        {
            throw new NotImplementedException();
        }

        public Participation GetParticipation(string gameId, string playerId)
        {
            throw new NotImplementedException();
        }

        public Player GetPlayer(int playerId)
        {
            throw new NotImplementedException();
        }

        public bool Update(Participation participation)
        {
            throw new NotImplementedException();
        }

        public Season GetLastSeason()
        {
            Container = CosmosClient.GetContainer(DatabaseId, "Season");

            var query = Container.GetItemLinqQueryable<Season>()
                                 .OrderByDescending(season => season.Id)
                                 .Take(1);

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().Result;

            return response.FirstOrDefault();
        }
    }
}
