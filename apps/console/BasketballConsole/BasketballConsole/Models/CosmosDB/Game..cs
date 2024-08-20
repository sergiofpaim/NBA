using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NBA.Models.CosmosDB
{
    internal class Player
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime BornOn { get; set; }
        public string Position { get; set; }
    }
}
