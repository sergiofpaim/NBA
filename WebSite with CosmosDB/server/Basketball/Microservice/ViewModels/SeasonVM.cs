using NBA.Models;

namespace NBA.ViewModels
{
    internal class SeasonVM
    {
        public string Id { get; set; }

        internal static SeasonVM FactorFrom(Season model)
        {
            return new() { Id = model.Id};
        }
    }
}