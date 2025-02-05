package com.nba.basketball_microservice.services;

import com.nba.basketball_microservice.infrastructure.BasketballService;
import com.nba.basketball_microservice.models.Participation;
import com.nba.basketball_microservice.models.ValueObjects.GamePlay;
import com.nba.basketball_microservice.viewmodels.statistics.PlayerStatisticsInGameVM;
import com.nba.basketball_microservice.viewmodels.statistics.PlayerStatisticsInSeasonVM;
import com.nba.basketball_microservice.infrastructure.Basketball;
import com.nba.basketball_microservice.infrastructure.BasketballResponse;

import java.util.List;
import java.util.stream.Collectors;

public class StatisticsService extends BasketballService {

        public static BasketballResponse<PlayerStatisticsInSeasonVM> getPlayerInSeason(String seasonId,
                        String playerId) {
                List<Participation> participations = Basketball.getRepo().get(
                                p -> p.getSeasonId().equals(seasonId) && p.getPlayerId().equals(playerId),
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
                Participation participation = (Participation) Basketball.getRepo().get(
                                p -> ((Participation) p).getGameId().equals(gameId)
                                                && ((Participation) p).getPlayerId().equals(playerId),
                                null, false, 1).stream().findFirst().orElse(null);

                if (participation == null) {
                        return notFound("Player does not participate in the game.");
                }

                List<PlayerStatisticsInGameVM> stats = participation.getPlays().stream()
                                .collect(Collectors.groupingBy(p -> p.getType()))
                                .entrySet().stream()
                                .map(entry -> PlayerStatisticsInGameVM.factorFrom(entry.getKey(),
                                                entry.getValue().size(),
                                                entry.getValue().stream().mapToInt(p -> p.getPoints().orElse(0)).sum()))
                                .sorted((s1, s2) -> Integer.compare(Integer.parseInt(s1.getType()),
                                                Integer.parseInt(s2.getType())))
                                .collect(Collectors.toList());

                return success(stats, null);
        }

        public static BasketballResponse<Object> reseed() {
                Basketball.getRepo().reseedAsync();
                return success(null, "Reseed completed.");
        }
}
