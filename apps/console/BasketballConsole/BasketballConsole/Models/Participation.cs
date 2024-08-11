namespace NBA.Models;

public partial class Participation
{
    public int Id { get; set; }

    public int SelectionId { get; set; }

    public int GameId { get; set; }

    public int Quarter { get; set; }

    public int? Points { get; set; }

    public virtual Game Game { get; set; } = null!;

    public virtual Selection Selection { get; set; } = null!;
}
