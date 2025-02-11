package com.nba.basketball_microservice.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nba.basketball_microservice.infrastructure.BasketballController;
import com.nba.basketball_microservice.infrastructure.BasketballResponse;
import com.nba.basketball_microservice.models.Type.PlayType;
import com.nba.basketball_microservice.services.TransactionService;
import com.nba.basketball_microservice.viewmodels.GameVM;
import com.nba.basketball_microservice.viewmodels.ParticipatingPlayerVM;
import com.nba.basketball_microservice.viewmodels.ParticipationVM;
import com.nba.basketball_microservice.viewmodels.SeasonVM;
import com.nba.basketball_microservice.viewmodels.TeamScalationVM;
import com.nba.basketball_microservice.viewmodels.transactional.AddGameVM;
import com.nba.basketball_microservice.viewmodels.transactional.AddPlayVM;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/transaction")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController extends BasketballController {

    private static final int PLAYS_TO_TAKE = 5;

    @Autowired
    @GetMapping("/seasons")
    public ResponseEntity<BasketballResponse<List<SeasonVM>>> getSeasons() {
        var seasonResult = TransactionService.getSeasons();
        return ResponseEntity.ok(seasonResult);
    }

    @GetMapping("/seasons/last/games")
    public ResponseEntity<BasketballResponse<List<GameVM>>> getLastSeasonGames() {
        var seasonResult = TransactionService.getLastSeasonGames();
        return ResponseEntity.ok(seasonResult);
    }

    @GetMapping("/seasons/{seasonId}/games")
    public ResponseEntity<BasketballResponse<List<GameVM>>> getSeasonGames(@PathVariable String seasonId) {
        var seasonResult = TransactionService.getSeasonGames(seasonId);
        return ResponseEntity.ok(seasonResult);
    }

    @GetMapping("/seasons/last/teams")
    public ResponseEntity<BasketballResponse<List<TeamScalationVM>>> getLastSeasonTeams() {
        var seasonResult = TransactionService.getLastSeasonTeams();
        return ResponseEntity.ok(seasonResult);
    }

    @PostMapping("/games")
    public CompletableFuture<ResponseEntity<Object>> addGameAsync(@RequestBody AddGameVM request) {
        if (isInvalid(request)) {
            return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(getValidationError()));
        }

        return TransactionService.addGameAsync(request.getHomeTeamId(), request.getVisitorTeamId(), request.getAt())
                .thenApply(this::result);
    }

    @GetMapping("/games/{gameId}/players")
    public ResponseEntity<BasketballResponse<List<ParticipatingPlayerVM>>> getParticipatingPlayers(
            @PathVariable String gameId) {
        var seasonResult = TransactionService.getParticipatingPlayers(gameId);
        return ResponseEntity.ok(seasonResult);
    }

    @GetMapping("/games/{gameId}/players/{playerId}/participation")
    public ResponseEntity<BasketballResponse<ParticipationVM>> getParticipation(@PathVariable String gameId,
            @PathVariable String playerId) {
        var participationResult = TransactionService.getParticipation(gameId,
                playerId, PLAYS_TO_TAKE);
        return ResponseEntity.ok(participationResult);
    }

    @PostMapping("/plays")
    public CompletableFuture<ResponseEntity<Object>> addPlayAsync(
            @RequestBody AddPlayVM request) {
        if (isInvalid(request)) {
            return CompletableFuture.completedFuture(ResponseEntity.badRequest().body(getValidationError()));
        }
        PlayType playType = PlayType.valueOf(request.getType());
        return TransactionService
                .addPlayAsync(request.getPlayerId(), request.getGameId(), request.getQuarter(), playType,
                        PLAYS_TO_TAKE)
                .thenApply(ResponseEntity::ok);
    }

    // @DeleteMapping("/plays/participation/{participationId}/at/{at}")
    // public CompletableFuture<ResponseEntity<BasketballResponse<ParticipationVM>>>
    // deletePlay(
    // @PathVariable String participationId,
    // @PathVariable TimeSpan at) {
    // return TransactionService.deletePlay(participationId, at, PLAYS_TO_TAKE)
    // .thenApply(ResponseEntity::ok);
    // }
}
