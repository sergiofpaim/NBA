using NBA.Models.SQL;

namespace NBA.ViewModels;

public class PlayVM
{
    public int Id { get; set; }

    public int? ParticipationId { get; set; }

    public string Type { get; set; }

    public int? Points { get; set; }

    public TimeSpan? At { get; set; }

    //Cosmos

    public int IdCosmos { get; set; }

    public int Quarter { get; set; }
}
