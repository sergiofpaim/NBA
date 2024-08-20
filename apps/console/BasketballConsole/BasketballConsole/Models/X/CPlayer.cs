namespace NBA.Models.CosmosDB;

public partial class CPlayer
{
    public int Id { get; set; }

    public string Name { get; set; }

    public DateOnly BornOn { get; set; }

    public string Position { get; set; }

    public virtual List<CParticipation> Participations { get; set; } = [];
}
