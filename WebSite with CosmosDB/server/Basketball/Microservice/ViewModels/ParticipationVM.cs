using NBA.Infrastructure;
using NBA.Models;

namespace NBA.ViewModels
{
    public class ParticipationVM : BasketballViewModel
    {
        public string GameId { get; set; }

        public string PlayerId { get; set; }

        public List<GamePlay> Plays { get; set; } = [];

        public override (bool Success, string Message) Validate()
        {
            return (false, "this viewModel cannot be used for write operations");
        }

        internal static ParticipationVM FactorFrom(Participation model)
        {
            return new()
            {
                PlayerId = model.PlayerId,
                GameId = model.GameId,
                Plays = model.Plays
            };
        }
    }
}