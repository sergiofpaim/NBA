using NBA.Infrastructure;
using NBA.Models;
using NBA.ViewModels;

namespace NBA.Services
{
    internal class TransactionService : BasketballService
    {
        public static async Task<BasketballResponse<GameVM>> AddGameAsync(string homeTeamId, string visitorTeamId, DateTime at)
        {
            var lastSeason = Basketball.Repo.Get<Season>(season => true, season => season.Id, true, 1).FirstOrDefault();
            if (lastSeason is null)
                return Error<GameVM>("There is no season registered yet.");

            var homeTeam = lastSeason.Teams.FirstOrDefault(t => t.Id == homeTeamId);
            if (homeTeam is null)
                return NotFound<GameVM>("Home team not found.");

            var visitorTeam = lastSeason.Teams.FirstOrDefault(t => t.Id == visitorTeamId);
            if (visitorTeam is null)
                return NotFound<GameVM>("Visitor team not found.");

            var game = Game.FactoryFrom(lastSeason.Id, homeTeam, visitorTeam, at);

            var saved = await Basketball.Repo.CreateAsync(game);

            if (saved is null)
                return Error<GameVM>("Failed to add the game to the database.");

            return Success(GameVM.FactorFrom(game), $"Game added to the database with Id: {GameVM.FactorFrom(game).Id}");
        }

        public static async Task<BasketballResponse<ParticipationVM>> AddPlayAsync(string playerId, string gameId, int quarter, PlayType type, int playsToTake)
        {
            var game = Basketball.Repo.GetById<Game>(gameId);
            if (game is null)
                return NotFound<ParticipationVM>("Game not found.");

            var isHomePlayer = IsPartOfHomeTeam(game, playerId);
            if (isHomePlayer is null)
                return NotFound<ParticipationVM>("Player does not participate in the game.");

            var player = Basketball.Repo.GetById<Player>(playerId);
            if (player is null)
                return NotFound<ParticipationVM>("Player not found.");

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

            participation.TrimPlays(playsToTake);

            if (saved is null)
                return Error<ParticipationVM>("Failed to add the play to the database.");

            else
                return Success(ParticipationVM.FactorFrom(participation), "Play added to the database.");
        }

        internal static async Task<BasketballResponse<ParticipationVM>> DeletePlayAsync(string participationId, TimeSpan at, int playsToTake)
        {
            var toUpdate = Basketball.Repo.GetById<Participation>(participationId);

            if (toUpdate is null)
                return NotFound<ParticipationVM>("Participation not found.");

            var toRemove = toUpdate.Plays.FirstOrDefault(p => p.At == at);

            if (toRemove is null)
                return NotFound<ParticipationVM>("Play not found.");

            toUpdate.Plays.Remove(toRemove);

            var saved = await Basketball.Repo.UpdateAsync(toUpdate);

            saved.TrimPlays(playsToTake);

            if (saved is null)
                return Error<ParticipationVM>("Failed to remove the play from the database.");
            else
                return Success(ParticipationVM.FactorFrom(saved), "Play removed from the database.");
        }

        internal static BasketballResponse<ParticipationVM> GetParticipation(string gameId, string playerId, int playsToTake)
        {
            var participation = Basketball.Repo.Get<Participation>(p => p.GameId == gameId && p.PlayerId == playerId).FirstOrDefault();
            if (participation is null)
                return NotFound<ParticipationVM>("Player does not participate in the game.");
            else
            {
                participation.TrimPlays(playsToTake);
                return Success(ParticipationVM.FactorFrom(participation));
            }
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

        internal static BasketballResponse<List<ParticipatingPlayerVM>> GetParticipatingPlayers(string gameId)
        {
            var participations = Basketball.Repo.Get<Participation>(p => p.GameId == gameId);
            return Success(participations.OrderBy(p => p.PlayerName).Select(ParticipatingPlayerVM.FactorFrom).ToList());
        }

        internal static BasketballResponse<List<TeamScalationVM>> GetSeasonTeams(string seasonId)
        {
            var season = Basketball.Repo.GetById<Season>(seasonId);
            return Success(season.Teams.Select(TeamScalationVM.FactorFrom).ToList());
        }

        internal static BasketballResponse<List<TeamScalationVM>> GetLastSeasonTeams()
        {
            var season = Basketball.Repo.Get<Season>(season => true, season => season.Id, true, 1).FirstOrDefault();
            return GetSeasonTeams(season.Id);
        }
    }
}