namespace NBA.SQL.Models;

public partial class CPlayer
{
    public int Id { get; set; }

    public string Name { get; set; }

    public DateOnly BornOn { get; set; }

    public string Position { get; set; }

    public virtual List<CTeam> Teams { get; set; } = [];
}
