using NBA.Infrastructure;

namespace NBA.Models
{
    public class PlayerSelection : BasketballValueObject
    {
        public string PlayerId { get; set; }

        public string PlayerName { get; set; }

        public int Jersey { get; set; }

        public override (bool Success, string Message) Validate()
        {
            //To be improved with FluentValidation library
            if (PlayerId is null)
                return (false, "playerId cannot be null");

            if (PlayerName is null)
                return (false, "playerName cannot be null");

            if (Jersey < 0 || Jersey >= 100)
                return (false, "jersey should be between 0 and 100");

            return (true, null);
        }
    }
}