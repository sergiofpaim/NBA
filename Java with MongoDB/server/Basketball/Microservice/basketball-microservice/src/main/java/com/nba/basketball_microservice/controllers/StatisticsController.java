package com.nba.basketball_microservice.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.nba.basketball_microservice.infrastructure.BasketballResponse;
import com.nba.basketball_microservice.services.StatisticsService;
import com.nba.basketball_microservice.viewmodels.statistics.PlayerStatisticsInGameVM;
import com.nba.basketball_microservice.viewmodels.statistics.PlayerStatisticsInSeasonVM;

import java.util.List;

@RestController
@RequestMapping("/statistics")
@CrossOrigin(origins = "http://localhost:3000")
public class StatisticsController {

    @GetMapping("/seasons/{seasonId}/players/{playerId}")
    public ResponseEntity<BasketballResponse<PlayerStatisticsInSeasonVM>> getPlayerInSeason(
            @PathVariable String seasonId,
            @PathVariable String playerId) {

        var participationResult = StatisticsService.getPlayerInSeason(seasonId, playerId);

        return ResponseEntity.ok(participationResult);
    }

    @GetMapping("/games/{gameId}/players/{playerId}")
    public ResponseEntity<BasketballResponse<List<PlayerStatisticsInGameVM>>> getPlayerInGame(
            @PathVariable String gameId,
            @PathVariable String playerId) {

        var participationResult = StatisticsService.getPlayerInGame(gameId,
                playerId);

        return ResponseEntity.ok(participationResult);
    }
}