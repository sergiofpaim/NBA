using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NBA.Models.CosmosDB
{
    public class GamePlay
    {
        public int PlayerId { get; set; }
        public int Quarter { get; set; }
        public string Type { get; set; }
        public int? Points { get; set; }
        public TimeSpan At { get; set; }
    }
}