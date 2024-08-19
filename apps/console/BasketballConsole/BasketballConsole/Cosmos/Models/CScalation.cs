namespace NBA.SQL.Models;

public partial class CScalation
{
    public CSeason Season { get; set; }

    public CTeam Team { get; set; }

    public virtual List<CPlayer> Players { get; set; } = [];
}
