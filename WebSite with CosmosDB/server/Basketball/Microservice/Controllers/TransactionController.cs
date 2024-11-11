using Microsoft.AspNetCore.Mvc;
using NBA.Infrastructure;
using NBA.Models;
using NBA.Services;
using NBA.ViewModels;

namespace NBA.Controllers
{
    [ApiController]
    [Route("transaction")]
    public class TransactionController : BasketballController
    {
        [HttpGet("seasons")]
        [ProducesResponseType(typeof(List<SeasonVM>), 200)]
        public IActionResult GetSeasons()
        {
            var seasonResult = TransactionService.GetSeasons();

            return Result(seasonResult);
        }

        [HttpGet("seasons/last/games")]
        [ProducesResponseType(typeof(List<GameVM>), 200)]
        public IActionResult GetLastSeasonGames()
        {
            var seasonResult = TransactionService.GetLastSeasonGames();

            return Result(seasonResult);
        }

        [HttpGet("seasons/{seasonId}/games")]
        [ProducesResponseType(typeof(List<GameVM>), 200)]
        public IActionResult GetSeasonGames(string seasonId)
        {
            var seasonResult = TransactionService.GetSeasonGames(seasonId);

            return Result(seasonResult);
        }

        [HttpPost("games")]
        [ProducesResponseType(typeof(Game), 200)]
        public async Task<IActionResult> AddGameAsync([FromBody] AddGameVM request)
        {
            var gameResult = await TransactionService.AddGameAsync(request.HomeTeamId, request.VisitorTeamId, request.At);

            return Result(gameResult);
        }

        [HttpGet("games/{gameId}/players")]
        [ProducesResponseType(typeof(List<ParticipatingPlayerVM>), 200)]
        public IActionResult GetGamePlayers(string gameId)
        {
            var seasonResult = TransactionService.GetGamePlayers(gameId);

            return Result(seasonResult);
        }

        [HttpGet("games/{gameId}/players/{playerId}/participation")]
        [ProducesResponseType(typeof(Participation), 200)]
        public IActionResult GetParticipation(string gameId, string playerId)
        {
            var participationResult = TransactionService.GetParticipation(gameId, playerId);

            return Result(participationResult);
        }

        [HttpPost("plays")]
        [ProducesResponseType(typeof(Participation), 200)]
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