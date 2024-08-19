namespace NBA.SQL.Models;

public partial class CSeason
{
    public string Id { get; set; }

    public CTeam Winner { get; set; } = null;

    public virtual List<CTeam> Teams { get; set; } = [];
}
