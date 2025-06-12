using Microsoft.Azure.Cosmos.Spatial;
using NBA.Infrastructure;

namespace NBA.Models
{
    public class Team : BasketballModel
    {
        public string Name { get; set; }

        public string State { get; set; }

        public string City { get; set; }

        public string Stadium { get; set; }

        public string Conference { get; set; }

        public override (bool Success, string Message) Validate()
        {
            //To be improved with FluentValidation library
            if (Id is null)
                return (false, "id cannot be null");

            if (Name is null)
                return (false, "name cannot be null");

            if (State is null)
                return (false, "state cannot be null");

            if (City is null)
                return (false, "city cannot be null");

            if (Stadium is null)
                return (false, "stadium cannot be null");

            if (Conference is null)
                return (false, "conference cannot be null");

            return (true, null);
        }
    }
}