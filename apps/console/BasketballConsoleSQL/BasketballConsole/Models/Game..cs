using NBA.Repo.Tables;

namespace NBA.Models
{
    public class Game
    {
        public string Id { get; set; }

        public string SeasonId { get; set; }

        public string HomeTeamId { get; set; }

        public string HomeTeamName { get; set; }

        public List<string> HomePlayerIds { get; set; } = [];

        public string VisitorTeamId { get; set; }

        public string VisitorTeamName { get; set; }

        public List<string> VisitorPlayerIds { get; set; } = [];

        public DateTime At { get; set; }

        internal static Game FactoryFrom(Repo.Tables.Game game, Repo.Tables.Team homeTeam, Repo.Tables.Team visitorTeam, List<string> homeTeamPlayerIds, List<string> visitorTeamPlayerIds)
        {
            return new()
            {
                SeasonId = game.SeasonId,
                HomeTeamId = game.HomeTeamId,
                HomeTeamName = homeTeam.Name,
                HomePlayerIds = homeTeamPlayerIds,
                VisitorTeamId = game.VisitorTeamId,
                VisitorTeamName = visitorTeam.Name,
                VisitorPlayerIds = visitorTeamPlayerIds,
                At = game.At
            };
        }
    }
}
