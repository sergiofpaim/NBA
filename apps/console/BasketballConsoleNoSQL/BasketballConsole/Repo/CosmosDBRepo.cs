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
        public static Container ParticipationContainer { get; private set; }
        public static Container GameContainer { get; private set; }
        public static Container PlayerContainer { get; private set; }
        public static Container SeasonContainer { get; private set; }

        public CosmosDBRepo()
        {
            CosmosClient = new CosmosClient(EndpointUri, PrimaryKey, new CosmosClientOptions
            {
                SerializerOptions = new CosmosSerializationOptions
                {
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                },
            });

            ParticipationContainer = CosmosClient.GetContainer(DatabaseId, "Participation");
            GameContainer = CosmosClient.GetContainer(DatabaseId, "Game");
            PlayerContainer = CosmosClient.GetContainer(DatabaseId, "Player");
            SeasonContainer = CosmosClient.GetContainer(DatabaseId, "Season");
        }

        public bool Update(Participation participation)
        {
            try
            {
                ParticipationContainer.UpsertItemAsync(participation, new PartitionKey(participation.Id)).GetAwaiter().GetResult();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating participation: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> CreateGame(Game game)
        {
            try
            {
                await GameContainer.CreateItemAsync(game, new PartitionKey(game.Id));
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating game: {ex.Message}");
                return false;
            }
        }

        public Game GetGame(string gameId)
        {
            var query = GameContainer.GetItemLinqQueryable<Game>()
                                     .Where(p => p.Id == gameId);

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().GetAwaiter().GetResult();

            return response.FirstOrDefault();
        }

        public Participation GetParticipation(string gameId, string playerId)
        {
            var query = ParticipationContainer.GetItemLinqQueryable<Participation>()
                                              .Where(p => p.PlayerId == playerId && p.GameId == gameId);

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().GetAwaiter().GetResult();

            return response.FirstOrDefault();
        }

        public Player GetPlayer(string playerId)
        {
            var query = PlayerContainer.GetItemLinqQueryable<Player>()
                                       .Where(p => p.Id == playerId);

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().GetAwaiter().GetResult();

            return response.FirstOrDefault();
        }

        public Season GetLastSeason()
        {
            var query = SeasonContainer.GetItemLinqQueryable<Season>()
                                       .OrderByDescending(season => season.Id)
                                       .Take(1);

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().Result;

            return response.FirstOrDefault();
        }
    }
}