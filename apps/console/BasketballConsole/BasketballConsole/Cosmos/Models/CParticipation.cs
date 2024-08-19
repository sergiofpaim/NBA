using NBA.SQL.Models;

namespace NBA.Models;

public partial class CParticipation
{
    public int Id { get; set; }

    public CPlayer Player { get; set; }

    public CGame Game { get; set; }

    public int Quarter { get; set; }

    public int Points { get; set; }
}
