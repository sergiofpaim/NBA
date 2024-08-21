using NBA.ViewModels;

namespace NBA.Models.SQL;

public partial class Play
{
    public int Id { get; set; }

    public int? ParticipationId { get; set; }

    public string Type { get; set; }

    public int? Points { get; set; }

    public TimeSpan? At { get; set; }

    public void MapTo(PlayVM p)
    {
        p.ParticipationId = ParticipationId;
        p.Type = Type;
        p.Points = Points;
        p.At = At;
    }

    public static PlayVM FactoryFrom(Play p)
    {
        return new()
        {
            ParticipationId = p.ParticipationId,
            Type = p.Type,
            Points = p.Points,
            At = p.At
        };
    }
}
