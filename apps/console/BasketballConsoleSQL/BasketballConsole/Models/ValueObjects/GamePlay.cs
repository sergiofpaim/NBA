using NBA.Repo.Tables;

namespace NBA.Models.ValueObjects
{
    public class GamePlay
    {
        public int Quarter { get; set; }

        public string Type { get; set; }

        public int? Points { get; set; }

        public TimeSpan At { get; set; }

        internal static GamePlay FactorFrom(Play playTable, int quarter)
        {
            return new()
            {
                Quarter = quarter,
                Type = playTable.Type,
                Points = playTable.Points,
                At = playTable.At.Value
            };
        }
    }
}