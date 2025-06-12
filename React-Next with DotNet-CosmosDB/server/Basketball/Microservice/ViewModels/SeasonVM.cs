using NBA.Infrastructure;
using NBA.Models;

namespace NBA.ViewModels
{
    internal class SeasonVM : BasketballViewModel
    {
        public string Id { get; set; }

        public override (bool Success, string Message) Validate()
        {
            return (false, "this viewModel cannot be used for write operations");
        }

        internal static SeasonVM FactorFrom(Season model)
        {
            return new() { Id = model.Id};
        }
    }
}