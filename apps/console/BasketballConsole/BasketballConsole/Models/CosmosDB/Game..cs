namespace NBA.Models.CosmosDB
{
    public class Game
    {
        
        public string Id { get; set; }
        
        public string SeasonId { get; set; }
        
        public string HomeTeamId { get; set; }
        
        public string HomeTeamName { get; set; }
        
        public List<int> HomePlayerIds { get; set; } = [];
        
        public string VisitorTeamId { get; set; }
        
        public string VisitorTeamName { get; set; }
        
        public List<int> VisitorPlayerIds { get; set; } = [];
        
        public DateTime At { get; set; }
    }
}
