namespace NBA.Models.CosmosDB;

public partial class CSeason
{
    public string Id { get; set; }

    public CTeam Winner { get; set; } = null;

    public List<CTeam> Teams { get; set; } = [];
}
