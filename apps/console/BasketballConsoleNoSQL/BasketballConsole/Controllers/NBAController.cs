using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NBA.Infrastructure;
using NBA.Services;
using NBA.ViewModels;

namespace NBA.Controllers
{
    [ApiController]
    [Route("nba")]
    public class NBAController : BasketballController
    {
        private readonly ILogger<NBAController> _logger;

        public NBAController(ILogger<NBAController> logger)
        {
            _logger = logger;
        }

        [HttpPost("add/play")]
        public IActionResult AddPlay([FromBody] AddPlayVM request)
        {
            const int PLAYS_TO_TAKE = 5;
            var gameResult = NBAService.CheckGameForPlayer(request.GameId, request.PlayerId);

            var isHomePlayer = NBAService.PartOfHomeTeam(gameResult, request.PlayerId);

            var playResult = NBAService.AddPlay(request.PlayerId, gameResult.PayLoad, request.Quarter, isHomePlayer.PayLoad, request.PlayType, PLAYS_TO_TAKE);

            return Result(playResult);
        }

        [HttpPost("add/game")]
        public IActionResult AddGame([FromBody] AddGameVM request)
        {
            var gameResult = NBAService.AddGame(request.HomeTeamId, request.VisitorTeamId, request.At);

            return Result(gameResult);
        }

        [HttpGet("list/play")]
        public IActionResult ListPlay(string gameId, string playerId)
        {
            var participationResult = NBAService.GetParticipation(gameId, playerId);

            return Result(participationResult);
        }


        [HttpPut("reseed")]
        public IActionResult Reseed()
        {
            var result = NBAService.Reseed();

            return Result(result);
        }
    }
}