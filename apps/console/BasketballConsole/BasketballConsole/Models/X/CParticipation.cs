using NBA.Models.Type;

namespace NBA.Models.CosmosDB;

public partial class CParticipation
{
    public int Id { get; set; }

    public int PlayerId { get; set; }

    public int GameId { get; set; }

    public int Quarter { get; set; }

    public int MinutesPlayed { get; set; }

    public int Points { get; set; }

    public List<PlayType> PlayType { get; set; }
}
