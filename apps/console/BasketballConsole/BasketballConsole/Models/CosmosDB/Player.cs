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
