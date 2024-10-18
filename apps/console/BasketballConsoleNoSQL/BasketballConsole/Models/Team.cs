using NBA.Infrastructure;

namespace NBA.Models
{
    public class Team : BasketballModel
    {
        public string Name { get; set; }

        public string State { get; set; }

        public string City { get; set; }

        public string Stadium { get; set; }

        public string Conference { get; set; }
    }
}