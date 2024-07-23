using System;
using System.Collections.Generic;

namespace NBA.Models;

public partial class Scalation
{
    public string SeasonId { get; set; } = null!;

    public string TeamId { get; set; } = null!;

    public virtual ICollection<Game> GameScalationNavigations { get; set; } = new List<Game>();

    public virtual ICollection<Game> GameScalations { get; set; } = new List<Game>();

    public virtual Season Season { get; set; } = null!;

    public virtual ICollection<Selection> Selections { get; set; } = new List<Selection>();

    public virtual Team Team { get; set; } = null!;
}
