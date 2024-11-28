using Microsoft.Azure.Cosmos.Spatial;
using NBA.Infrastructure;

namespace NBA.Models
{
    public class Season : BasketballModel
    {
        public List<TeamScalation> Teams { get; set; } = [];

        public override (bool Success, string Message) Validate()
        {
            //To be improved with FluentValidation library
            if (Id is null)
                return (false, "id cannot be null");

            if (Teams is null)
                return (false, "teams cannot be null");

            foreach (var team in Teams)
            {
                var (Success, Message) = team.Validate();
                if (!Success)
                    return (false, $"team of id '{team.Id}' is invalid due to '{Message}'");
            }

            return (true, null);
        }
    }
}