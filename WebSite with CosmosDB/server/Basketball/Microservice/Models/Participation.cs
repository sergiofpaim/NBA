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

        public override (bool Success, string Message) Validate()
        {
            //To be improved with FluentValidation library
            if (Id is null)
                return (false, "id cannot be null");

            if (SeasonId is null)
                return (false, "seasonId cannot be null");

            if (GameId is null)
                return (false, "gameId cannot be null");

            if (TeamId is null)
                return (false, "teamId cannot be null");

            if (TeamName is null)
                return (false, "teamName cannot be null");

            if (PlayerId is null)
                return (false, "playerId cannot be null");

            if (PlayerName is null)
                return (false, "playerName cannot be null");

            foreach (var play in Plays)
            {
                var (Success, Message) = play.Validate();
                if (!Success)
                    return (false, $"play at '{play.At}' is invalid due to '{Message}'");
            }

            return (true, null);
        }

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

        public void TrimPlays(int playsToTake)
        {
            if (Plays.Count > playsToTake)
                Plays.RemoveRange(playsToTake, Plays.Count - playsToTake);
        }
    }
}