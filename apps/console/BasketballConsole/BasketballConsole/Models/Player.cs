namespace NBA.Models
{
    public class Player
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public DateOnly? BornOn { get; set; }

        public string Position { get; set; }

        internal static Player FactoryFrom(Repo.Tables.Player player)
        {
            return new()
            {
                Id = player.Id.ToString(),
                Name = player.Name,
                BornOn = player.BornOn,
                Position = player.Position,
            };
        }
    }
}
