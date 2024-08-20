using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NBA.Models.CosmosDB
{
    internal class Participation
    {
        public string Id { get; set; }
        public string GameId { get; set; }
        public int PlayerId { get; set; }
        public string PlayerName { get; set; }
        public string TeamName { get; set; }
        public List<GamePlay> Plays { get; set; } = [];
    }
}