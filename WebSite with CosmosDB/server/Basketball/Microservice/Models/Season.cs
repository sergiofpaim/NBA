﻿using NBA.Infrastructure;
using NBA.Models.ValueObjects;

namespace NBA.Models
{
    public class Season : BasketballModel
    {
        public List<TeamScalation> Teams { get; set; } = [];
    }
}