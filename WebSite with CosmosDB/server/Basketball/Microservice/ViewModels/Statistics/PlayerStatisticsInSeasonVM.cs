using NBA.Models;

namespace NBA.ViewModels
{
    internal class PlayerStatisticsInSeasonVM
    {
        public int Participations { get; set; }
        public double PPG { get; set; }
        public double APG { get; set; }
        public double RPG { get; set; }
        public double BPG { get; set; }
        public int TotalPoints { get; set; }
        public double? FTConversion { get; set; }

        internal static PlayerStatisticsInSeasonVM FactorFrom(int participations, List<GamePlay> plays)
        {
            var points = plays.Sum(p => p.Points) ?? 0;
            PlayerStatisticsInSeasonVM stats = new() 
            {
                Participations = participations,
                PPG = points / participations,
                APG = plays.Count(p => p.Type == PlayType.Assist.ToString()) / participations,
                RPG = plays.Count(p => p.Type == PlayType.Rebound.ToString()) / participations,
                BPG = plays.Count(p => p.Type == PlayType.Block.ToString()) / participations,
                TotalPoints = points
            };

            var fth = plays.Count(p => p.Type == PlayType.FreeThrowHit.ToString());
            var ftm = plays.Count(p => p.Type == PlayType.FreeThrowMiss.ToString());
            if (fth > 0 || ftm > 0)
                stats.FTConversion = fth / (fth + ftm);
           
            return stats;
        }
    }
}