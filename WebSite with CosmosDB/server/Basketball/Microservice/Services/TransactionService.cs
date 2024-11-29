using NBA.Infrastructure;
using NBA.Models;
using NBA.ViewModels;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace NBA.Services
{
    internal class TransactionService : BasketballService
    {
        public static async Task<BasketballResponse<Game>> AddGameAsync(string homeTeamId, string visitorTeamId, DateTime at)
        {
            var lastSeason = Basketball.Repo.Get<Season>(season => true, season => season.Id, true, 1).FirstOrDefault();
            if (lastSeason is null)
                return Error<Game>("There is no season registered yet.");

            var homeTeam = lastSeason.Teams.FirstOrDefault(t => t.Id == homeTeamId);
            if (homeTeam is null)
                return NotFound<Game>("Home team not found.");

            var visitorTeam = lastSeason.Teams.FirstOrDefault(t => t.Id == visitorTeamId);
            if (visitorTeam is null)
                return NotFound<Game>("Visitor team not found.");

            var game = Game.FactoryFrom(lastSeason.Id, homeTeam, visitorTeam, at);

            var saved = await Basketball.Repo.CreateAsync(game);

            if (saved is null)
                return Error<Game>("Failed to add the game to the database.");

            return Success(game, $"Game added to the database with Id: {game.Id}");
        }

        public static async Task<BasketballResponse<Participation>> AddPlayAsync(string playerId, string gameId, int quarter, PlayType type, int playsToTake)
        {
            var game = Basketball.Repo.GetById<Game>(gameId);
            if (game is null)
                return NotFound<Participation>("Game not found.");

            var isHomePlayer = IsPartOfHomeTeam(game, playerId);
            if (isHomePlayer is null)
                return NotFound<Participation>("Player does not participate in the game.");

            var player = Basketball.Repo.GetById<Player>(playerId);
            if (player is null)
                return NotFound<Participation>("Player not found.");

            var participation = Basketball.Repo.Get<Participation>(p => p.GameId == game.Id && p.PlayerId == playerId).FirstOrDefault();

            var newPlay = GamePlay.FactoryFrom(quarter, type, game.At);

            Participation saved = default;
            if (participation is null)
            {
                if (isHomePlayer.Value)
                    participation = Participation.FactoryFrom(game,
                                                              player,
                                                              game.HomeTeamName,
                                                              game.HomeTeamId,
                                                              newPlay);
                else
                    participation = Participation.FactoryFrom(game,
                                                              player,
                                                              game.VisitorTeamName,
                                                              game.VisitorTeamId,
                                                              newPlay);

                saved = await Basketball.Repo.CreateAsync(participation);
            }
            else
            {
                participation.RegisterPlay(newPlay);
                saved = await Basketball.Repo.UpdateAsync(participation);
            }

            //Only cuts the participation after updating the database
            if (participation.Plays.Count > playsToTake)
                participation.Plays.RemoveRange(playsToTake, participation.Plays.Count - playsToTake);

            if (saved is null)
                return Error<Participation>("Failed to add the play to the database.");

            else

                return Success(participation, "Play added to the database.");
        }

        internal static BasketballResponse<Participation> GetParticipation(string gameId, string playerId)
        {
            var participation = Basketball.Repo.Get<Participation>(p => p.GameId == gameId && p.PlayerId == playerId).FirstOrDefault();
            if (participation is null)
                return NotFound<Participation>("Player does not participate in the game.");
            else
                return Success(participation);
        }

        internal static BasketballResponse<Player> GetPlayer(string playerId)
        {
            var player = Basketball.Repo.GetById<Player>(playerId);

            if (player is null)
                return NotFound<Player>("Player not found.");
            else
                return Success(player);
        }

        internal static BasketballResponse<Game> GetGame(string gameId)
        {
            var game = Basketball.Repo.GetById<Game>(gameId);

            if (game is null)
                return NotFound<Game>("Game not found.");
            else
                return Success(game);
        }

        private static bool? IsPartOfHomeTeam(Game gameResult, string playerId)
        {
            bool? isHomePlayer = null;
            if (gameResult.HomePlayerIds.Contains(playerId))
                isHomePlayer = true;
            else if (gameResult.VisitorPlayerIds.Contains(playerId))
                isHomePlayer = false;

            return isHomePlayer;
        }

        internal static BasketballResponse<object> Reseed()
        {
            Basketball.Repo.ReseedAsync();
            return Success<object>(null, "Reseed completed.");
        }

        internal static BasketballResponse<List<SeasonVM>> GetSeasons()
        {
           var seasons = Basketball.Repo.Get<Season>(s => true);
           return Success(seasons.OrderByDescending(s => s.Id).Select(SeasonVM.FactorFrom).ToList());
        }

        internal static BasketballResponse<List<GameVM>> GetSeasonGames(string seasonId)
        {
            var games = Basketball.Repo.Get<Game>(g => g.SeasonId == seasonId);
            return Success(games.OrderByDescending(g => g.At).Select(GameVM.FactorFrom).ToList());
        }

        internal static BasketballResponse<List<GameVM>> GetLastSeasonGames()
        {
            var season = Basketball.Repo.Get<Season>(season => true, season => season.Id, true, 1).FirstOrDefault();
            return GetSeasonGames(season.Id);
        }

        internal static BasketballResponse<List<ParticipatingPlayerVM>> GetGamePlayers(string gameId)
        {
            var participations = Basketball.Repo.Get<Participation>(p => p.GameId == gameId);
            return Success(participations.OrderBy(p => p.PlayerName).Select(ParticipatingPlayerVM.FactorFrom).ToList());
        }
    }
}