using System;
using System.Collections.Generic;

namespace NBA.Models;

public partial class Selection
{
    public int Id { get; set; }

    public int? PlayerId { get; set; }

    public string? SeasonId { get; set; }

    public string? TeamId { get; set; }

    public int? Jersey { get; set; }

    public virtual ICollection<Participation> Participations { get; set; } = new List<Participation>();

    public virtual Player? Player { get; set; }

    public virtual Scalation? Scalation { get; set; }
}
