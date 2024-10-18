﻿using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
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

        public bool Update(Participation participation)
        {
            try
            {
                GetContainer<Participation>().UpsertItemAsync(participation, new PartitionKey(participation.Id)).GetAwaiter().GetResult();
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
                await GetContainer<Game>().CreateItemAsync(game, new PartitionKey(game.Id));
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating game: {ex.Message}");
                return false;
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

        public T Get<T>(Expression<Func<T, bool>> predicate) where T : BasketballModel
        {
            var query = GetContainer<T>()
                .GetItemLinqQueryable<T>()
                .Where(predicate);

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().GetAwaiter().GetResult();

            return response.FirstOrDefault();
        }

        public Season GetLastSeason()
        {
            var query = GetContainer<Season>().GetItemLinqQueryable<Season>()
                                              .OrderByDescending(season => season.Id)
                                              .Take(1);

            var iterator = query.ToFeedIterator();

            var response = iterator.ReadNextAsync().Result;

            return response.FirstOrDefault();
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

            JsonSerializerOptions options = new()
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var modelJson = File.ReadAllText($"./Seed/{typeof(T).Name}.json");
            var model = JsonSerializer.Deserialize<List<T>>(modelJson, options);

            foreach (var player in model)
                GetContainer<T>().UpsertItemAsync(player);
        }
    }
}