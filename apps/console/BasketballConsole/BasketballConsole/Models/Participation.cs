using NBA.Models.ValueObjects;

namespace NBA.Models
{
    public class Participation
    {
        public string Id { get; set; }

        public string GameId { get; set; }

        public int PlayerId { get; set; }

        public string PlayerName { get; set; }

        public string TeamName { get; set; }

        public List<GamePlay> Plays { get; set; } = [];
    }
}