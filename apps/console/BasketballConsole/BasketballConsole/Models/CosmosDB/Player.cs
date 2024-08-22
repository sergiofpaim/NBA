using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace NBA.Models.CosmosDB
{
    internal class Player
    {
        [JsonProperty("id")]
        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonProperty("bornOn")]
        [JsonPropertyName("bornOn")]
        public DateOnly? BornOn { get; set; }

        [JsonProperty("position")]
        [JsonPropertyName("position")]
        public string Position { get; set; }
    }
}
