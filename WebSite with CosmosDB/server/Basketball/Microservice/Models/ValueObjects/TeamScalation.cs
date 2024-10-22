namespace NBA.Models.ValueObjects
{
    public class TeamScalation
    {
        public string TeamId { get; set; }

        public string TeamName { get; set; }

        public List<PlayerSelection> Players { get; set; } = [];
    }
}