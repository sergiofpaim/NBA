namespace NBA.Models.CosmosDB;

public partial class CGame
{
    public int Id { get; set; }

    public CSeason Season { get; set; }

    public CTeam HomeTeamId { get; set; }

    public CTeam VisitorTeamId { get; set; }

    public DateTime At { get; set; }

    public List<CParticipation> Participations = [];

    public CTeam Winner { get; set; } = null;
}
