namespace NBA.Models.ValueObjects
{
    public class GamePlay
    {
        public int Quarter { get; set; }

        public string Type { get; set; }

        public int? Points { get; set; }

        public TimeSpan At { get; set; }

        internal static GamePlay FactoryFrom(int quarter, PlayType? type, DateTime gameAt)
        {
            int points = 0;

            switch (type)
            {
                case PlayType.FreeThrowHit:
                    points = 1;
                    break;
                case PlayType.TwoPointerHit:
                    points = 2;
                    break;
                case PlayType.ThreePointerHit:
                    points = 3;
                    break;
            }

            return new()
            {
                Quarter = quarter,
                Type = type.ToString(),
                Points = points,
                At = TimeSpan.FromMinutes((DateTime.Now - gameAt).TotalMinutes % 15)
            };
        }
    }
}