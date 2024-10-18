using NBA.Infrastructure;
using NBA.Models.ValueObjects;

namespace NBA.Models
{
    public class Game : BasketballModel
    {
        public string SeasonId { get; set; }

        public string HomeTeamId { get; set; }

        public string HomeTeamName { get; set; }

        public List<string> HomePlayerIds { get; set; } = [];

        public string VisitorTeamId { get; set; }

        public string VisitorTeamName { get; set; }

        public List<string> VisitorPlayerIds { get; set; } = [];

        public DateTime At { get; set; }

        internal static Game FactoryFrom(string seasonId, TeamScalation homeTeam, TeamScalation visitorTeam, DateTime at)
        {
            return new()
            {
                Id = Guid.NewGuid().ToString()[..8],
                SeasonId = seasonId,
                HomeTeamId = homeTeam.TeamId,
                HomeTeamName = homeTeam.TeamName,
                HomePlayerIds = homeTeam.Players.Select(p => p.PlayerId).ToList(),
                VisitorTeamId = visitorTeam.TeamId,
                VisitorTeamName = visitorTeam.TeamName,
                VisitorPlayerIds = visitorTeam.Players.Select(p => p.PlayerId).ToList(),
                At = at
            };
        }
    }
}