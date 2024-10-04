using NBA.Repo;

namespace NBA.Models
{
    public class Team : NBAModel
    {
        public string Name { get; set; }

        public string State { get; set; }

        public string City { get; set; }

        public string Stadium { get; set; }

        public string Conference { get; set; }
    }
}