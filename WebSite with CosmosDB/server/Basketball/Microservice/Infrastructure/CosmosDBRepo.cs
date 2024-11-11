using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Microsoft.Azure.Cosmos.Serialization.HybridRow;
using NBA.Models;
using System.Linq.Expressions;
using System.Text.Json;


namespace NBA.Infrastructure
{
    internal class CosmosDBRepo : IBasketballRepo
    {
        private static readonly string EndpointUri = "https://localhost:8081";
        private static readonly string PrimaryKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
        private static readonly string DatabaseId = "NBA";

        private static readonly JsonSerializerOptions options = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public static CosmosClient CosmosClient { get; private set; }
        public static Container ParticipationContainer { get; private set; }
        public static Container GameContainer { get; private set; }
        public static Container PlayerContainer { get; private set; }
        public static Container SeasonContainer { get; private set; }
        public static Container TeamContainer { get; private set; }

        private static readonly Dictionary<Type, Container> containers = [];

        private static Container GetContainer<T>()
        {
            return containers[typeof(T)];
        }

        public CosmosDBRepo()
        {
            CosmosClient = new CosmosClient(EndpointUri, PrimaryKey, new CosmosClientOptions
            {
                SerializerOptions = new CosmosSerializationOptions
                {
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                },
            });

            containers.Add(typeof(Participation), CosmosClient.GetContainer(DatabaseId, nameof(Participation)));
            containers.Add(typeof(Game), CosmosClient.GetContainer(DatabaseId, nameof(Game)));
            containers.Add(typeof(Player), CosmosClient.GetContainer(DatabaseId, nameof(Player)));
            containers.Add(typeof(Season), CosmosClient.GetContainer(DatabaseId, nameof(Season)));
            containers.Add(typeof(Team), CosmosClient.GetContainer(DatabaseId, nameof(Team)));
        }

        public async Task<T> CreateAsync<T>(T entity) where T : BasketballModel
        {
            try
            {
                var result = await GetContainer<T>().CreateItemAsync(entity, new PartitionKey(entity.Id));
                return result.Resource;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating {typeof(T).Name}: {ex.Message}");
                return null;
            }
        }

        public async Task<T> UpdateAsync<T>(T entity) where T : BasketballModel
        {
            try
            {
                var result = await GetContainer<T>().UpsertItemAsync(entity, new PartitionKey(entity.Id));
                return result.Resource;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating {typeof(T).Name}: {ex.Message}");
                return null;
            }
        }

        public T GetById<T>(string id) where T : BasketballModel
        {
            var query = GetContainer<T>().GetItemLinqQueryable<T>()
                                          .Where(i => i.Id == id);

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().GetAwaiter().GetResult();

            return response.FirstOrDefault();
        }

        public IEnumerable<T> Get<T>(Expression<Func<T, bool>> where, Expression<Func<T, object>> order = null, int? take = null ) where T : BasketballModel
        {
            var query = GetContainer<T>()
                .GetItemLinqQueryable<T>()
                .Where(where);

            if (order != null)
                query = query.OrderBy(order);

            if (take.HasValue)
                query = query.Take(take.Value);

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().GetAwaiter().GetResult();

            return response;
        }

        public void Reseed()
        {
            Reseed<Player>();
            Reseed<Game>();
            Reseed<Season>();
            Reseed<Team>();
            Reseed<Participation>();
        }

        private static void Reseed<T>() where T : BasketballModel
        {
            var modelsToClean = GetContainer<T>().GetItemQueryIterator<T>();

            while (modelsToClean.HasMoreResults)
            {
                var response = modelsToClean.ReadNextAsync().Result;

                foreach (var toClean in response)
                    GetContainer<T>().DeleteItemAsync<T>(toClean.Id, new(toClean.Id));
            }

            var modelJson = File.ReadAllText($"./Seed/{typeof(T).Name}.json");
            var model = JsonSerializer.Deserialize<List<T>>(modelJson, options);

            foreach (var player in model)
                GetContainer<T>().UpsertItemAsync(player);
        }
    }
}