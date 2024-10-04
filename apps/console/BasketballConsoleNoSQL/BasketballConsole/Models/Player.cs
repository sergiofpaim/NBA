using NBA.Repo;

namespace NBA.Models
{
    public class Player : NBAModel
    {
        public string Name { get; set; }

        public DateOnly? BornOn { get; set; }

        public string Position { get; set; }
    }
}