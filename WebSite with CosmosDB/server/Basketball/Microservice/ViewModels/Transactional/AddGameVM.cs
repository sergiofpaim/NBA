using NBA.Infrastructure;

namespace NBA.ViewModels
{
    public class AddGameVM : BasketballViewModel
    {
        public string HomeTeamId { get; set; }
        public string VisitorTeamId { get; set; }
        public DateTime At { get; set; }

        public override (bool Success, string Message) Validate()
        {
            //To be improved with FluentValidation library
            if (HomeTeamId is null)
                return (false, "homeTeamId cannot be null");

            if (VisitorTeamId is null)
                return (false, "visitorTeamId cannot be null");

            if (At == DateTime.MinValue)
                return (false, "at cannot be empty");

            return (true, null);
        }
    }
}
