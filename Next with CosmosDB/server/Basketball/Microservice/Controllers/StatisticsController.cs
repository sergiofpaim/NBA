using Microsoft.AspNetCore.Mvc;
using NBA.Infrastructure;
using NBA.Services;
using NBA.ViewModels;

namespace NBA.Controllers
{
    [ApiController]
    [Route("statistics")]
    public class StatisticsController : BasketballController
    {
        [HttpGet("seasons/{seasonId}/players/{playerId}")]
        [ProducesResponseType(typeof(BasketballResponse<PlayerStatisticsInSeasonVM>), 200)]
        public IActionResult GetPlayerInSeason(string seasonId, string playerId)
        {
            var participationResult = StatisticsService.GetPlayerInSeason(seasonId, playerId);

            return Result(participationResult);
        }

        [HttpGet("games/{gameId}/players/{playerId}")]
        [ProducesResponseType(typeof(BasketballResponse<List<PlayerStatisticsInGameVM>>), 200)]
        public IActionResult GetPlayerInGame(string gameId, string playerId)
        {
            var participationResult = StatisticsService.GetPlayerInGame(gameId, playerId);

            return Result(participationResult);
        }
    }
}