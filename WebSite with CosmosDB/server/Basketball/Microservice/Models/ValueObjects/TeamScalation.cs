using NBA.Infrastructure;

namespace NBA.Models
{
    public class TeamScalation : BasketballValueObject
    {
        public string Id { get; set; }

        public string TeamName { get; set; }

        public List<PlayerSelection> Players { get; set; } = [];

        public override (bool Success, string Message) Validate()
        {
            //To be improved with FluentValidation library
            if (Id is null)
                return (false, "id cannot be null");

            if (TeamName is null)
                return (false, "teamName cannot be null");

            if (Players is null)
                return (false, "players cannot be null");

            foreach (var player in Players)
            {
                var (Success, Message) = player.Validate();
                if (!Success)
                    return (false, $"player of id '{player.PlayerId}' is invalid due to '{Message}'");
            }

            return (true, null);
        }
    }
}