using NBA.Infrastructure;
using Newtonsoft.Json;

namespace NBA.Models
{
    public class GamePlay : BasketballValueObject
    {
        public int Quarter { get; set; }

        public string Type { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? Points { get; set; }

        public TimeSpan At { get; set; }

        public override (bool Success, string Message) Validate()
        {
            //To be improved with FluentValidation library
            if (Quarter <= 0)
                return (false, "quarter should be positive");

            if (Type is null || !Enum.TryParse<PlayType>(Type, out _))
                return (false, "type is invalid");

            var type = Enum.Parse<PlayType>(Type);

            switch (type)
            {
                case PlayType.FreeThrowHit:
                    if (Points != 1)
                        return (false, "points should be 1 for a FreeThrowHit");
                    break;
                case PlayType.TwoPointerHit:
                    if (Points != 2)
                        return (false, "points should be 2 for a TwoPointerHit");
                    break;
                case PlayType.ThreePointerHit:
                    if (Points != 3)
                        return (false, "points should be 3 for a ThreePointerHit");
                    break;
                default:
                    if (Points is not null)
                        return (false, "points should be null");
                    break;
            }

            if (At < TimeSpan.Zero || At > TimeSpan.FromMinutes(15))
                return (false, "at should be between 0 and 15 minutes");

            return (true, null);
        }

        internal static GamePlay FactoryFrom(int quarter, PlayType? type, DateTime gameAt)
        {
            int? points = null;

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
                At = TimeSpan.FromMinutes((DateTime.UtcNow - gameAt).TotalMinutes % 15)
            };
        }
    }
}