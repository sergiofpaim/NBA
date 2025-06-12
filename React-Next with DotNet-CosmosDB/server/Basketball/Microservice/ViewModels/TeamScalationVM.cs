using NBA.Infrastructure;
using NBA.Models;

namespace NBA.ViewModels
{
    public class TeamScalationVM : BasketballViewModel
    {
        public string TeamId { get; set; }

        public string TeamName { get; set; }

        public List<PlayerSelection> Players { get; set; } = [];

        public override (bool Success, string Message) Validate()
        {
            return (false, "this viewModel cannot be used for write operations");
        }

        internal static TeamScalationVM FactorFrom(TeamScalation model)
        {
            return new()
            {
                TeamId = model.Id,
                TeamName  = model.TeamName,
                Players = model.Players
            };
        }
    }
}