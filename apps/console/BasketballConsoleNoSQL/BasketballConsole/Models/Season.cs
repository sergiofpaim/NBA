using NBA.Models.ValueObjects;
using NBA.Repo;

namespace NBA.Models
{
    public class Season : NBAModel
    {
        public List<TeamScalation> Teams { get; set; } = [];
    }
}