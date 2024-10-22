namespace NBA.Repo.Tables;

public partial class Scalation
{
    public string SeasonId { get; set; } = null!;

    public string TeamId { get; set; } = null!;

    public virtual ICollection<Game> GameScalationNavigations { get; set; } = [];

    public virtual ICollection<Game> GameScalations { get; set; } = [];

    public virtual Season Season { get; set; } = null!;

    public virtual ICollection<Selection> Selections { get; set; } = [];

    public virtual Team Team { get; set; } = null!;
}
