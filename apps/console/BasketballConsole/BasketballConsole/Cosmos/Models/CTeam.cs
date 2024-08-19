namespace NBA.SQL.Models;

public partial class CTeam
{
    public string Id { get; set; }

    public string Name { get; set; }

    public string State { get; set; }

    public string City { get; set; }

    public string Stadium { get; set; }

    public string Conference { get; set; }

    public virtual List<CPlayer> Players { get; set; } = [];
}
