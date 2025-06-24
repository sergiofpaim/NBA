using NBA.Infrastructure;

namespace NBA.Models
{
    public class Player : BasketballModel
    {
        public string Name { get; set; }

        public DateOnly BornOn { get; set; }

        public string Position { get; set; }

        public override (bool Success, string Message) Validate()
        {
            //To be improved with FluentValidation library
            if (Id is null)
                return (false, "id cannot be null");

            if (Name is null)
                return (false, "name cannot be null");

            if (BornOn == DateOnly.MinValue)
                return (false, "bornOn cannot be empty");

            if (Position is null)
                return (false, "position cannot be null");

            return (true, null);
        }
    }
}