using NBA.Infrastructure;

namespace NBA.Models
{
    public class Season : BasketballModel
    {
        public List<TeamScalation> Teams { get; set; } = [];
    }
}