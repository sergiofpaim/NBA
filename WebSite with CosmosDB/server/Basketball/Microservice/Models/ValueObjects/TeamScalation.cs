namespace NBA.Models
{
    public class TeamScalation
    {
        public string Id { get; set; }

        public string TeamName { get; set; }

        public List<PlayerSelection> Players { get; set; } = [];
    }
}