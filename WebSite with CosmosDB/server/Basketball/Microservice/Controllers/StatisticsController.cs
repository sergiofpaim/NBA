using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NBA.Infrastructure;
using NBA.Models;
using NBA.Services;

namespace NBA.Controllers
{
    [ApiController]
    [Route("statistics")]
    public class StatisticsController : BasketballController
    {
        private readonly ILogger<StatisticsController> _logger;

        public StatisticsController(ILogger<StatisticsController> logger)
        {
            _logger = logger;
        }

        [HttpGet("seasons/{id}/players/{playerId}")]
        public IActionResult GetPlayerInSeason(string id, string playerId)
        {
            var participationResult = StatisticsService.GetPlayerInSeason(id, playerId);

            return Result(participationResult);
        }

        [HttpGet("games/{id}/players/{playerId}")]
        public IActionResult GetPlayerInGame(string id, string playerId)
        {
            var participationResult = StatisticsService.GetPlayerInGame(id, playerId);

            return Result(participationResult);
        }
    }
}