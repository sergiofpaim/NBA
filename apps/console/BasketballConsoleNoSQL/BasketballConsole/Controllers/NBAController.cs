using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NBA.Services;
using NBA.ViewModels;

namespace NBA.Controllers
{
    [ApiController]
    [Route("nba")]
    public class NBAController : ControllerBase
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

            var playResult = NBAService.AddPlay(request.PlayerId, gameResult.Game, request.Quarter, gameResult.IsHomePlayer, request.PlayType, PLAYS_TO_TAKE);
            if (playResult.Code == 0)
                return Ok(new
                {
                    Message = "Play added successfully.",
                    Data = playResult.Participation.Plays
                });

            return BadRequest("Play failed to be added");
        }

        [HttpPost("add/game")]
        public IActionResult AddGame([FromBody] AddGameVM request)
        {
            var gameResult = NBAService.AddGame(request.HomeTeamId, request.VisitorTeamId, request.At);
            if (gameResult.Code == 0)
                return Ok("Game created successfully");

            return BadRequest("Game failed to be created.");
        }

        [HttpGet("list/play")]
        public IActionResult ListPlay(string gameId, string playerId)
        {
            var gameResult = NBAService.CheckGameForPlayer(gameId, playerId);
            if (gameResult.Code != 0)
                return BadRequest("Player does not participate in the game.");

            var participationResult = NBAService.GetParticipation(gameId, playerId);

            return Ok(new
            {
                Message = "Plays retrieved successfully.",
                Data = participationResult.Participation.Plays
            });
        }


        [HttpGet("reseed")]
        public IActionResult Reseed()
        {
            var result = NBAService.Reseed();

            return Ok("Data reseeded.");
        }
    }
}