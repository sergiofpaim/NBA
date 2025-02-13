package com.nba.basketball_microservice.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.nba.basketball_microservice.infrastructure.BasketballController;
import com.nba.basketball_microservice.infrastructure.BasketballResponse;
import com.nba.basketball_microservice.infrastructure.MongoDBRepo;
import com.nba.basketball_microservice.models.Type.PlayType;
import com.nba.basketball_microservice.services.StatisticsService;
import com.nba.basketball_microservice.services.TransactionService;
import com.nba.basketball_microservice.viewmodels.GameVM;
import com.nba.basketball_microservice.viewmodels.ParticipatingPlayerVM;
import com.nba.basketball_microservice.viewmodels.ParticipationVM;
import com.nba.basketball_microservice.viewmodels.SeasonVM;
import com.nba.basketball_microservice.viewmodels.TeamScalationVM;
import com.nba.basketball_microservice.viewmodels.transactional.AddGameVM;
import com.nba.basketball_microservice.viewmodels.transactional.AddPlayVM;
import java.util.List;

@RestController
@RequestMapping("/transaction")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController extends BasketballController {

    private static final int PLAYS_TO_TAKE = 5;

    @Autowired
    @GetMapping("/seasons")
    public ResponseEntity<BasketballResponse<List<SeasonVM>>> getSeasons() {
        var seasons = TransactionService.getSeasons();
        return result(seasons);
    }

    @GetMapping("/seasons/last/games")
    public ResponseEntity<BasketballResponse<List<GameVM>>> getLastSeasonGames() {
        var games = TransactionService.getLastSeasonGames();
        return result(games);
    }

    @GetMapping("/seasons/{seasonId}/games")
    public ResponseEntity<BasketballResponse<List<GameVM>>> getSeasonGames(@PathVariable String seasonId) {
        var games = TransactionService.getSeasonGames(seasonId);
        return result(games);
    }

    @GetMapping("/seasons/last/teams")
    public ResponseEntity<BasketballResponse<List<TeamScalationVM>>> getLastSeasonTeams() {
        var teams = TransactionService.getLastSeasonTeams();
        return result(teams);
    }

    @PostMapping("/games")
    public ResponseEntity<BasketballResponse<GameVM>> addGameAsync(@RequestBody AddGameVM request) {
        if (isInvalid(request))
            return badRequest();

        var game = TransactionService.addGame(request.getHomeTeamId(), request.getVisitorTeamId(), request.getAt());

        return result(game);
    }

    @GetMapping("/games/{gameId}/players")
    public ResponseEntity<BasketballResponse<List<ParticipatingPlayerVM>>> getParticipatingPlayers(
            @PathVariable String gameId) {
        var seasonResult = TransactionService.getParticipatingPlayers(gameId);
        return result(seasonResult);
    }

    @GetMapping("/games/{gameId}/players/{playerId}/participation")
    public ResponseEntity<BasketballResponse<ParticipationVM>> getParticipation(@PathVariable String gameId,
            @PathVariable String playerId) {
        var participationResult = TransactionService.getParticipation(gameId,
                playerId, PLAYS_TO_TAKE);
        return result(participationResult);
    }

    @PostMapping("/plays")
    public ResponseEntity<BasketballResponse<ParticipationVM>> addPlay(
            @RequestBody AddPlayVM request) {
        if (isInvalid(request)) {
            return badRequest();
        }
        PlayType playType = PlayType.valueOf(request.getType());
        var play = TransactionService.addPlay(request.getPlayerId(), request.getGameId(), request.getQuarter(),
                playType, PLAYS_TO_TAKE);

        return result(play);
    }

    @DeleteMapping("/plays/participation/{participationId}/at/{at}")
    public ResponseEntity<BasketballResponse<ParticipationVM>> deletePlay(
            @PathVariable String participationId,
            @PathVariable String at) {

        if (!MongoDBRepo.isTimeSpan(at))
            return badRequest("Invalid time span");

        var participation = TransactionService.deletePlay(participationId, at, PLAYS_TO_TAKE);

        return result(participation);
    }

    @PutMapping("/reseed")
    public ResponseEntity<BasketballResponse<Object>> reseed() {

        var result = StatisticsService.reseed();
        return result(result);

    }
}