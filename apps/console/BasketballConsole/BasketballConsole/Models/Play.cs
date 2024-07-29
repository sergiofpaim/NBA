using System;
using System.Collections.Generic;

namespace NBA.Models;

public partial class Play
{
    public int Id { get; set; }

    public int? ParticipationId { get; set; }

    public string? Type { get; set; }

    public int? Points { get; set; }

    public TimeSpan? At { get; set; }
}
