using NBA.Infrastructure;
using NBA.Models;

namespace NBA.ViewModels
{
    public class ParticipatingPlayerVM : BasketballViewModel
    {
        public string PlayerId { get; set; }
        public string PlayerName { get; set; }
        public string ParticipationId { get; set; }
        public string TeamId { get; set; }
        public string TeamName { get; set; }
        public List<GamePlay> Plays { get; set; } = [];

        public override (bool Success, string Message) Validate()
        {
            return (false, "this viewModel cannot be used for write operations");
        }

        internal static ParticipatingPlayerVM FactorFrom(Participation model)
        {
            return new()
            {
                PlayerId = model.PlayerId,
                PlayerName = model.PlayerName,
                ParticipationId = model.Id,
                TeamId = model.TeamId,
                TeamName = model.TeamName,
                Plays = model.Plays
            };
        }
    }
}