using NBA.Infrastructure;
using NBA.Models;
using NBA.Models.ValueObjects;

namespace NBA.Services
{
    internal class NBAService : BasketballService
    {
        public static BasketballResponse<object> AddGame(string homeTeamId, string visitorTeamId, DateTime at)
        {
            var lastSeason = Basketball.Repo.GetLastSeason();
            if (lastSeason is null)
                return Error<object>("There is no season registered yet.");

            var homeTeam = lastSeason.Teams.FirstOrDefault(t => t.TeamId == homeTeamId);
            if (homeTeam is null)
                return NotFound<object>("Home team not found");

            var visitorTeam = lastSeason.Teams.FirstOrDefault(t => t.TeamId == visitorTeamId);
            if (visitorTeam is null)
                return NotFound<object>("Visitor team not found");

            var game = Game.FactoryFrom(lastSeason.Id, homeTeam, visitorTeam, at);

            bool success = Basketball.Repo.CreateGame(game).Result;

            if (!success)
                return Error<object>("Failed to add the game to the database.");

            return Success<object>(default, $"Game added to the database with Id: {game.Id}");
        }

        public static BasketballResponse<Participation> AddPlay(string playerId, Game game, int quarter, bool isHomePlayer, PlayType type, int playsToTake)
        {
            var newPlay = GamePlay.FactoryFrom(quarter, type, game.At);

            var player = Basketball.Repo.GetById<Player>(playerId);

            if (player is null)
                return NotFound<Participation>("Player not found");

            var participation = Basketball.Repo.Get<Participation>(p => p.GameId == game.Id && p.PlayerId == playerId);

            if (participation == null)
                participation = Participation.FactoryFrom(game,
                                                          player,
                                                          isHomePlayer
                                                              ? game.HomeTeamName
                                                              : game.VisitorTeamName, newPlay);
            else
                participation.RegisterPlay(newPlay);

            bool success = Basketball.Repo.Update(participation);

            //Only cuts the participation after updating the database
            if (participation.Plays.Count > playsToTake)
                participation.Plays.RemoveRange(playsToTake, participation.Plays.Count - playsToTake);

            if (!success)
                return Error<Participation>("Failed to add the play to the database.");

            else

                return Success(participation, "Play added to the database.");
        }

        internal static BasketballResponse<Game> CheckGameForPlayer(string gameId, string playerId)
        {
            var game = Basketball.Repo.GetById<Game>(gameId);

            if (game is null)
                return NotFound<Game>("Game not found");

            return Success(game, "Game not found");
        }

        internal static BasketballResponse<Participation> GetParticipation(string gameId, string playerId)
        {
            var participation = Basketball.Repo.Get<Participation>(p => p.GameId == gameId && p.PlayerId == playerId);
            if (participation is null)
                return NotFound<Participation>("Player does not participate in the game");
            else
                return Success(participation);
        }

        internal static BasketballResponse<Player> GetPlayer(string playerId)
        {
            var player = Basketball.Repo.GetById<Player>(playerId);

            if (player == null)
                return NotFound<Player>("Player not found");
            else
                return Success(player);
        }

        internal static BasketballResponse<bool> PartOfHomeTeam(BasketballResponse<Game> gameResult, string playerId)
        {
            bool isHomePlayer;
            if (gameResult.PayLoad.HomePlayerIds.Contains(playerId))
                isHomePlayer = true;
            else if (gameResult.PayLoad.VisitorPlayerIds.Contains(playerId))
                isHomePlayer = false;
            else
                return Error<bool>("Player does not participate in the team for the season.");

            return Success(isHomePlayer);
        }

        internal static BasketballResponse<object> Reseed()
        {
            Basketball.Repo.Reseed();
            return Success<object>(null, "Reseed completed");
        }
    }
}