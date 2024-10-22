using NBA.Infrastructure;

namespace NBA.Models
{
    public class Player : BasketballModel
    {
        public string Name { get; set; }

        public DateOnly? BornOn { get; set; }

        public string Position { get; set; }
    }
}