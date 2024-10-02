namespace NBA.Models
{
    public class Player
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public DateOnly? BornOn { get; set; }

        public string Position { get; set; }
    }
}
