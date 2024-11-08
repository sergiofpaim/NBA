using NBA.Models;

namespace NBA.ViewModels
{
    public class GameVM
    {
        public string Id { get; set; }

        public string HomeTeamId { get; set; }

        public string HomeTeamName { get; set; }

        public string VisitorTeamId { get; set; }

        public string VisitorTeamName { get; set; }

        public DateTime At { get; set; }

        internal static GameVM FactorFrom(Game model)
        {
            return new()
            {
                Id = model.Id,
                HomeTeamId = model.HomeTeamId,
                HomeTeamName = model.HomeTeamName,
                VisitorTeamId = model.VisitorTeamId,
                VisitorTeamName = model.VisitorTeamName,
                At = model.At
            };
        }
    }
}