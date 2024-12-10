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
        const int PLAYS_TO_TAKE = 5;

        [HttpGet("seasons")]
        [ProducesResponseType(typeof(BasketballResponse<List<SeasonVM>>), 200)]
        public IActionResult GetSeasons()
        {
            var seasonResult = TransactionService.GetSeasons();

            return Result(seasonResult);
        }

        [HttpGet("seasons/last/games")]
        [ProducesResponseType(typeof(BasketballResponse<List<GameVM>>), 200)]
        public IActionResult GetLastSeasonGames()
        {
            var seasonResult = TransactionService.GetLastSeasonGames();

            return Result(seasonResult);
        }

        [HttpGet("seasons/{seasonId}/games")]
        [ProducesResponseType(typeof(BasketballResponse<List<GameVM>>), 200)]
        public IActionResult GetSeasonGames(string seasonId)
        {
            var seasonResult = TransactionService.GetSeasonGames(seasonId);

            return Result(seasonResult);
        }
        
        [HttpGet("seasons/{seasonId}/teams")]
        [ProducesResponseType(typeof(BasketballResponse<List<TeamScalationVM>>), 200)]
        public IActionResult GetSeasonTeams(string seasonId)
        {
            var seasonResult = TransactionService.GetSeasonTeams(seasonId);

            return Result(seasonResult);
        }

        [HttpPost("games")]
        [ProducesResponseType(typeof(BasketballResponse<Game>), 200)]
        public async Task<IActionResult> AddGameAsync([FromBody] AddGameVM request)
        {
            if (IsInvalid(request))
                return BadRequest(ValidationError);

            var gameResult = await TransactionService.AddGameAsync(request.HomeTeamId, request.VisitorTeamId, request.At);

            return Result(gameResult);
        }

        [HttpGet("games/{gameId}/players")]
        [ProducesResponseType(typeof(BasketballResponse<List<ParticipatingPlayerVM>>), 200)]
        public IActionResult GetParticipatingPlayers(string gameId)
        {
            var seasonResult = TransactionService.GetParticipatingPlayers(gameId);

            return Result(seasonResult);
        }

        [HttpGet("games/{gameId}/players/{playerId}/participation")]
        [ProducesResponseType(typeof(BasketballResponse<ParticipationVM>), 200)]
        public IActionResult GetParticipation(string gameId, string playerId)
        {
            var participationResult = TransactionService.GetParticipation(gameId, playerId);

            return Result(participationResult);
        }

        [HttpPost("plays")]
        [ProducesResponseType(typeof(BasketballResponse<ParticipationVM>), 200)]
        public async Task<IActionResult> AddPlayAsync([FromBody] AddPlayVM request)
        {
            if (IsInvalid(request))
                return BadRequest(ValidationError);

            var playType = Enum.Parse<PlayType>(request.Type);

            var playResult = await TransactionService.AddPlayAsync(request.PlayerId, request.GameId, request.Quarter, playType, PLAYS_TO_TAKE);

            return Result(playResult);
        }

        [HttpDelete("plays/participation/{participationId}")]
        [ProducesResponseType(typeof(BasketballResponse<ParticipationVM>), 200)]
        public async Task<IActionResult> DeletePlayAsync(string participationId, TimeSpan at)
        {
            var playResult = await TransactionService.DeletePlayAsync(participationId, at, PLAYS_TO_TAKE);

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