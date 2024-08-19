namespace NBA.Models.SQL;

public partial class Scalation
{
    public string SeasonId { get; set; }

    public string TeamId { get; set; }

    public virtual ICollection<Game> GameScalationNavigations { get; set; } = [];

    public virtual ICollection<Game> GameScalations { get; set; } = [];

    public virtual Season Season { get; set; }

    public virtual ICollection<Selection> Selections { get; set; } = [];

    public virtual Team Team { get; set; }
}
