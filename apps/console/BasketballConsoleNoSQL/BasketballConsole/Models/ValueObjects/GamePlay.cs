﻿namespace NBA.Models.ValueObjects
{
    public class GamePlay
    {
        public int Quarter { get; set; }

        public string Type { get; set; }

        public int? Points { get; set; }

        public TimeSpan At { get; set; }

        internal static GamePlay FactoryFrom(int quarter, PlayType? type, int points, TimeSpan time)
        {
            return new()
            {
                Quarter = quarter,
                Type = type.ToString(),
                Points = points,
                At = time
            };
        }
    }
}