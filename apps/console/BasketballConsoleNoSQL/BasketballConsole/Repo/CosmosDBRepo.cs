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

        public bool Update(Participation participation)
        {
            Container = CosmosClient.GetContainer(DatabaseId, "Participation");

            try
            {
                Container.UpsertItemAsync(participation, new PartitionKey(participation.Id)).GetAwaiter().GetResult();
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

        public Game GetGame(string gameId)
        {
            Container = CosmosClient.GetContainer(DatabaseId, "Game");

            var query = Container.GetItemLinqQueryable<Game>()
                                 .Where(p => p.Id == gameId);

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().GetAwaiter().GetResult();

            return response.FirstOrDefault();
        }

        public Participation GetParticipation(string gameId, string playerId)
        {
            Container = CosmosClient.GetContainer(DatabaseId, "Participation");

            var query = Container.GetItemLinqQueryable<Participation>()
                                 .Where(p => p.Id == playerId);

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().GetAwaiter().GetResult();

            return response.FirstOrDefault();
        }

        public Player GetPlayer(string playerId)
        {
            Container = CosmosClient.GetContainer(DatabaseId, "Player");

            var query = Container.GetItemLinqQueryable<Player>()
                                 .Where(p => p.Id == playerId);

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().GetAwaiter().GetResult();

            return response.FirstOrDefault();
        }

        public string GetTeam(string playerId, string gameId)
        {
            Container = CosmosClient.GetContainer(DatabaseId, "Game");

            var query = Container.GetItemLinqQueryable<Game>()
                .Where(g => g.Id == gameId &&
                            (g.HomePlayerIds.Contains(playerId) || g.VisitorPlayerIds.Contains(playerId)))
                .Select(g => new
                {
                    IsHomePlayer = g.HomePlayerIds.Contains(playerId),
                    TeamName = g.HomePlayerIds.Contains(playerId) ? g.HomeTeamName : g.VisitorTeamName
                });

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().GetAwaiter().GetResult();

            if (response.Count > 0)
            {
                return response.First().TeamName;
            }

            return null;
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