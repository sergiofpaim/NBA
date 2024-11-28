using NBA.Infrastructure;

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

        public override (bool Success, string Message) Validate()
        {
            //To be improved with FluentValidation library
            if (Id is null)
                return (false, "id cannot be null");

            if (SeasonId is null)
                return (false, "seasonId cannot be null");

            if (HomeTeamId is null)
                return (false, "homeTeamId cannot be null");

            if (HomeTeamName is null)
                return (false, "homeTeamName cannot be null");

            if (HomePlayerIds is null || HomePlayerIds.Count < 5 || HomePlayerIds.Any(string.IsNullOrWhiteSpace))
                return (false, "homePlayerIds should have at least 5 valid ids");

            if (VisitorTeamId is null)
                return (false, "visitorTeamId cannot be null");

            if (VisitorTeamName is null)
                return (false, "visitorTeamName cannot be null");

            if (VisitorPlayerIds is null || VisitorPlayerIds.Count < 5 || VisitorPlayerIds.Any(string.IsNullOrWhiteSpace))
                return (false, "visitorPlayerIds should have at least 5 valid ids");

            if (At == DateTime.MinValue)
                return (false, "at cannot be empty");

            return (true, null);
        }

        internal static Game FactoryFrom(string seasonId, TeamScalation homeTeam, TeamScalation visitorTeam, DateTime at)
        {
            return new()
            {
                Id = Guid.NewGuid().ToString()[..8],
                SeasonId = seasonId,
                HomeTeamId = homeTeam.Id,
                HomeTeamName = homeTeam.TeamName,
                HomePlayerIds = homeTeam.Players.Select(p => p.PlayerId).ToList(),
                VisitorTeamId = visitorTeam.Id,
                VisitorTeamName = visitorTeam.TeamName,
                VisitorPlayerIds = visitorTeam.Players.Select(p => p.PlayerId).ToList(),
                At = at
            };
        }
    }
}