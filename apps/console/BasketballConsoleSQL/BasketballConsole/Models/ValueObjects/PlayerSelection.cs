using NBA.Repo.Tables;

namespace NBA.Models.ValueObjects
{
    public class PlayerSelection
    {
        public string PlayerId { get; set; }

        public string PlayerName { get; set; }

        public int Jersey { get; set; }

        internal static PlayerSelection FactoryFrom(Selection selection, string playerName)
        {
            return new()
            {
               PlayerId = selection.PlayerId.ToString(),
               PlayerName = playerName,
               Jersey = selection.Jersey
            };
        }
    }
}