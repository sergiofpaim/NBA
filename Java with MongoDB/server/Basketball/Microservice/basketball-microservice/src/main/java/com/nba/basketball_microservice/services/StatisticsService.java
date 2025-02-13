package com.nba.basketball_microservice.services;

import com.nba.basketball_microservice.infrastructure.BasketballService;
import com.nba.basketball_microservice.models.Participation;
import com.nba.basketball_microservice.models.ValueObjects.GamePlay;
import com.nba.basketball_microservice.viewmodels.statistics.PlayerStatisticsInGameVM;
import com.nba.basketball_microservice.viewmodels.statistics.PlayerStatisticsInSeasonVM;
import com.mongodb.client.model.Filters;
import com.nba.basketball_microservice.infrastructure.Basketball;
import com.nba.basketball_microservice.infrastructure.BasketballResponse;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class StatisticsService extends BasketballService {

        public static BasketballResponse<PlayerStatisticsInSeasonVM> getPlayerInSeason(String seasonId,
                        String playerId) {
                List<Participation> participations = Basketball.getRepo().get(Participation.class,
                                Filters.and(Filters.eq("seasonId", seasonId), Filters.eq("playerId", playerId)),
                                null, false, null);

                if (participations.isEmpty()) {
                        return notFound("Player does not participate in the season.");
                }

                List<GamePlay> plays = participations.stream()
                                .flatMap(p -> p.getPlays().stream())
                                .collect(Collectors.toList());

                return success(PlayerStatisticsInSeasonVM.factorFrom(participations.size(), plays), null);
        }

        public static BasketballResponse<List<PlayerStatisticsInGameVM>> getPlayerInGame(String gameId,
                        String playerId) {
                List<Participation> participations = Basketball.getRepo().get(
                                Participation.class,
                                Filters.and(Filters.eq("gameId", gameId), Filters.eq("playerId", playerId)),
                                null,
                                false,
                                null);

                var participation = participations.isEmpty() ? null : participations.get(0);

                if (participation == null) {
                        return notFound("Player does not participate in the game.");
                }

                List<PlayerStatisticsInGameVM> stats = participation.getPlays().stream()
                                .collect(Collectors.groupingBy(GamePlay::getType))
                                .entrySet().stream()
                                .map(entry -> PlayerStatisticsInGameVM.factorFrom(
                                                entry.getKey(),
                                                entry.getValue().size(),
                                                entry.getValue().stream()
                                                                .mapToInt(p -> p.getPoints() != null ? p.getPoints()
                                                                                : 0)
                                                                .sum()))
                                .sorted(Comparator.comparing(PlayerStatisticsInGameVM::getType))
                                .collect(Collectors.toList());

                return success(stats, null);
        }

        public static BasketballResponse<Object> reseed() {
                try {
                        Basketball.getRepo().reseed();
                        return success(null, "Reseed completed.");
                } catch (Exception e) {
                        System.err.println(e);
                        throw e;
                }
        }
}