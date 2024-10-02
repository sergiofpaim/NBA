using NBA.Models.ValueObjects;

namespace NBA.Models
{
    public class Season
    {
        public string Id { get; set; }

        public List<TeamScalation> Teams { get; set; } = [];
    }
}