using NBA.Models.Type;

namespace NBA.Models.CosmosDB;

public partial class CParticipation
{
    public int Id { get; set; }

    public CPlayer Player { get; set; }

    public CGame Game { get; set; }

    public int Quarter { get; set; }

    public int Points { get; set; }

    public List<PlayType> Plays { get; set; } = [];
}
