using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NBA.Infrastructure;
using NBA.Services;
using NBA.ViewModels;
using Swashbuckle.Swagger.Annotations;

namespace NBA.Controllers
{
    [ApiController]
    [Route("transaction")]
    public class TransactionController : BasketballController
    {
        private readonly ILogger<TransactionController> _logger;

        public TransactionController(ILogger<TransactionController> logger)
        {
            _logger = logger;
        }

        [HttpGet("seasons")]
        [ProducesResponseType(typeof(List<SeasonVM>), 200)]
        public IActionResult GetSeasons()
        {
            var seasonResult = TransactionService.GetSeasons();

            return Result(seasonResult);
        }

        [HttpGet("seasons/last/games")]
        public IActionResult GetLastSeasonGames()
        {
            var seasonResult = TransactionService.GetLastSeasonGames();

            return Result(seasonResult);
        }

        [HttpGet("seasons/{id}/games")]
        [ProducesResponseType(typeof(List<GameVM>), 200)]
        public IActionResult GetSeasonGames(string id)
        {
            var seasonResult = TransactionService.GetSeasonGames(id);

            return Result(seasonResult);
        }

        [HttpPost("games")]
        public async Task<IActionResult> AddGameAsync([FromBody] AddGameVM request)
        {
            var gameResult = await TransactionService.AddGameAsync(request.HomeTeamId, request.VisitorTeamId, request.At);

            return Result(gameResult);
        }

        [HttpGet("games/{id}/players")]
        [ProducesResponseType(typeof(List<ParticipatingPlayerVM>), 200)]
        public IActionResult GetGamePlayers(string id)
        {
            var seasonResult = TransactionService.GetGamePlayers(id);

            return Result(seasonResult);
        }

        [HttpGet("games/{id}/players/{playerId}/participation")]
        public IActionResult GetParticipation(string id, string playerId)
        {
            var participationResult = TransactionService.GetParticipation(id, playerId);

            return Result(participationResult);
        }

        [HttpPost("plays")]
        public async Task<IActionResult> AddPlayAsync([FromBody] AddPlayVM request)
        {
            const int PLAYS_TO_TAKE = 5;

            var playResult = await TransactionService.AddPlayAsync(request.PlayerId, request.GameId, request.Quarter, request.PlayType, PLAYS_TO_TAKE);

            return Result(playResult);
        }

        [HttpPut("reseed")]
        public IActionResult Reseed()
        {
            var result = TransactionService.Reseed();

            return Result(result);
        }
    }
}