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
        public async Task<IActionResult> AddPlayAsync([FromBody] AddPlayVM request)
        {
            const int PLAYS_TO_TAKE = 5;

            var playResult = await NBAService.AddPlayAsync(request.PlayerId, request.GameId, request.Quarter, request.PlayType, PLAYS_TO_TAKE);

            return Result(playResult);
        }

        [HttpPost("add/game")]
        public async Task<IActionResult> AddGameAsync([FromBody] AddGameVM request)
        {
            var gameResult = await NBAService.AddGameAsync(request.HomeTeamId, request.VisitorTeamId, request.At);

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