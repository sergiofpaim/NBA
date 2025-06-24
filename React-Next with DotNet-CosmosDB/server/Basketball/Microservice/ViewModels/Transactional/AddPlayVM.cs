using NBA.Infrastructure;
using NBA.Models;

namespace NBA.ViewModels
{
    public class AddPlayVM : BasketballViewModel
    {
        public string GameId { get; set; }
        public string PlayerId { get; set; }
        public int Quarter { get; set; }
        public string Type { get; set; }

        public override (bool Success, string Message) Validate()
        {
            //To be improved with FluentValidation library
            if (GameId is null)
                return (false, "gameId cannot be null");

            if (PlayerId is null)
                return (false, "playerId cannot be null");

            if (Quarter <= 0)
                return (false, "quarter should be positive");

            if (Type is null || !Enum.TryParse<PlayType>(Type, out _))
                return (false, "type is invalid");

            return (true, null);
        }
    }
}