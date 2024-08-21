using Microsoft.Azure.Cosmos;
using NBA.Interfaces;
using NBA.Models.CosmosDB;
using NBA.Models.Type;
using System.ComponentModel;

namespace NBA.Repo.CosmosDB
{
    internal class BasketballCosmos : IBasketballRepo
    {
        private static readonly string EndpointUri = "https://localhost:8081";
        private static readonly string PrimaryKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
        private static readonly string DatabaseId = "NBA";
        private static readonly string ContainerId = "player";

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

        internal static async Task<Player> GetAsync(string id = null, string name = null)
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

        private static QueryDefinition BuildQuery(string id = null, string name = null)
        {
            var where = "";
            var parms = new List<(string Key, object Value)>();

            if (!string.IsNullOrEmpty(id))
            {
                where += " c.id = @Id";
                parms.Add(("@Id", id));
            }

            if (!string.IsNullOrEmpty(name))
            {
                where += " AND c.name = @Name";
                parms.Add(("@Name", name));
            }

            where = string.IsNullOrEmpty(where) ? "" : $"WHERE {where}";

            var definition = new QueryDefinition($"SELECT * FROM c {where}");

            parms.ForEach(p => definition.WithParameter(p.Key, p.Value));

            return definition;
        }
    }
}