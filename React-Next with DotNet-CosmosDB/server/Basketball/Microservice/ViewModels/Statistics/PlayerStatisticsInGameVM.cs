using NBA.Infrastructure;

namespace NBA.ViewModels
{
    internal class PlayerStatisticsInGameVM : BasketballViewModel
    {
        public string Type { get; set; }
        public int Count { get; set; }
        public int Points { get; set; }

        public override (bool Success, string Message) Validate()
        {
            return (false, "this viewModel cannot be used for write operations");
        }

        internal static PlayerStatisticsInGameVM FactorFrom(string type, int count, int points)
        {
            return new() { Type = type, Count = count, Points = points };
        }
    }
}