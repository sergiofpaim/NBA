using NBA.Models.SQL;

namespace NBA.Models.CosmosDB
{
    public class PlayerSelection
    {
        
        public int PlayerId { get; set; }
        
        public string PlayerName { get; set; }
        
        public int Jersey { get; set; }
    }
}