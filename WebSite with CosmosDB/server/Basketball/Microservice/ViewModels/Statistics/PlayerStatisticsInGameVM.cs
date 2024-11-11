using NBA.Models;

namespace NBA.ViewModels
{
    internal class PlayerStatisticsInGameVM
    {
        public string Type { get; set; }
        public int Count { get; set; }
        public int Points { get; set; }

        internal static PlayerStatisticsInGameVM FactorFrom(string type, int count, int points)
        {
            return new() { Type = type, Count = count, Points = points };
        }
    }
}