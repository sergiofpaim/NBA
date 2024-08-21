namespace NBA.Models.CosmosDB
{
    internal class Season
    {
        
        public string Id { get; set; }
        
        public List<TeamScalation> Teams { get; set; } = [];
    }
}
