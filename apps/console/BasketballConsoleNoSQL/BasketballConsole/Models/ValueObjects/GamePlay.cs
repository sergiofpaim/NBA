namespace NBA.Models.ValueObjects
{
    public class GamePlay
    {
        public int Quarter { get; set; }

        public string Type { get; set; }

        public int? Points { get; set; }

        public TimeSpan At { get; set; }
    }
}