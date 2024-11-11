using NBA.Infrastructure;
using NBA.Models;
using NBA.ViewModels;

namespace NBA.Services
{
    internal class StatisticsService : BasketballService
    {
        internal static BasketballResponse<List<PlayerStatisticsInGameVM>> GetPlayerInGame(string gameId, string playerId)
        {
            var participation = Basketball.Repo.Get<Participation>(p => p.GameId == gameId && p.PlayerId == playerId).FirstOrDefault();

            if (participation is null)
                return NotFound<List<PlayerStatisticsInGameVM>>("Player does not participate in the game.");

            return Success(participation.Plays
                                        .GroupBy(p => p.Type)
                                        .Select(g => PlayerStatisticsInGameVM.FactorFrom(g.Key, g.Count(), g.Sum(gp => gp.Points) ?? 0))
                                        .OrderBy(s => s.Type)
                                        .ToList());
        }

        internal static BasketballResponse<object> GetPlayerInSeason(string gameId, string playerId)
        {
            throw new NotImplementedException();
        }
    }
}