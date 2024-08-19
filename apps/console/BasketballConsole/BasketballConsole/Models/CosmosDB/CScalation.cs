namespace NBA.Models.CosmosDB;

public partial class CScalation
{
    public CSeason Season { get; set; }

    public CTeam Team { get; set; }

    public List<CPlayer> Players { get; set; } = [];
}
