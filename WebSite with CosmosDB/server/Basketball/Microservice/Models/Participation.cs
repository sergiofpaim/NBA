using NBA.Infrastructure;

namespace NBA.Models
{
    public class Participation : BasketballModel
    {
        public string SeasonId { get; set; }

        public string GameId { get; set; }

        public string TeamId { get; set; }

        public string TeamName { get; set; }

        public string PlayerId { get; set; }

        public string PlayerName { get; set; }

        public List<GamePlay> Plays { get; set; } = [];

        internal static Participation FactoryFrom(Game game, Player player, string teamName, string teamId, GamePlay gamePlay)
        {
            return new()
            {
                Id = Guid.NewGuid().ToString()[..8],
                SeasonId = game.SeasonId,
                GameId = game.Id,
                TeamId = teamId,
                TeamName = teamName,
                PlayerId = player.Id,
                PlayerName = player.Name,
                Plays = [gamePlay]
            };
        }

        internal void RegisterPlay(GamePlay newPlay)
        {
            Plays.Insert(0, newPlay);
        }
    }
}