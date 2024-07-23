using System;
using System.Collections.Generic;

namespace NBA.Models;

public partial class Season
{
    public string Id { get; set; } = null!;

    public virtual ICollection<Scalation> Scalations { get; set; } = new List<Scalation>();
}
